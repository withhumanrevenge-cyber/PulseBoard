"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  const octokit = new Octokit();

  try {
    const { data: user } = await octokit.rest.users.getByUsername({ username });
    
    const [repos, allRepos] = await Promise.all([
      octokit.rest.repos.listForUser({
        username,
        sort: "updated",
        per_page: 20,
      }).then(res => res.data).catch(() => []),
      octokit.paginate(octokit.rest.repos.listForUser, {
        username,
        per_page: 100,
      }).catch(() => [])
    ]);

    const totalStars = allRepos.length > 0 
      ? allRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)
      : 0;
    
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 50,
    });

    return {
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      totalStars,
      contributions: events.filter(e => e.type === "PushEvent" || e.type === "PullRequestEvent").length,
      topLanguage: allRepos.length > 0 
        ? Object.entries(allRepos.reduce((acc, r) => {
            if (r.language) acc[r.language] = (acc[r.language] || 0) + (r.stargazers_count || 0) + 1;
            return acc;
          }, {} as Record<string, number>)).sort((a,b) => b[1] - a[1])[0]?.[0] || "TypeScript"
        : "TypeScript",
      repos: repos.filter(r => !r.fork).slice(0, 8).map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        link: repo.html_url,
      })),
    };
  } catch (error) {
    console.error(`[github_public_error] ${username}:`, error);
    return null;
  }
}
