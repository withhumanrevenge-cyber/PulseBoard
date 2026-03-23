"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  // Directly use only the token (as requested) from either common environment variable name
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
  
  const octokit = new Octokit({ 
    auth: token 
  });

  try {
    // 1. Fetch user (if this fails with 401/403, there's a token issue)
    const { data: user } = await octokit.rest.users.getByUsername({ username });

    let repos: any[] = [];
    let allRepos: any[] = [];
    let events: any[] = [];

    // Parallel fetch with settled promises so partial data can still be displayed
    await Promise.allSettled([
      octokit.rest.repos.listForUser({
        username,
        sort: "updated",
        per_page: 20,
      }).then(res => repos = res.data || []),
      
      octokit.paginate(octokit.rest.repos.listForUser, {
        username,
        per_page: 100,
      }).then(res => allRepos = res || []),
      
      octokit.rest.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      }).then(res => events = res.data || [])
    ]);

    // Safety: ensure star counts are strictly numbers (handles numeric-string status codes if any)
    const totalStars = allRepos.reduce(
      (acc, repo) => acc + (typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0), 0
    );

    const contributions = events.filter(
      e => e.type === "PushEvent" || e.type === "PullRequestEvent"
    ).length;

    // Fixed: Explicit type casting for TypeScript build success on Vercel
    const langFrequency = allRepos.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLanguage = (Object.entries(langFrequency) as [string, number][])
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "TypeScript";

    return {
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      totalStars,
      contributions,
      topLanguage,
      repos: (repos || [])
        .filter(r => !r.fork)
        .slice(0, 8)
        .map(repo => ({
          name: repo.name,
          description: repo.description,
          stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0,
          language: repo.language,
          link: repo.html_url,
        })),
    };
  } catch (error: any) {
    // Log exactly why it failed (useful for your debugging now)
    console.error(`[github_authenticated_error] Status ${error.status} for user ${username}:`, error.message);
    
    // Return null so the page shows the 'Profile Offline' screen (which ensures you know if the token is broken)
    return null;
  }
}
