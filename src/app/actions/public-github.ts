"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  // Use the token if available, otherwise fall back to unauthenticated (limited to 60/hr)
  const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN || undefined 
  });

  try {
    let userData: any = null;
    try {
      const { data } = await octokit.rest.users.getByUsername({ username });
      userData = data;
    } catch (e) {
      console.warn(`[github_user_warning] Could not fetch user ${username} via authenticated API. Falling back.`);
      // Fallback: try unauthenticated fetch or just use username
      userData = {
        login: username,
        name: username,
        avatar_url: `https://github.com/${username}.png`,
        bio: "Build in Public enthusiast."
      };
    }

    let repos: any[] = [];
    let allRepos: any[] = [];
    let events: any[] = [];

    // Parallel fetch with individual catch-alls to ensure profile loads even if API is grumpy
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

    // Strict numeric extraction to prevent '404' or strings from leaking into stars count
    const totalStars = allRepos.reduce(
      (acc, repo) => acc + (typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0), 
      0
    );

    const contributions = events.filter(
      e => e.type === "PushEvent" || e.type === "PullRequestEvent"
    ).length;

    const langFrequency = allRepos.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLanguage = Object.entries(langFrequency)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "TypeScript";

    return {
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
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
  } catch (error) {
    // If we're here, it's a catastrophic error (not just an API 404/403)
    console.error(`[github_critical_error] ${username}:`, error);
    return {
        name: username,
        avatarUrl: `https://github.com/${username}.png`,
        bio: "GitHub profile temporarily unavailable.",
        totalStars: 0,
        contributions: 0,
        topLanguage: "N/A",
        repos: []
    };
  }
}
