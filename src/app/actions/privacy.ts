"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

const DEFAULT_SETTINGS = {
  hide_stars: false,
  hide_contributions: false,
  is_open_to_build: true,
  bio: "",
  linkedin: "",
  twitter: "",
};

export async function getSettings() {
  const { userId } = await auth();
  if (!userId) return null;

  // Reads are fine on either client — admin bypasses RLS, anon works if there
  // is a "user can read own row" policy.
  const client = supabaseAdmin ?? supabase;
  if (!client) return DEFAULT_SETTINGS;

  try {
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data ?? DEFAULT_SETTINGS;
  } catch (err) {
    console.warn("[SETTINGS_UNAVAILABLE]", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function deleteAccount() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  // Refuse loudly if we don't have the service-role key. The old anon fallback
  // meant RLS silently blocked the DB delete, but Clerk still deleted the auth
  // user — leaving an orphan row while reporting success.
  if (!supabaseAdmin) {
    return {
      success: false,
      error: "Service role unavailable — refusing to delete before cleanup can run.",
    };
  }

  try {
    const { error: dbError } = await supabaseAdmin.from("users").delete().eq("clerk_id", userId);
    if (dbError) throw dbError;

    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[DELETE_ACCOUNT_ERROR]", message);
    return { success: false, error: message };
  }
}
