"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  
  if (!token) {
    console.error("[github_error] No GITHUB_TOKEN found. Cannot fetch deep data.");
    return null;
  }

  const octokit = new Octokit({ auth: token });

  try {
    // Fetch User Profile and Stats via GraphQL for maximum accuracy (Lifetime data)
    const query = `
      query($login: String!) {
        user(login: $login) {
          name
          login
          avatarUrl
          bio
          contributionsCollection {
            contributionCalendar {
              totalContributions
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
              isFork
            }
          }
        }
      }
    `;

    const response = await octokit.graphql<any>(query, { login: username });
    const user = response.user;

    if (!user) return null;

    // Calculate total stars from ALL repositories (aggregating where possible)
    // For large accounts, this is the most reliable way to get public star totals
    const repos = user.repositories.nodes || [];
    const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazerCount || 0), 0);
    
    // Get Lifetime Contributions
    const contributions = user.contributionsCollection?.contributionCalendar?.totalContributions || 0;

    // Determine Top Tech
    const langMap: Record<string, number> = {};
    repos.forEach((r: any) => {
      const lang = r.primaryLanguage?.name;
      if (lang) langMap[lang] = (langMap[lang] || 0) + 1;
    });
    const topLanguage = Object.entries(langMap).sort((a,b) => b[1] - a[1])[0]?.[0] || "TypeScript";

    return {
      name: user.name || user.login,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      totalStars,
      contributions,
      topLanguage,
      repos: repos
        .filter((r: any) => !r.isFork)
        .slice(0, 8)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazerCount,
          language: repo.primaryLanguage?.name,
          link: repo.url,
        })),
    };
  } catch (error: any) {
    console.error(`[github_live_data_error] ${username}:`, error.message);
    
    // Final emergency fallback if GraphQL fails but REST might work
    try {
        const { data: restUser } = await octokit.rest.users.getByUsername({ username });
        return {
            name: restUser.name || restUser.login,
            avatarUrl: restUser.avatar_url,
            bio: restUser.bio,
            totalStars: 0,
            contributions: 0,
            topLanguage: "TypeScript",
            repos: []
        };
    } catch {
        return null;
    }
  }
}
