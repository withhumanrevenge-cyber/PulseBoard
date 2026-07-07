// Talent vector store: pgvector match_talents RPC when present, else in-memory cosine.

import { supabaseAdmin, supabase } from "@/lib/supabase";
import { embed, profileToDocument, cosineSimilarity } from "@/lib/embeddings";

export interface ScoredDeveloper {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  topLanguage: string | null;
  totalStars: number;
  devScore: number;
  similarity: number;
}

interface TalentRow {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  top_language: string | null;
  total_stars: number | null;
  dev_score: number | null;
  embedding?: number[] | null;
}

export async function upsertTalentVector(input: {
  username: string;
  fullName?: string | null;
  bio?: string | null;
  topLanguage?: string | null;
  languages?: string[];
  repoText?: string;
}): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    const doc = profileToDocument({
      name: input.fullName,
      username: input.username,
      bio: input.bio,
      topLanguage: input.topLanguage,
      languages: input.languages,
      repoText: input.repoText,
    });
    const embedding = embed(doc);
    await supabaseAdmin
      .from("talents")
      .update({ embedding })
      .eq("username", input.username);
  } catch {
    // embedding column not provisioned; search falls back to in-memory
  }
}

export async function searchDevelopers(
  query: string,
  limit = 6
): Promise<ScoredDeveloper[]> {
  const queryVec = embed(query);
  const client = supabaseAdmin ?? supabase;
  if (!client) return [];

  try {
    const { data, error } = await client.rpc("match_talents", {
      query_embedding: queryVec,
      match_count: limit,
    });
    if (!error && Array.isArray(data) && data.length > 0) {
      return (data as (TalentRow & { similarity: number })[]).map((r) => ({
        username: r.username,
        fullName: r.full_name,
        avatarUrl: r.avatar_url,
        topLanguage: r.top_language,
        totalStars: r.total_stars ?? 0,
        devScore: r.dev_score ?? 0,
        similarity: r.similarity ?? 0,
      }));
    }
  } catch {
    // RPC absent; fall through to in-memory ranking
  }

  const { data, error } = await client
    .from("talents")
    .select("username, full_name, avatar_url, top_language, total_stars, dev_score, embedding")
    .limit(500);

  if (error || !data) return [];

  const scored = (data as TalentRow[]).map((r) => {
    const vec =
      Array.isArray(r.embedding) && r.embedding.length
        ? r.embedding
        : embed(
            profileToDocument({
              name: r.full_name,
              username: r.username,
              topLanguage: r.top_language,
            })
          );
    return {
      username: r.username,
      fullName: r.full_name,
      avatarUrl: r.avatar_url,
      topLanguage: r.top_language,
      totalStars: r.total_stars ?? 0,
      devScore: r.dev_score ?? 0,
      similarity: cosineSimilarity(queryVec, vec),
    };
  });

  return scored
    .filter((s) => s.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
