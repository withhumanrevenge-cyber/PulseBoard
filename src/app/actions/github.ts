"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { supabase } from "@/lib/supabase";

export interface GitHubRepo {
  name: string;
  stars: number;
  language: string | null;
  updated: string;
}

export interface GitHubMetrics {
  username: string;
  avatarUrl: string;
  totalStars: number;
  commitCount: number;
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
    const [{ data: user }, { data: repos }, { data: allRepos }, { data: events }] = await Promise.all([
      octokit.rest.users.getAuthenticated(),
      octokit.rest.repos.listForAuthenticatedUser({ sort: "updated", per_page: 5 }),
      octokit.rest.repos.listForAuthenticatedUser({ per_page: 100 }),
      octokit.rest.activity.listPublicEventsForUser({
        username: (await octokit.rest.users.getAuthenticated()).data.login,
        per_page: 100,
      }),
    ]);

    const totalStars = allRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const commitCount = events.filter(e => e.type === "PushEvent").length;

    const metrics: GitHubMetrics = {
      username: user.login,
      avatarUrl: user.avatar_url,
      totalStars,
      commitCount,
      topLanguage: repos[0]?.language || "Unknown",
      activeDays: "24/30",
      recentRepos: repos.map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        language: repo.language || null,
        updated: new Date(repo.updated_at || "").toLocaleDateString(),
      })),
    };

    if (supabase) {
      await supabase.from("users").upsert({
        clerk_id: userId,
        username: user.login,
        first_name: user.name || "",
        avatar_url: user.avatar_url,
      }, { onConflict: "clerk_id" });
    }

    return metrics;
  } catch (error) {
    console.error("[github_sync_error]", error instanceof Error ? error.message : error);
    return null;
  }
}
