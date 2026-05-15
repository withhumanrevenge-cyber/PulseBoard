"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { supabaseAdmin } from "@/lib/supabase";

export interface GitHubRepo {
  name: string;
  stars: number;
  language: string | null;
  updated: string;
  url: string;
  homepage?: string | null;
}

export interface GitHubMetrics {
  username: string;
  avatarUrl: string;
  totalStars: number;
  contributionCount: number;
  topLanguage: string;
  activeDays: string;
  recentRepos: GitHubRepo[];
  languageMap: { name: string; percentage: number; color: string }[];
  streak: number;
  weeklyContributions: number[];
}

type ContributionDay = {
  contributionCount: number;
  date: string;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

type ContributionsResponse = {
  user: { contributionsCollection: { contributionCalendar: ContributionCalendar } };
};

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
  HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Swift: "#ffac45",
  PHP: "#4F5D95", Java: "#b07219", "C#": "#178600"
};

const getLangColor = (name: string) => langColors[name] || "#716b64";

export async function getGitHubStats(): Promise<GitHubMetrics | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const client = await clerkClient();
    const oauthToken = await client.users.getUserOauthAccessToken(userId, "oauth_github");

    if (!oauthToken || oauthToken.data.length === 0) return null;

    const token = oauthToken.data[0].token;
    const octokit = new Octokit({ auth: token });
    const username = (await octokit.rest.users.getAuthenticated()).data.login;

    const [allRepos, contributionResponse] = await Promise.all([
      octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
        sort: "updated",
        per_page: 100,
        visibility: "all"
      }),
      octokit.graphql<ContributionsResponse>(`
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                   contributionDays {
                      contributionCount
                      date
                   }
                }
              }
            }
          }
        }
      `, { login: username }).catch(() => ({
        user: { contributionsCollection: { contributionCalendar: { totalContributions: 0, weeks: [] } } }
      }))
    ]);

    const totalStars = allRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const contributionCount = contributionResponse.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;

    const langMap: Record<string, number> = {};
    allRepos.forEach(r => {
      if (r.language) {
        langMap[r.language] = (langMap[r.language] || 0) + (r.stargazers_count || 0) + 1;
      }
    });

    const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
    const topLanguage = sortedLangs[0]?.[0] || "TypeScript";

    const totalWeight = Object.values(langMap).reduce((a, b) => a + b, 0);

    const languageMap = sortedLangs.slice(0, 5).map(([name, weight]) => ({
      name,
      percentage: Math.round((weight / Math.max(1, totalWeight)) * 100),
      color: getLangColor(name)
    }));

    let streak = 0;
    const allDays = contributionResponse.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.flatMap((w) => w.contributionDays)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
    
    for (const day of allDays) {
      if (day.contributionCount > 0) streak++;
      else if (streak > 0) break;
    }

    const weeklyContributions = contributionResponse.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.slice(-7)
      .map((w) => w.contributionDays.reduce((acc, d) => acc + d.contributionCount, 0)) || [0, 0, 0, 0, 0, 0, 0];

    const metrics: GitHubMetrics = {
      username,
      avatarUrl: allRepos[0]?.owner.avatar_url || "",
      totalStars,
      contributionCount,
      topLanguage,
      streak,
      languageMap,
      weeklyContributions,
      activeDays: `${Math.min(30, Math.ceil(contributionCount / 10))}/30`,
      recentRepos: allRepos.filter(r => !r.fork).slice(0, 12).map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count || 0,
        language: repo.language || null,
        updated: new Date(repo.updated_at || "").toLocaleDateString(),
        url: repo.html_url,
        homepage: repo.homepage || null,
      })),
    };

    if (supabaseAdmin) {
      await supabaseAdmin.from("users").upsert({
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
    console.error("[GITHUB_STATS_ERROR]", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function getWeeklyContributions(username: string): Promise<number[]> {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const response = await octokit.graphql<ContributionsResponse>(`
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                 contributionDays {
                    contributionCount
                 }
              }
            }
          }
        }
      }
    `, { login: username });

    return response.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.slice(-7)
      .map((w) => w.contributionDays.reduce((acc, d) => acc + d.contributionCount, 0)) || [0, 0, 0, 0, 0, 0, 0];
  } catch {
    return [0, 0, 0, 0, 0, 0, 0];
  }
}
export async function getTopGithubUsers() {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const { data } = await octokit.rest.search.users({
      q: "followers:>1000",
      sort: "followers",
      order: "desc",
      per_page: 10,
    });
    
    return data.items.map(user => ({
      username: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      type: user.type
    }));
  } catch (error) {
    console.error("[TOP_GITHUB_USERS_ERROR]", error);
    return [];
  }
}
