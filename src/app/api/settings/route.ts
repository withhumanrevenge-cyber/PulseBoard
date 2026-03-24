import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Using the same lazy check as privacy.ts
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (url && key) ? createClient(url, key) : null;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !supabase) {
      return NextResponse.json({ error: "Unauthorized or Database Offline" }, { status: 401 });
    }

    const body = await req.json();
    
    const { data, error } = await supabase
      .from("users")
      .upsert({
        clerk_id: userId,
        hide_stars: body.hide_stars,
        hide_contributions: body.hide_contributions,
        is_open_to_build: body.is_open_to_build,
        bio: body.bio,
        linkedin: body.linkedin,
        twitter: body.twitter,
        updated_at: new Date().toISOString()
      }, { onConflict: "clerk_id" });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
