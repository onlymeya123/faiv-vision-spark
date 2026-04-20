# FAIV Predict

> AI-powered content performance prediction for creative agencies.
> A premium SaaS dashboard for forecasting engagement, diagnosing weak signals, and optimizing captions before posting.

![Status](https://img.shields.io/badge/status-prototype-7c3aed) ![Stack](https://img.shields.io/badge/stack-TanStack_Start-000) ![Theme](https://img.shields.io/badge/theme-Notion_clean-c3f73a)

---

## Overview

**FAIV Predict** helps social and content teams predict how a piece of content will perform *before* it goes live. Paste a caption, attach media, set a posting time — get a confidence-scored prediction, a diagnostic breakdown of what's helping or hurting it, and AI-driven suggestions that update projected lift in real-time.

This repository is a **UI/UX prototype** with mocked data. No backend is wired in.

## Features

| Area | What it does |
|---|---|
| **Dashboard** | KPIs, trend charts, posting heatmap, recent prediction feed |
| **Predict** | Caption intelligence (length, hashtags, CTA, emoji), media upload, datetime picker, pre-flight scoring |
| **Result** | Confidence meter, projected reach/engagement, performance tier classification |
| **Diagnose** | Feature importance (SHAP-style), radar comparison vs. account baseline, weak-signal flags |
| **Suggest** | AI recommendations with optimistic UI — apply a suggestion and watch projected lift animate live |
| **A/B Test** | Score two caption variants side-by-side |
| **Batch** | Upload CSV for bulk prediction |
| **Calendar** | Monthly content calendar with format-coded chips and day-level forecasts |
| **Admin** | Brand management and model registry |

## Tech Stack

- **Framework** — TanStack Start v1 (React 19, SSR-ready)
- **Build** — Vite 7
- **Language** — TypeScript (strict)
- **Styling** — Tailwind CSS v4 with OKLCH design tokens
- **UI primitives** — Radix UI + shadcn-style components
- **Motion** — framer-motion (180ms ease-out baseline)
- **Charts** — Recharts
- **Routing** — File-based via TanStack Router

## Getting Started

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # production build
```

## Project Structure

```
src/
├── routes/              # File-based routes (index, dashboard, predict, result, ...)
├── components/
│   ├── ui/              # shadcn primitives
│   ├── AppShell.tsx     # Sidebar + topbar layout
│   ├── ConfidenceMeter.tsx
│   ├── DateTimePicker.tsx
│   ├── PostingHeatmap.tsx
│   ├── SectionHeader.tsx
│   └── TierBadge.tsx
├── lib/
│   ├── mock-data.ts     # All dummy datasets
│   └── utils.ts
└── styles.css           # Design tokens, typography, motion
```

## Routes

| Path | Purpose |
|---|---|
| `/` | Login (demo credentials pre-filled) |
| `/dashboard` | Overview + KPIs + heatmap |
| `/predict` | Create a new prediction |
| `/result` | Prediction output |
| `/diagnose` | Feature-level breakdown |
| `/suggest` | AI recommendations with live lift |
| `/ab-test` | Variant comparison |
| `/batch` | Bulk CSV prediction |
| `/calendar` | Monthly content calendar |
| `/admin` | Brand + model management |

## Design Philosophy

Clean, Notion-inspired light theme with a confident purple primary and lime accent. Apple-system typography, tight tracking, generous whitespace, mixed-density layouts. See [`DESIGN.md`](./DESIGN.md) for the full system.

## Status & Roadmap

This is a **front-end-only prototype**. To take it to production:

- [ ] Wire Lovable Cloud (auth, Postgres, storage)
- [ ] Connect a real prediction model (server function or external API)
- [ ] Persist predictions, suggestions, and brand configs
- [ ] Add real CSV ingestion for batch jobs
- [ ] Add per-brand role-based access via `user_roles` table

## License

Prototype — internal use.
