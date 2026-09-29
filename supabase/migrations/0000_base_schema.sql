-- Base schema for PulseBoard. Idempotent: safe on a fresh project and on one
-- where these tables were created by hand before migrations existed.
-- Order: 0000 (tables) -> 0001 (pgvector) -> 0002 (claims, proof of work, RLS).

create table if not exists public.users (
  clerk_id           text primary key,
  username           text,
  first_name         text,
  last_name          text,
  avatar_url         text,
  total_stars        integer not null default 0,
  contribution_count integer not null default 0,
  hide_stars         boolean not null default false,
  hide_contributions boolean not null default false,
  is_open_to_build   boolean not null default false,
  bio                text not null default '',
  linkedin           text not null default '',
  twitter            text not null default '',
  privacy_settings   jsonb not null default '{}'::jsonb,
  last_synced_at     timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Upserts use onConflict: "clerk_id"; hand-made tables may lack the constraint.
create unique index if not exists users_clerk_id_key on public.users (clerk_id);

create table if not exists public.talents (
  username     text primary key,
  full_name    text,
  avatar_url   text,
  total_stars  integer not null default 0,
  dev_score    integer not null default 0,
  top_language text,
  last_fetch   timestamptz not null default now()
);

create unique index if not exists talents_username_key on public.talents (username);
create index if not exists talents_total_stars_idx on public.talents (total_stars desc);
