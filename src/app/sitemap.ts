import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 86400;

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

// Every indexed profile page is an organic entry point ("<name> github", "<name> developer").
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/explore`, changeFrequency: "daily", priority: 0.8 },
  ];

  if (!supabase) return staticPages;

  const { data, error } = await supabase
    .from("talents")
    .select("username, last_fetch")
    .order("dev_score", { ascending: false })
    .limit(5000);

  if (error || !data) return staticPages;

  return [
    ...staticPages,
    ...data.map((t) => ({
      url: `${BASE_URL}/u/${t.username}`,
      lastModified: t.last_fetch ? new Date(t.last_fetch) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
