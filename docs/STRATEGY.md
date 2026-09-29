# PulseBoard: from GitHub stats page to investor-ready product

_Last updated: 2026-09-29_

## 1. Honest assessment: is it useful today?

**Not enough yet.** What exists before v2:

| Feature | Who it helps | Problem |
|---|---|---|
| Profile page with stars, streak, contributions | Developers (once) | GitHub already shows this. People look once and don't come back. |
| DevScore from stars + commit counts | Nobody who hires | Easy to game (commit bots, star swaps). Recruiters don't trust it. |
| AI "talent scout" + natural-language GitHub search | Recruiters, founders | Useful, but without a trustworthy signal it just ranks people by followers. |
| Compare / Team ("fleet") shortlist | Hiring managers | Stored only in browser localStorage, so it can't be shared or kept. |

Developer-portfolio products usually fail the same way: **developers don't pay and don't return, and recruiters won't pay for vanity metrics.** To be useful, PulseBoard needs a signal that people who hire actually trust, and a reason for developers to keep it current.

## 2. The wedge: proof of work

> **PulseBoard only counts code that someone else reviewed and merged.**

AI-written resumes and AI-solved take-home tests make self-reported signals close to worthless. A pull request merged into a repository you don't own is different: another maintainer reviewed and accepted the code. It is public and verifiable, and it is hard to fake at scale.

Shipped in this release:
- **Proof of work** on every profile: merged PRs into other people's repos, grouped by project and ranked by the project's reach.
- **DevScore v2**, with a transparent breakdown: impact 30, velocity 25, **collaboration 20**, consistency 15, breadth 10. No single vanity metric can dominate.
- **Claimed profiles**: the owner verifies with GitHub OAuth, controls privacy, adds a bio and links, and can turn on "open to opportunities" (off by default).
- PulseAI now uses merged external PRs as its main evidence when assessing candidates.

## 3. Who pays: two-sided model

| Side | Offer | Price |
|---|---|---|
| **Developers (supply)** | Free, claimable proof-of-work profile, README badge, social card, privacy controls, open-to-work flag | Free, always |
| **Hiring teams (revenue)**: seed–Series B startups without a recruiter, and devtools/infra companies that hire from their contributor base | "Scout": paste a job description or a repo and get ranked candidates **with evidence** (the merged PRs that justify each rank); shared shortlists; candidate briefs; ATS export (Ashby/Greenhouse/Lever); outreach only to opted-in developers | Hypothesis: $149–$299/seat/mo, or credit-based candidate unlocks. **Validate with 10 design partners before building billing.** |
| **OSS/DevRel teams** (expansion) | Contributor intelligence: who contributes to your repos and your competitors', who is rising, who is open to work | Team plan add-on |

**Moat over time:** a network of claimed profiles where developers have given consent, plus score history over time (no one else has "how this engineer's work changed over 3 years"), plus the evidence graph (person → merged PR → project).

## 4. Growth loops (built into the product)

1. **Badge loop** (shipped): Share → copy README badge. Every badge links to a profile, and visitors check their own score and claim their profile.
2. **Social card loop** (shipped): each `/u/<login>` link renders a card with DevScore, merged PRs, and the top project when shared on LinkedIn/X/Slack.
3. **Claim loop** (shipped): any profile can be viewed without signing up. Unclaimed profiles show "Is this you? Claim profile", so every recruiter view is a chance to acquire a developer.
4. **SEO** (shipped: sitemap, canonical URLs, metadata): profile pages rank for "<name> github". _Decide first whether unclaimed profiles should be indexed (see §8)._
5. **Leaderboards** (next): "Top Rust contributors in India" and "Top first-time contributors to React". Rankings get shared, get press, and are easy to launch.
6. **Weekly shipping digest** (next): an email to claimed users, e.g. "2 PRs merged into vercel/next.js this week, DevScore +3". This is the retention hook and needs the snapshots table (§6).

## 5. v2 launch plan: "Check your proof-of-work score"

