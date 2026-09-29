import { NextResponse } from "next/server";
import { getPublicGitHubProfile } from "@/lib/github-profile";
import { getPublicProfileSettings } from "@/lib/public-settings";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const limit = await rateLimit(`api-pulse:${ipFromRequest(request)}`, { limit: 60, windowSec: 60 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const profile = await getPublicGitHubProfile(username);

    if (!profile) {
      return NextResponse.json(
        { error: "User not found or GitHub profile unreachable" },
        { status: 404 }
      );
    }

    const privacy = await getPublicProfileSettings(profile.username);

    // Remove hidden fields based on the owner's privacy choices.
    const sanitizedProfile = {
      username: profile.username,
      name: profile.name,
      avatar_url: profile.avatarUrl,
      bio: privacy.bio ?? profile.bio,
      claimed: privacy.claimed,
      open_to_work: privacy.openToWork,
      dev_score: {
        total: profile.devScore.total,
        impact: profile.devScore.impact,
        velocity: profile.devScore.velocity,
        collaboration: profile.devScore.collaboration,
        consistency: profile.devScore.consistency,
        breadth: profile.devScore.breadth,
        labels: profile.devScore.labels,
      },
      metrics: {
        stars: privacy.hideStars ? null : profile.totalStars,
        contributions: privacy.hideContributions ? null : profile.contributions,
        top_tech: profile.topLanguage,
      },
      proof_of_work: {
        merged_external_prs: profile.proofOfWork.mergedExternalPRs,
        external_repos: profile.proofOfWork.externalRepos,
        top_contributions: profile.proofOfWork.topContributions.map((c) => ({
          repo: c.repo,
          url: c.url,
          stars: c.stars,
          merged_prs: c.mergedPRs,
        })),
      },
      repos: profile.repos.map((r) => ({
        name: r.name,
        stars: r.stars,
        language: r.language,
        url: r.link,
      })),
      verified_at: profile.fetchedAt,
      protocol: "v1",
    };

    return NextResponse.json(sanitizedProfile, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error(`[api_v1_error] ${username}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
