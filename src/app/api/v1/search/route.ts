import { NextResponse } from "next/server";
import { searchGitHubDevelopers } from "@/lib/dev-search";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").slice(0, 300);

  if (!q.trim()) {
    return NextResponse.json({ error: "Missing ?q= query" }, { status: 400 });
  }

  const limit = await rateLimit(`api-search:${ipFromRequest(request)}`, { limit: 20, windowSec: 60 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  const result = await searchGitHubDevelopers(q, 9);
  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
