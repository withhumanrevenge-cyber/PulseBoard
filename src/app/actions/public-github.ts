"use server";

// Client-callable wrapper. Server code (pages, API routes, PulseAI) should import
// getPublicGitHubProfile from @/lib/github-profile directly — this action exists
// for client components and is rate limited because server actions are public RPC.

import { getPublicGitHubProfile, type PublicGitHubProfile } from "@/lib/github-profile";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type { PublicGitHubProfile };

export async function getPublicGitHubData(username: string): Promise<PublicGitHubProfile | null> {
  const limit = await rateLimit(`profile:${await clientIp()}`, { limit: 60, windowSec: 60 });
  if (!limit.ok) return null;
  return getPublicGitHubProfile(username);
}
