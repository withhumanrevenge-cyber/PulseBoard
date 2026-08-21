import { NextResponse } from "next/server";
import { getPublicGitHubData } from "@/app/actions/public-github";
// Read privacy through the admin client — the anon client is subject to RLS
// on `users` and silently returned no rows, so privacy toggles never took
// effect on this public endpoint.
import { supabaseAdmin } from "@/lib/supabase";

type PrivacySettings = {
  hideStars: boolean;
  hideContributions: boolean;
  hideTech: boolean;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const profile = await getPublicGitHubData(username);

    if (!profile) {
      return NextResponse.json(
        { error: "User not found or GitHub profile unreachable" },
        { status: 404 }
      );
    }

    let privacy: PrivacySettings = { hideStars: false, hideContributions: false, hideTech: false };
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("hide_stars, hide_contributions, privacy_settings")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.warn("[PULSE_V1_PRIVACY_LOOKUP]", error.message);
      } else if (data) {
        // Support both the newer flat columns (hide_stars / hide_contributions,
        // set via /api/settings) and the older privacy_settings jsonb.
        const nested = (data.privacy_settings ?? {}) as Partial<PrivacySettings>;
        privacy = {
          hideStars: Boolean(data.hide_stars ?? nested.hideStars ?? false),
          hideContributions: Boolean(data.hide_contributions ?? nested.hideContributions ?? false),
          hideTech: Boolean(nested.hideTech ?? false),
        };
      }
    }

    // Remove hidden fields based on user privacy choices
    const sanitizedProfile = {
      username: username,
      name: profile.name,
      avatar_url: profile.avatarUrl,
      bio: profile.bio,
      metrics: {
        stars: privacy.hideStars ? null : profile.totalStars,
        contributions: privacy.hideContributions ? null : profile.contributions,
        top_tech: privacy.hideTech ? null : profile.topLanguage,
      },
      repos: profile.repos.map((r) => ({
        name: r.name,
        stars: r.stars,
        language: r.language,
        url: r.link
      })),
      verified_at: new Date().toISOString(),
      protocol: "v1"
    };

    return NextResponse.json(sanitizedProfile);
  } catch (error) {
    console.error(`[api_v1_error] ${username}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
