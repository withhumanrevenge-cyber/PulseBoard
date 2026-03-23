"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { supabase } from "@/lib/supabase";

export interface GitHubRepo {
  name: string;
  stars: number;
  language: string | null;
  updated: string;
  url: string;
}

export interface GitHubMetrics {
  username: string;
  avatarUrl: string;
  totalStars: number;
  contributionCount: number;
  topLanguage: string;
  activeDays: string;
  recentRepos: GitHubRepo[];
}

export async function getGitHubStats(): Promise<GitHubMetrics | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access attempt");

  const client = await clerkClient();
  const oauthToken = await client.users.getUserOauthAccessToken(userId, "oauth_github");

  if (!oauthToken || oauthToken.data.length === 0) {
    return null;
  }

  const token = oauthToken.data[0].token;
  const octokit = new Octokit({ auth: token });

  try {
    const username = (await octokit.rest.users.getAuthenticated()).data.login;

    const [allRepos, contributionResponse] = await Promise.all([
      octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
        sort: "updated",
        per_page: 100,
        visibility: "all"
      }),
      octokit.graphql<{ user: { contributionsCollection: { contributionCalendar: { totalContributions: number } } } }>(`
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `, { login: username }).catch(() => ({
        user: { contributionsCollection: { contributionCalendar: { totalContributions: 0 } } }
      }))
    ]);

    const totalStars = allRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const contributionCount = contributionResponse.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;

    const langMap: Record<string, number> = {};
    allRepos.forEach(r => {
      if (r.language) {

        const weight = (r.stargazers_count || 0) + 1;
        langMap[r.language] = (langMap[r.language] || 0) + weight;
      }
    });


    const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
    const topLanguage = sortedLangs.length > 1
      ? `${sortedLangs[0][0]} + ${sortedLangs[1][0]}`
      : sortedLangs[0]?.[0] || "TypeScript";

    const metrics: GitHubMetrics = {
      username,
      avatarUrl: allRepos[0]?.owner.avatar_url || "",
      totalStars,
      contributionCount,
      topLanguage,
      activeDays: `${Math.min(30, Math.ceil(contributionCount / 10))}/30`,
      recentRepos: allRepos.filter(r => !r.fork).slice(0, 12).map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        language: repo.language || null,
        updated: new Date(repo.updated_at || "").toLocaleDateString(),
        url: repo.html_url,
      })),
    };

    if (supabase) {
      await supabase.from("users").upsert({
        clerk_id: userId,
        username,
        avatar_url: metrics.avatarUrl,
        total_stars: metrics.totalStars,
        contribution_count: metrics.contributionCount,
        last_synced_at: new Date().toISOString()
      }, { onConflict: "clerk_id" });
    }

    return metrics;
  } catch (error) {
    console.error("[github_sync_error]", error instanceof Error ? error.message : error);
    return null;
  }
}
