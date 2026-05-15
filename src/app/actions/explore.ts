"use server";

import { supabase } from "@/lib/supabase";

export async function getExploreUsers() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("talents")
      .select("username, avatar_url, total_stars, top_language")
      .order("total_stars", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[EXPLORE_ACTION_ERROR]", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[EXPLORE_EXCEPTION]", err);
    return [];
  }
}
