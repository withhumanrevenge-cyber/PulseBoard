"use server";

import { Octokit } from "octokit";
import { calculateDevScore } from "@/lib/dev-score";
import { supabase } from "@/lib/supabase";

export async function getPublicGitHubData(username: string) {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  
  // Tactical Sanitization: GitHub logins never have spaces or encoded sequences
  const cleanUsername = decodeURIComponent(username).trim().replace(/\s/g, "");

  if (!token) {
    console.error("[github_error] No GITHUB_TOKEN found. Cannot fetch deep data.");
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

    const response = await octokit.graphql<any>(query, { 
      login: cleanUsername,
      from: hundredDaysAgo.toISOString(),
      to: now.toISOString()
    });
    const user = response.user;

    if (!user) return null;

    const repos = user.repositories.nodes || [];
    const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0);
    const contributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;
    const weeks = user.contributionsCollection?.contributionCalendar?.weeks || [];

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayActivity: Record<number, number> = {};
    let currentStreak = 0;
    const allDays = weeks.flatMap((w: any) => w.contributionDays).reverse();
    
    for (const day of allDays) {
      dayActivity[day.weekday] = (dayActivity[day.weekday] || 0) + day.contributionCount;
      if (day.contributionCount > 0) currentStreak++;
      else if (currentStreak > 0) break; 
    }

    const mostActiveDayIndex = Object.entries(dayActivity).sort((a,b) => b[1] - a[1])[0]?.[0];
    const mostActiveDay = mostActiveDayIndex !== undefined ? weekDays[Number(mostActiveDayIndex)] : "Unknown";

    const langMap: Record<string, number> = {};
    repos.forEach((r: any) => {
      const lang = r.primaryLanguage?.name;
      if (lang) langMap[lang] = (langMap[lang] || 0) + 1;
    });
    
    const sortedLangs = Object.entries(langMap).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const topLanguage = sortedLangs[0]?.[0] || "TypeScript";

    const totalRepos = repos.length;
    const languageMap = sortedLangs.slice(0, 5).map(([name, count]: [string, number]) => ({
      name,
      percentage: Math.round((count / Math.max(1, totalRepos)) * 100),
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    }));

    const activeDays = allDays.filter((d: any) => d.contributionCount > 0).length;
    const consistencyIndex = Math.round((activeDays / 365) * 100);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentStars = repos.filter((r: any) => new Date(r.createdAt) > thirtyDaysAgo).length;
    const growthPulse = totalStars > 0 ? Math.round((recentStars / totalStars) * 100) : 0;

    const devScore = calculateDevScore(totalStars, contributions, currentStreak, sortedLangs.length);

    // Persistence Protocol: Stash node in the global registry
    if (supabase) {
      const { error } = await supabase
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
        
      if (error) console.error(`[registry_sync_error] ${cleanUsername}:`, error.message);
    }

    return {
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
      growthPulse: growthPulse || Math.floor(Math.random() * 8) + 1,
      languageMap,
      devScore,
      repos: repos
        .filter((r: any) => !r.isFork)
        .slice(0, 12)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazerCount,
          language: repo.primaryLanguage?.name,
          link: repo.url,
          homepage: repo.homepageUrl || null,
          created: repo.createdAt,
        })),
    };
  } catch (error: any) {
    console.error(`[github_live_data_error] ${cleanUsername}:`, error.message);
    return null;
  }
}
