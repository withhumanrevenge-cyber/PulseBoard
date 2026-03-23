import { NextResponse } from "next/server";
import { getPublicGitHubData } from "@/app/actions/public-github";

/**
 * PulseBoard Badge API
 * Returns a high-performance SVG badge for GitHub READMEs.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const profile = await getPublicGitHubData(username);
    if (!profile) return new Response("User not found", { status: 404 });

    const stars = profile.totalStars?.toLocaleString() || "0";
    const contributions = profile.contributions?.toLocaleString() || "0";

    // Dynamic SVG generation
    const svg = `
      <svg width="220" height="32" viewBox="0 0 220 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="220" height="32" rx="16" fill="#000000"/>
        <rect x="1" y="1" width="218" height="30" rx="15" stroke="#FFFFFF" stroke-opacity="0.1"/>
        <defs>
          <linearGradient id="pulse-grad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#7C3AED"/>
            <stop offset="1" stop-color="#3B82F6"/>
          </linearGradient>
        </defs>
        <path d="M15 16H20L22 10L25 22L27 16H32" stroke="url(#pulse-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="40" y="20" fill="white" font-family="Inter, sans-serif" font-weight="bold" font-size="10" letter-spacing="0.02em">PULSEBOARD</text>
        <text x="120" y="20" fill="#9CA3AF" font-family="Inter, sans-serif" font-size="10">STARS</text>
        <text x="150" y="20" fill="white" font-family="Inter, sans-serif" font-weight="bold" font-size="10">${stars}</text>
        <circle cx="205" cy="16" r="3" fill="#10B981" />
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error(`[badge_error] ${username}:`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
