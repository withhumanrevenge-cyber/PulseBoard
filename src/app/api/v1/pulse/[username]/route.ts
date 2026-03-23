import { NextResponse } from "next/server";
import { getPublicGitHubData } from "@/app/actions/public-github";
import { supabase } from "@/lib/supabase";

/**
 * PulseBoard Protocol v1
 * Provides verified builder metrics in a machine-readable JSON format.
 */
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

    // Fetch user privacy settings from Supabase if available
    let privacy = { hideStars: false, hideContributions: false, hideTech: false };
    if (supabase) {
      const { data } = await supabase
        .from("users")
        .select("privacy_settings")
        .eq("username", username)
        .single();
      
      if (data?.privacy_settings) {
        privacy = data.privacy_settings;
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
      repos: profile.repos.map((r: any) => ({
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
