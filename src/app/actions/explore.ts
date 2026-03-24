"use server";

import { supabase } from "@/lib/supabase";

export async function getExploreUsers() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .order("id", { ascending: false })
      .limit(30);

    if (error) {
      console.error("[explore_error]", error.message);
      
      const { data: fallback, error: fallbackError } = await supabase
        .from("users")
        .select("id, username, avatar_url")
        .limit(10);
        
      if (fallbackError) return [];
      return (fallback ?? []).filter((u) => u.username && u.avatar_url);
    }

    return (data ?? []).filter((u) => u.username && u.avatar_url);
  } catch (err) {
    console.error("[explore_exception]", err);
    return [];
  }
}
