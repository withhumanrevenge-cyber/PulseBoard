"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    // 1. Fetch user profile first (this is the most critical call)
    const { data: user } = await octokit.rest.users.getByUsername({ username });

    // 2. Fetch repos and events with separate try/catch blocks to ensure one failure doesn't kill the whole thing
    let repos: any[] = [];
    let allRepos: any[] = [];
    let events: any[] = [];

    try {
      const reposResponse = await octokit.rest.repos.listForUser({
        username,
        sort: "updated",
        per_page: 20,
      });
      repos = reposResponse.data || [];
    } catch (e) {
      console.error(`[github_repos_error] ${username}:`, e);
    }

    try {
      allRepos = await octokit.paginate(octokit.rest.repos.listForUser, {
        username,
        per_page: 100,
      });
    } catch (e) {
      console.error(`[github_paginate_error] ${username}:`, e);
    }

    try {
      const eventsResponse = await octokit.rest.activity.listPublicEventsForUser({
        username,
        per_page: 100,
      });
      events = eventsResponse.data || [];
    } catch (e) {
      console.error(`[github_events_error] ${username}:`, e);
    }

    // 3. Robust calculation logic
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

    const topLanguage = Object.entries(langFrequency)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "TypeScript";

    return {
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      totalStars: Math.max(0, totalStars),
      contributions: Math.max(0, contributions),
      topLanguage,
      repos: repos
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
    console.error(`[github_public_critical_error] ${username}:`, error);
    return null;
  }
}
