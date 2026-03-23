"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  // Strategy: Try with token first, if it fails with 401, retry unauthenticated
  const fetchWithRetry = async (useToken: boolean) => {
    const octokit = new Octokit({ 
      auth: useToken ? process.env.GITHUB_TOKEN : undefined 
    });

    try {
      // 1. Fetch User
      const { data: user } = await octokit.rest.users.getByUsername({ username });

      // 2. Parallel Fetch for stats
      let repos: any[] = [];
      let allRepos: any[] = [];
      let events: any[] = [];

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

      const totalStars = allRepos.reduce(
        (acc, repo) => acc + (typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0), 0
      );

      const contributions = events.filter(
        e => e.type === "PushEvent" || e.type === "PullRequestEvent"
      ).length;

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
      // If we used a token and it returned 401/403, retry without token
      if (useToken && (error.status === 401 || error.status === 403)) {
        console.warn(`[github_auth_fallback] Token failed for ${username}, retrying unauthenticated.`);
        return fetchWithRetry(false);
      }
      throw error;
    }
  };

  try {
    return await fetchWithRetry(!!process.env.GITHUB_TOKEN);
  } catch (error) {
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
