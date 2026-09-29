"use server";

import { searchGitHubDevelopers, type DevSearchResult } from "@/lib/dev-search";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function askDevSearch(query: string): Promise<DevSearchResult> {
  const limit = await rateLimit(`dev-search:${await clientIp()}`, { limit: 20, windowSec: 60 });
  if (!limit.ok) {
    return {
      ok: false,
      query,
      filters: { keywords: null, language: null, location: null, minFollowers: null, minRepos: null, sort: null },
      totalCount: 0,
      users: [],
      error: "Too many searches — wait a minute and try again.",
    };
  }
  return searchGitHubDevelopers(query.slice(0, 300), 9);
}
