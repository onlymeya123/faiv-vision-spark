# FAIV Predict

> AI-powered content performance prediction for creative agencies.
> A premium SaaS dashboard for forecasting engagement, diagnosing weak signals, and optimizing captions before posting.

![Status](https://img.shields.io/badge/status-full--stack-7c3aed) ![Stack](https://img.shields.io/badge/stack-Next.js_+_FastAPI_+_Supabase-000) ![Theme](https://img.shields.io/badge/theme-Notion_clean-c3f73a)

---

## Overview

**FAIV Predict** helps social and content teams predict how a piece of content will perform *before* it goes live. Paste a caption, attach media, set a posting time — get a confidence-scored prediction, a diagnostic breakdown of what's helping or hurting it, and AI-driven suggestions that update projected lift in real-time.

This product is a **full-stack Machine Learning system** built on **Next.js (web client), FastAPI (model serving / inference API), and Supabase (auth, Postgres, storage)**. The prediction core is a **hierarchical Random Forest** trained per niche, with a personal-model layer that activates once an account reaches the cold-start threshold (200 samples).

## Features

| Area | What it does |
|---|---|
| **Dashboard** | KPIs, trend charts, posting heatmap, recent prediction feed |
| **Predict** | Caption Intelligence (extracts `caption_length`, `hashtag_count`, `has_cta`), media upload, datetime picker, pre-flight scoring |
| **Result** | Confidence meter, projected reach/engagement, performance tier classification, "Why this score" explainability |
| **Diagnose** | Feature importance via Mean Decrease in Impurity (MDI), visualized as a horizontal bar chart, with weak-signal flags |
| **Suggest** | AI recommendations with optimistic UI — apply a suggestion and watch projected lift animate live (Gemini-backed, with TRE fallback) |
| **A/B Caption Analyzer** | Score two caption variants side-by-side under identical context |
| **Calendar** | Monthly content calendar with format-coded chips and day-level forecasts |
| **Admin** | Brand management, model registry, and Model Health (rolling accuracy + concept-drift alerts) |

## Architecture

```
┌────────────────┐    HTTPS/JSON    ┌──────────────────┐    SQL    ┌──────────────┐
│  Next.js (UI)  │ ───────────────▶ │  FastAPI (model) │ ────────▶ │   Supabase   │
│  TanStack /    │ ◀─────────────── │  Random Forest   │ ◀──────── │  Postgres +  │
│  React 19      │                  │  + Gemini bridge │           │  Auth + Blob │
└────────────────┘                  └──────────────────┘           └──────────────┘
```

- **Web client** — Next.js / React 19 / TanStack Router, deployed on Vercel-class edge.
- **Inference API** — FastAPI service hosting the hierarchical Random Forest, exposing `/predict`, `/diagnose`, `/suggest` endpoints. Hosted on Railway (free tier sleeps when idle — see Graceful Degradation).
- **Data & auth** — Supabase Postgres for predictions / brands / user_roles; Supabase Storage for media uploads; Supabase Auth for sessions.
- **LLM** — Google Gemini for caption suggestions, with a deterministic Template Recommendation Engine (TRE) fallback when Gemini errors or times out.

## Tech Stack

- **Framework** — TanStack Start v1 (React 19, SSR-ready)
- **Build** — Vite 7
- **Language** — TypeScript (strict)
- **Styling** — Tailwind CSS v4 with OKLCH design tokens
- **UI primitives** — Radix UI + shadcn-style components
- **Motion** — framer-motion (180ms ease-out baseline)
- **Charts** — Recharts (horizontal bar charts for MDI feature importance)
- **Icons** — lucide-react
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
| `/diagnose` | Feature-level breakdown (MDI, horizontal bar chart) |
| `/suggest` | AI recommendations with live lift |
| `/calendar` | Monthly content calendar |
| `/admin` | Brand + model management + Model Health |

## Design Philosophy

Clean, Notion-inspired light theme with a confident purple primary and lime accent. Apple-system typography, tight tracking, generous whitespace, mixed-density layouts. See [`DESIGN.md`](./DESIGN.md) for the full system.

## Roadmap

- [ ] Wire production FastAPI endpoints into the predict / diagnose / suggest flows
- [ ] Persist predictions, suggestions, and brand configs in Supabase
- [ ] Wire the per-account cold-start counter to real `samples` in Postgres
- [ ] Live concept-drift detection feeding the Admin Model Health dashboard
- [ ] Per-brand role-based access via the Supabase `user_roles` table

## License

Internal use.
