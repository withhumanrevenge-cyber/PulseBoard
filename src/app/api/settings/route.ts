import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type SettingsPayload = {
  hide_stars: boolean;
  hide_contributions: boolean;
  is_open_to_build: boolean;
  bio: string;
  linkedin: string;
  twitter: string;
};

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

  try {
    const body = (await req.json()) as SettingsPayload;

    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          clerk_id: userId,
          hide_stars: body.hide_stars,
          hide_contributions: body.hide_contributions,
          is_open_to_build: body.is_open_to_build,
          bio: body.bio,
          linkedin: body.linkedin,
          twitter: body.twitter,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_id" }
      )
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[SETTINGS_POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
