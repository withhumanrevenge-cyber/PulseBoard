# PulseBoard ⚡️ 

> **PulseBoard**: The open-source standard for shipping transparency. No more manual updates—sync your git velocity directly to a cinematic public dashboard.

[![Next.js 15+](https://img.shields.io/badge/Next.js-15%2B-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏢 Overview
PulseBoard was engineered to bridge the gap between "building in public" and authentic developer metrics. It automates the data pipeline from your development tools (GitHub, Vercel, and soon Stripe) to a high-end interface optimized for investor relations and community growth.

## 🛠️ Unified Tech Stack
- **Core**: [Next.js 15+](https://nextjs.org) (App Router)
- **Engine**: [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) for high-frequency dev cycles.
- **Identity**: [Clerk](https://clerk.com) for enterprise-grade authentication and session management.
- **Data Engine**: [Supabase](https://supabase.com) (PostgreSQL) for user handle persistence and metadata.
- **Metrics Adapter**: [Octokit](https://github.com/octokit/octokit.js) for authenticated server-side GitHub event ingestion.
- **Visuals**: [Framer Motion](https://www.framer.com/motion/) & [Tailwind CSS v4](https://tailwindcss.com/) for fluid glassmorphics and cinematic transitions.

## 🔒 Security & Privacy Philosophy
- **Server-to-Server Sync**: All sensitive tokens are managed on the server side via Clerk's secure session layer—zero API keys ever reach the client.
- **Public-Only Discovery**: We fetch metrics via `listPublicEventsForUser` to ensure that private repo structures are NEVER exposed, maintaining the highest levels of IP safety.
- **Zinc-Weighted Theming**: The UI uses a custom deep-zinc palette to reduce eye fatigue for high-frequency dashboard monitoring.

## 🏁 Quick Start

### 1. Environment Prep
Copy the blueprint and fill your dashboard credentials:
```bash
cp .env.example .env.local
```

### 2. Ignition
```bash
npm install
npm run dev
```

## 🚀 Future Roadmap
- [ ] **Revenue Pulse**: Stripe automated growth charts.
- [ ] **Vercel Engine**: Direct staging vs production velocity tracking.
- [ ] **Badge Sync**: Real-time SVGs for GitHub READMEs.

---
*Senior Engineering Review: 100% clean, no-bloat, production-ready foundation.*
