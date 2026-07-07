-- PulseAI vector search (pgvector)
-- Apply in Supabase: SQL Editor -> run this file, or `supabase db push`.
-- The app also works WITHOUT this migration (in-memory cosine fallback),
-- but applying it moves ranking into Postgres for scale.

create extension if not exists vector;

-- Lexical feature-hash embeddings are 256-dimensional (see src/lib/embeddings.ts).
alter table if exists public.talents
  add column if not exists embedding vector(256);

-- ANN index for fast similarity at scale.
create index if not exists talents_embedding_idx
  on public.talents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Cosine-similarity match used by src/lib/vector-store.ts.
create or replace function public.match_talents(
  query_embedding vector(256),
  match_count int default 6
)
returns table (
  username text,
  full_name text,
  avatar_url text,
  top_language text,
  total_stars int,
  dev_score int,
  similarity float
)
language sql stable
as $$
  select
    t.username,
    t.full_name,
    t.avatar_url,
    t.top_language,
    t.total_stars,
    t.dev_score,
    1 - (t.embedding <=> query_embedding) as similarity
  from public.talents t
  where t.embedding is not null
  order by t.embedding <=> query_embedding
  limit match_count;
$$;
