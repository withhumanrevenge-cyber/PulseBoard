"use server";

import { supabase } from "@/lib/supabase";

export async function getExploreUsers() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url, total_stars, top_language")
      .order("total_stars", { ascending: false })
      .limit(30);

    if (error) {
      // If columns are missing, fallback to basic fetch
      const { data: simpleData, error: simpleError } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .order("id", { ascending: false })
        .limit(30);

      if (simpleError) {
        console.error("[explore_fallback_error]", simpleError.message);
        return [];
      }
      return simpleData || [];
    }

    return data || [];
  } catch (err) {
    console.error("[explore_exception]", err);
    return [];
  }
}
