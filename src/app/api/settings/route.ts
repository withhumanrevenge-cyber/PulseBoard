import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Social fields are stored as bare handles and rendered as links on public
// profiles, so reject anything that is not a plain handle (no URLs/schemes).
const HANDLE = /^[A-Za-z0-9_.-]{0,100}$/;

function handle(value: unknown): string | null {
  if (typeof value !== "string") return "";
  const cleaned = value
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?(linkedin\.com\/in\/|x\.com\/|twitter\.com\/)/i, "")
    .replace(/\/+$/, "");
  return HANDLE.test(cleaned) ? cleaned : null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Writes must go through the service role — the old anon fallback silently
  // succeeded with zero rows affected under RLS.
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Service role not configured — settings cannot be persisted." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const linkedin = handle(body.linkedin);
  const twitter = handle(body.twitter);
  if (linkedin === null || twitter === null) {
    return NextResponse.json({ error: "Social links must be plain handles." }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          clerk_id: userId,
          hide_stars: body.hide_stars === true,
          hide_contributions: body.hide_contributions === true,
          is_open_to_build: body.is_open_to_build === true,
          bio: typeof body.bio === "string" ? body.bio.slice(0, 280) : "",
          linkedin,
          twitter,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_id" }
      )
      .select("hide_stars, hide_contributions, is_open_to_build, bio, linkedin, twitter");

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[SETTINGS_POST]", message);
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
  }
}
