"use server";

import { supabase } from "@/lib/supabase";

export async function getExploreUsers(): Promise<{ id: string; username: string; avatar_url: string }[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("users")
    .select("id, username, avatar_url")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[explore_error]", error.message);
    return [];
  }

  return (data ?? []).filter((u) => u.username && u.avatar_url);
}
