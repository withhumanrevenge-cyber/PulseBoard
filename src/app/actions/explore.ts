"use server";

import { supabase } from "@/lib/supabase";

export async function getExploreUsers() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("[explore_error]", error);
    return [];
  }
}
