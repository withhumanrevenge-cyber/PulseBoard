"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  const octokit = new Octokit();

  try {
    const { data: user } = await octokit.rest.users.getByUsername({ username });
    
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: "updated",
      per_page: 10,
    });

    const { data: allRepos } = await octokit.rest.repos.listForUser({
      username,
      per_page: 100,
    });
    
    const totalStars = allRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    
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
      topLanguage: repos[0]?.language || "Unknown",
      repos: repos.slice(0, 4).map(repo => ({
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
