import { getPublicGitHubProfile } from "@/lib/github-profile";

// README badge: `![PulseBoard](https://<host>/api/v1/badge/<login>)`.
// Shows DevScore (not stars) so it respects the owner's "hide stars" setting and
// every embed links back to a profile — this is the product's main growth loop.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const profile = await getPublicGitHubProfile(username);
    if (!profile) return new Response("User not found", { status: 404 });

    const score = String(profile.devScore.total);
    const prs = profile.proofOfWork.mergedExternalPRs;
    const right = prs > 0 ? `${score} · ${prs} OSS PRs` : score;
    const rightWidth = 14 + right.length * 6.5;
    const width = Math.round(122 + rightWidth);

    const svg = `<svg width="${width}" height="28" viewBox="0 0 ${width} 28" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PulseBoard DevScore ${score}">
  <title>PulseBoard DevScore ${score}</title>
  <defs>
    <linearGradient id="pulse-grad" x1="0" y1="0" x2="${width}" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED"/>
      <stop offset="1" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="28" rx="6" fill="#0A0A0A"/>
  <rect x="116" width="${width - 116}" height="28" rx="6" fill="url(#pulse-grad)"/>
  <rect x="116" width="8" height="28" fill="url(#pulse-grad)"/>
  <path d="M10 14H14L16 8L19 20L21 14H25" stroke="url(#pulse-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="32" y="18" fill="#FFFFFF" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-weight="700" font-size="11">DevScore</text>
  <text x="${116 + 10}" y="18" fill="#FFFFFF" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-weight="700" font-size="11">${right}</text>
</svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error(`[badge_error] ${username}:`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
