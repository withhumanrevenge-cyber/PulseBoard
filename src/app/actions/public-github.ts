"use server";

import { Octokit } from "octokit";
import { calculateDevScore, type DevScoreMetrics } from "@/lib/dev-score";
import { supabaseAdmin } from "@/lib/supabase";

type ContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

type RepoNode = {
  name: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  url: string;
  homepageUrl: string | null;
  isFork: boolean;
  createdAt: string;
};

type PublicGitHubResponse = {
  user: {
    name: string | null;
    login: string;
    avatarUrl: string;
    bio: string | null;
    createdAt: string;
    followers: { totalCount: number };
    contributionsCollection: { contributionCalendar: ContributionCalendar };
    repositories: { totalCount: number; nodes: RepoNode[] };
  };
};

export type PublicGitHubProfile = {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
  totalStars: number;
  contributions: number;
  followers: number;
  joined: string;
  topLanguage: string;
  streak: number;
  mostActiveDay: string;
  consistencyIndex: number;
  growthPulse: number;
  languageMap: { name: string; percentage: number; color: string }[];
  devScore: DevScoreMetrics;
  totalRepos: number;
  totalContributions: number;
  repos: {
    name: string;
    description: string | null;
    stars: number;
    language?: string | null;
    link: string;
    homepage: string | null;
    created: string;
  }[];
};

export async function getPublicGitHubData(username: string): Promise<PublicGitHubProfile | null> {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  
  const cleanUsername = decodeURIComponent(username).trim().replace(/\s/g, "");

  if (!token) {
    console.error("[GITHUB_DATA_ERROR] Missing GITHUB_TOKEN");
    return null;
  }

  const octokit = new Octokit({ auth: token });

  try {
    const hundredDaysAgo = new Date();
    hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
    const now = new Date();

    const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          name
          login
          avatarUrl
          bio
          createdAt
          followers { totalCount }
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            totalCount
            nodes {
              name
              description
              stargazerCount
              primaryLanguage {
                name
              }
              url
              homepageUrl
              isFork
              createdAt
            }
          }
        }
      }
    `;

    const response = await octokit.graphql<PublicGitHubResponse>(query, { 
      login: cleanUsername,
      from: hundredDaysAgo.toISOString(),
      to: now.toISOString()
    });
    const user = response.user;

    if (!user) return null;

    const repos = user.repositories.nodes || [];
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazerCount || 0), 0);
    const contributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
    const weeks = user.contributionsCollection?.contributionCalendar?.weeks || [];

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayActivity: Record<number, number> = {};
    let currentStreak = 0;
    const allDays = weeks.flatMap((w) => w.contributionDays).reverse();
    
    for (const day of allDays) {
      dayActivity[day.weekday] = (dayActivity[day.weekday] || 0) + day.contributionCount;
      if (day.contributionCount > 0) currentStreak++;
      else if (currentStreak > 0) break; 
    }

    const mostActiveDayIndex = Object.entries(dayActivity).sort((a,b) => b[1] - a[1])[0]?.[0];
    const mostActiveDay = mostActiveDayIndex !== undefined ? weekDays[Number(mostActiveDayIndex)] : "Unknown";

    const langMap: Record<string, number> = {};
    repos.forEach((r) => {
      const lang = r.primaryLanguage?.name;
      if (lang) langMap[lang] = (langMap[lang] || 0) + 1;
    });
    
    const langColors: Record<string, string> = {
      TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
      Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
      HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Swift: "#ffac45",
      PHP: "#4F5D95", Java: "#b07219", "C#": "#178600"
    };

    const getLangColor = (name: string) => langColors[name] || "#716b64";

    const sortedLangs = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
    const topLanguage = sortedLangs[0]?.[0] || "TypeScript";

    const totalRepos = repos.length;
    const languageMap = sortedLangs.slice(0, 5).map(([name, count]) => ({
      name,
      percentage: Math.round((count / Math.max(1, totalRepos)) * 100),
      color: getLangColor(name)
    }));

    const activeDaysCount = allDays.filter((d) => d.contributionCount > 0).length;
    const consistencyIndex = Math.round((activeDaysCount / 100) * 100);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReposCount = repos.filter((r) => new Date(r.createdAt) > thirtyDaysAgo).length;
    const growthPulse = totalStars > 0 ? Math.round((recentReposCount / totalStars) * 100) : 0;

    const devScore = calculateDevScore(totalStars, contributions, currentStreak, sortedLangs.length);

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from("talents")
        .upsert({
          username: cleanUsername,
          full_name: user.name || user.login,
          avatar_url: user.avatarUrl,
          total_stars: totalStars,
          dev_score: devScore.total,
          top_language: topLanguage,
          last_fetch: new Date().toISOString(),
        }, { onConflict: 'username' });
        
      if (error) console.error("[REGISTRY_SYNC_ERROR]", error.message);
    }

    return {
      username: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      totalStars,
      contributions,
      followers: user.followers.totalCount,
      joined: user.createdAt,
      topLanguage,
      streak: currentStreak,
      mostActiveDay,
      consistencyIndex,
      growthPulse: growthPulse || 1,
      languageMap,
      devScore,
      totalRepos: user.repositories.totalCount,
      totalContributions: contributions,
      repos: repos
        .filter((r) => !r.isFork)
        .slice(0, 12)
        .map((repo) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazerCount,
          language: repo.primaryLanguage?.name,
          link: repo.url,
          homepage: repo.homepageUrl || null,
          created: repo.createdAt,
        })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[GITHUB_LIVE_FETCH_ERROR]", message);
    return null;
  }
}
