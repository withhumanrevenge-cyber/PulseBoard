# PulseBoard

**The Developer Intelligence & Reputation Protocol**

PulseBoard is a high-performance analytical engine designed to quantify developer impact and shipping velocity. By aggregating real-time data from GitHub and other technical registries, it provides verified, editorial-grade profiles that go beyond simple contribution graphs.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/PulseAI-Groq-F55036?style=flat-square)](https://groq.com/)

---

## 🏗 Architecture Overview

PulseBoard is built with a focus on **deterministic physics** and **sub-100ms latency**.

- **Frontend**: Next.js 16 (App Router) with Turbopack.
- **Motion Architecture**: Framer Motion utilizing spring physics (Stiffness: 180, Damping: 20) for zero-jank mascot and route transitions. Honors `prefers-reduced-motion` globally and ships light/dark themes.
- **Identity Layer**: Clerk SmartAuth for secure, multi-tenant session management.
- **Persistence**: Supabase Postgres for metadata caching and talent registry synchronization, with optional `pgvector` for semantic talent search.
- **Data Pipeline**: Octokit (GraphQL/REST) for authenticated and public GitHub telemetry.
- **Intelligence Layer**: PulseAI — a Groq-powered, tool-using Talent Scout agent with retrieval over the talent vector store.

---

## 🚀 Core Features

### 📡 Verified Global Directory
A real-time search node for identifying high-impact developers. Filter by primary stack, consistency index, and total impact stars.

### 📊 Comparative Intel
Side-by-side profile calibration. Analyze performance deltas, contribution velocity, and tech-stack breadth across multiple developer nodes.

### 🛡 Personal Console
Private dashboard for synchronizing GitHub telemetry, managing privacy thresholds (hiding specific metrics), and publishing your public persona.

### 🤖 PulseAI — Talent Scout Agent
The floating mascot is a launcher for **PulseAI**, a Groq-powered agent built for the developer community. It uses tool calling to ground every answer in real data:
- **`search_developers`** — semantic search over the talent registry (vector store) to find collaborators or hiring candidates by stack, focus, or impact.
- **`analyze_developer`** — pulls a developer's live GitHub metrics (stars, contributions, streak, languages, DevScore, top repos) for a grounded breakdown.

It never fabricates profiles — if the tools return nothing, it says so. Results render as clickable developer cards inside a spatial glass chat panel.

### 🧠 Vector Talent Search
Profiles are embedded with a zero-config lexical feature-hash vectorizer (`src/lib/embeddings.ts`) and ranked by cosine similarity. Production deployments can apply `supabase/migrations/0001_talent_vectors.sql` to move ranking into Postgres via `pgvector`; without it, the app falls back to exact in-memory ranking over the registry.

---

## 🛠 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-org/pulseboard.git
cd pulseboard
npm install
```

### 2. Environment Configuration
Create a `.env.local` file based on the provided `.env.example`:

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Frontend API Key |
| `CLERK_SECRET_KEY` | Clerk Backend Secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key (Server-only) |
| `GITHUB_TOKEN` | Public GitHub Telemetry Token |
| `GROQ_API_KEY` | PulseAI model key — free at [console.groq.com/keys](https://console.groq.com/keys). If unset, PulseAI shows a setup state instead of crashing. |
| `GROQ_MODEL` | _(optional)_ Defaults to `llama-3.3-70b-versatile`. |

### 3. (Optional) Enable pgvector
Run `supabase/migrations/0001_talent_vectors.sql` in the Supabase SQL editor to add the `embedding` column, an IVFFlat index, and the `match_talents` RPC. The app works without it (in-memory cosine fallback).

### 4. Development Mode
```bash
npm run dev
```

---

## 🛡 Production Readiness

### GitHub API Limits
For production scaling, it is recommended to transition from a Personal Access Token (`GITHUB_TOKEN`) to a **GitHub App**. This ensures:
1. Higher rate limits (5,000+ requests per hour).
2. Per-user installation tokens.
3. Enhanced security via signed JWTs.

### Database Sync
The `talents` table in Supabase serves as the single source of truth for the Global Directory. Ensure your `SUPABASE_SERVICE_ROLE_KEY` is kept strictly on the server-side to prevent unauthorized registry mutations.

---

## 📄 License
MIT © PulseBoard Engineering
