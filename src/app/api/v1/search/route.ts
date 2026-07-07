import { NextResponse } from "next/server";
import { searchGitHubDevelopers } from "@/lib/dev-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ error: "Missing ?q= query" }, { status: 400 });
  }

  const result = await searchGitHubDevelopers(q, 9);
  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
