"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeGitHubLogin } from "@/lib/github-username";

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
  activeDaysTotal: number;
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
    const authUser = (await octokit.rest.users.getAuthenticated()).data;
    const username = authUser.login;
    const authAvatarUrl = authUser.avatar_url;

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

    // Newest-first, then walk from today back. A zero-day ends the streak
    // immediately — the previous code silently skipped leading zero-days and
    // credited a streak that already ended.
    const allDays = contributionResponse.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.flatMap((w) => w.contributionDays)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

    let streak = 0;
    for (const day of allDays) {
      if (day.contributionCount > 0) streak++;
      else break;
    }
    const activeDaysCount = allDays.filter((d) => d.contributionCount > 0).length;
    const activeDaysWindow = Math.min(allDays.length, 30);
    const activeDaysRecent = allDays.slice(0, activeDaysWindow).filter((d) => d.contributionCount > 0).length;

    const weeklyContributions = contributionResponse.user?.contributionsCollection?.contributionCalendar?.weeks
      ?.slice(-7)
      .map((w) => w.contributionDays.reduce((acc, d) => acc + d.contributionCount, 0)) || [0, 0, 0, 0, 0, 0, 0];

    const metrics: GitHubMetrics = {
      username,
      // getAuthenticated() is the source of truth; falling back to the first
      // repo's owner avatar was empty for users with zero repos.
      avatarUrl: authAvatarUrl || allRepos[0]?.owner.avatar_url || "",
      totalStars,
      contributionCount,
      topLanguage,
      streak,
      languageMap,
      weeklyContributions,
      // Real days-with-contributions in the last 30 days on record — the old
      // `Math.ceil(contributionCount / 10)` was a fake ratio unrelated to
      // whether the user actually pushed on those days.
      activeDays: `${activeDaysRecent}/${activeDaysWindow || 30}`,
      activeDaysTotal: activeDaysCount,
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
      const row = {
        clerk_id: userId,
        username,
        avatar_url: metrics.avatarUrl,
        total_stars: metrics.totalStars,
        contribution_count: metrics.contributionCount,
        last_synced_at: new Date().toISOString()
      };
      // Verified: `username` here came from the owner's own OAuth token.
      // Public-profile settings are keyed on github_login, never on Clerk's username.
      const { error } = await supabaseAdmin
        .from("users")
        .upsert({ ...row, github_login: username }, { onConflict: "clerk_id" });
      if (error) {
        console.warn("[USER_SYNC]", error.message, "— apply supabase/migrations/0002 to enable profile claims.");
        await supabaseAdmin.from("users").upsert(row, { onConflict: "clerk_id" });
      }
    }

    return metrics;
  } catch (error) {
    console.error("[GITHUB_STATS_ERROR]", error instanceof Error ? error.message : error);
    return null;
  }
}

const EMPTY_WEEKS = [0, 0, 0, 0, 0, 0, 0];

export async function getWeeklyContributions(username: string): Promise<number[]> {
  const login = normalizeGitHubLogin(username);
  if (!login) return EMPTY_WEEKS;
  try {
    return await unstable_cache(() => fetchWeeklyContributions(login), ["gh-weekly", login.toLowerCase()], {
      revalidate: 600,
    })();
  } catch {
    return EMPTY_WEEKS;
  }
}

async function fetchWeeklyContributions(username: string): Promise<number[]> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN });
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
    .map((w) => w.contributionDays.reduce((acc, d) => acc + d.contributionCount, 0)) || EMPTY_WEEKS;
}

export async function getTopGithubUsers() {
  try {
    // Failures throw out of the cache so an outage is not cached for a day.
    return await unstable_cache(fetchTopGithubUsers, ["gh-top-users"], { revalidate: 86400 })();
  } catch (error) {
    console.error("[TOP_GITHUB_USERS_ERROR]", error instanceof Error ? error.message : error);
    return [];
  }
}

async function fetchTopGithubUsers() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN });
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
}
