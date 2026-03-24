"use server";

import { createClient } from "@supabase/supabase-js";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Lazy getter for Supabase to prevent crash if keys are missing
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getSettings() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    
    return data || {
      hide_stars: false,
      hide_contributions: false,
      is_open_to_build: true,
      bio: "",
      linkedin: "",
      twitter: ""
    };
  } catch (err) {
    console.error("Get settings error:", err);
    return null;
  }
}

export async function deleteAccount() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const supabase = getSupabase();
    const client = await clerkClient();

    // 1. Cleanup Supabase Data
    if (supabase) {
      await supabase.from("users").delete().eq("clerk_id", userId);
    }

    // 2. Delete from Clerk
    await client.users.deleteUser(userId);

    return { success: true };
  } catch (err: any) {
    console.error("Delete account error:", err.message);
    return { success: false, error: err.message };
  }
}