| Week | Action | Goal |
|---|---|---|
| 0–2 | Private beta: 50 OSS maintainers and active contributors, 10 hiring design partners | Calibrate the score; collect testimonials and LOIs |
| 2 | Ship leaderboards (by language × country) + weekly digest | Launch-day shareable asset |
| 3 | **Show HN**: "My profile only counts code other people merged". Post the same day on Product Hunt, dev.to, and X | 5k claimed profiles |
| 4 | Press push on leaderboards ("India's top OSS contributors"); partner with hackathons and bootcamps | Earned media |
| 5–8 | Convert design partners to paid pilots; ship ATS export | First MRR |

**Metrics investors will ask for:** claimed profiles per week, badge-embed rate (the virality coefficient), week-4 retention of claimed users, weekly active recruiters, search → shortlist → contact conversion, design-partner LOIs, and pilot MRR.

## 6. Architecture for scale

```
Browser ──► CDN (Vercel) ── caches /u/* 5 min, badge 1 h, OG image
              │
              ▼
        Next.js app (server components / route handlers)
              │  rate limits (Upstash Redis)  ·  Clerk auth
              ▼
   Profile service (src/lib/github-profile.ts)
      ├── Next data cache (10 min per login)  →  later: Redis
      ├── GitHub GraphQL  →  move to a GitHub App (per-installation quota)
      └── Postgres (Supabase)
            users            claimed accounts, privacy, github_login (verified)
            talents          registry + dev_score + merged_external_prs + pgvector
            score_snapshots  (next) daily DevScore history → digest, trends
              ▲
   Background workers (next: Inngest / Trigger.dev / Supabase cron)
      refresh claimed profiles daily · leaderboards · digest emails (Resend)
              ▲
   AI layer: Groq agent (tool calling) · swap the hash embeddings for a hosted embedding model
```

## 7. Production-readiness checklist

**Done in this release**
- [x] SSRF fix: the deploy checker could fetch internal and cloud-metadata URLs; every hop is now checked against private IP ranges.
- [x] Rate limits on PulseAI, search, the public API, and profile/deploy actions (Upstash when configured).
- [x] Privacy settings actually applied on public profiles; open-to-work is opt-in.
- [x] Claim spoofing fixed: settings are matched on the OAuth-verified `github_login`, never on the Clerk username.
- [x] Settings validation (bio length, social handles only, no URLs or `javascript:` links).
- [x] Cached GitHub fetches: one API call and one registry write per user per 10 minutes, instead of one per page view.
- [x] Reproducible DB: `supabase/migrations/0000 → 0002`, RLS enabled, and the anon key can only read the public registry.
- [x] Security headers, sitemap/robots, canonical URLs, OG images.
- [x] Unit tests (Vitest) + GitHub Actions CI (typecheck, lint, test).
- [x] Dashboard fixes: the profile link used the Clerk id; settings were saved on every keystroke.

**Next, before public launch**
- [ ] Configure Upstash in production (without it, rate limits apply per server instance only).
- [ ] Replace the shared PAT with a **GitHub App**; a single token is a single point of failure and a single rate-limit bucket.
- [ ] Opt-out/removal page, privacy policy, and terms. You process public data about people who haven't signed up, so under GDPR you need a legitimate-interest basis and an easy opt-out.
- [ ] Sentry (errors) + PostHog (funnels) + uptime checks.
- [ ] `score_snapshots` table + daily refresh job.
- [ ] Persist shortlists server-side (today they're in localStorage).
- [ ] Playwright end-to-end tests for sign-up → claim → share → badge.
- [ ] Staging project + Vercel preview deploys; Supabase point-in-time recovery.
- [ ] Next 16: rename `middleware.ts` → `proxy.ts` once Clerk's docs confirm support.

## 8. Open decisions (owner)

1. **Primary paying customer for v2.** Recommended: startup hiring teams, with developers as free supply.
2. **Index unclaimed profiles in Google?** It's the biggest SEO lever, but it adds privacy/GDPR exposure. A middle path: index only claimed profiles and high-score public profiles, and ship the opt-out page first.
3. **Pricing test:** per-seat vs. credit-based candidate unlocks. Run both with design partners.
