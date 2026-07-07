"use server";

import { searchGitHubDevelopers, type DevSearchResult } from "@/lib/dev-search";

export async function askDevSearch(query: string): Promise<DevSearchResult> {
  return searchGitHubDevelopers(query, 9);
}
