"use server";

import { Octokit } from "octokit";

export async function getPublicGitHubData(username: string) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

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

    const totalStars = allRepos.reduce(
      (acc, repo) => acc + (repo.stargazers_count || 0), 0
    );

    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

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
      totalStars,
      contributions,
      topLanguage,
      repos: repos
        .filter(r => !r.fork)
        .slice(0, 8)
        .map(repo => ({
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
