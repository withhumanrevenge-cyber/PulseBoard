import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure this client is only used where env variables are loaded
export const supabase =
  typeof window !== "undefined"
    ? null
    : supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
