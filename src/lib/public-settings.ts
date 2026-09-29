// Owner-controlled settings for a public profile. Looked up by `github_login`,
// which is only ever written from the owner's GitHub OAuth token (see
// actions/github.ts). Never match on `users.username`: that comes from Clerk and
// anyone can pick a Clerk username that equals someone else's GitHub login.

import { supabaseAdmin } from "@/lib/supabase";

export interface PublicProfileSettings {
  claimed: boolean;
  hideStars: boolean;
  hideContributions: boolean;
  openToWork: boolean;
  bio: string | null;
  linkedin: string | null;
  twitter: string | null;
}

export const UNCLAIMED: PublicProfileSettings = {
  claimed: false,
  hideStars: false,
  hideContributions: false,
  openToWork: false,
  bio: null,
  linkedin: null,
  twitter: null,
};

export async function getPublicProfileSettings(login: string): Promise<PublicProfileSettings> {
  if (!supabaseAdmin) return UNCLAIMED;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("hide_stars, hide_contributions, is_open_to_build, bio, linkedin, twitter")
    .ilike("github_login", login)
    .order("last_synced_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  // Missing column (migration 0002 not applied) or no row → treat as unclaimed.
  if (error || !data) return UNCLAIMED;

  return {
    claimed: true,
    hideStars: Boolean(data.hide_stars),
    hideContributions: Boolean(data.hide_contributions),
    openToWork: Boolean(data.is_open_to_build),
    bio: data.bio?.trim() || null,
    linkedin: data.linkedin?.trim() || null,
    twitter: data.twitter?.trim() || null,
  };
}
