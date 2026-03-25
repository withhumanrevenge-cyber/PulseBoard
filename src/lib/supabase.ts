import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// standard client for client-side and public data
export const supabase = url && key ? createClient(url, key) : null;

// admin client for server-side actions that need to bypass RLS (e.g. syncing data)
export const supabaseAdmin = url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
