-- Profile claims, proof-of-work ranking, and row-level security.

-- 1. Verified GitHub login for claimed profiles. Written only from the owner's
--    GitHub OAuth token (src/app/actions/github.ts). Public profile settings are
--    looked up by this column, never by `username` (which comes from Clerk and
--    can be set to anyone's GitHub login).
alter table public.users add column if not exists github_login text;
create index if not exists users_github_login_idx on public.users (lower(github_login));

-- Columns older hand-made tables may be missing.
alter table public.users add column if not exists hide_stars boolean not null default false;
alter table public.users add column if not exists hide_contributions boolean not null default false;
alter table public.users add column if not exists is_open_to_build boolean not null default false;
alter table public.users add column if not exists bio text not null default '';
alter table public.users add column if not exists linkedin text not null default '';
alter table public.users add column if not exists twitter text not null default '';
alter table public.users add column if not exists last_synced_at timestamptz;
alter table public.users add column if not exists updated_at timestamptz not null default now();

-- "Open to opportunities" must be opt-in; the old default claimed everyone was.
alter table public.users alter column is_open_to_build set default false;

-- 2. Proof of work: PRs merged into repos the developer does not own.
alter table public.talents add column if not exists merged_external_prs integer not null default 0;
create index if not exists talents_merged_external_prs_idx on public.talents (merged_external_prs desc);
create index if not exists talents_dev_score_idx on public.talents (dev_score desc);

-- 3. Row-level security. All writes go through the service role (server only),
--    which bypasses RLS. The anon key may only read the public talent registry.
alter table public.users enable row level security;
alter table public.talents enable row level security;

drop policy if exists "talents are publicly readable" on public.talents;
create policy "talents are publicly readable"
  on public.talents for select
  to anon, authenticated
  using (true);

-- No policies on public.users: private settings are never readable with the anon key.
