import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import {
  KPIS,
  PERFORMANCE_DISTRIBUTION,
  USAGE_TREND,
  RECENT_PREDICTIONS,
  BRANDS,
} from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CalendarRange,
  History,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
} from "lucide-react";
import { PostingHeatmap } from "@/components/PostingHeatmap";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FAIV Predict" },
      { name: "description", content: "Hierarchical Random Forest performance overview, model health, and recent predictions." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const personalCount = BRANDS.filter((b) => b.stage === "Personal").length;
  const driftCount = BRANDS.filter((b) => b.drift).length;

  return (
    <AppShell>
      <div className="px-5 py-6 md:px-10 md:py-8">
        {/* HERO — fills viewport, no duplicate KPI strip */}
        <section className="relative mb-10 flex min-h-[calc(100vh-6rem)] overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-surface via-surface-2 to-surface p-1">
          <div className="relative flex w-full flex-col overflow-hidden rounded-[22px] p-6 md:p-12">
            <div aria-hidden className="absolute inset-0 grid-bg opacity-40" />
            <div
              aria-hidden
              className="absolute -top-32 -right-20 h-[500px] w-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              aria-hidden
              className="absolute -bottom-40 -left-10 h-[500px] w-[500px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--secondary-glow) 45%, transparent), transparent 70%)",
                filter: "blur(80px)",
              }}
            />

            {/* Top row: greeting + status pills */}
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                {BRANDS.length} brands tracked
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
                  <TrendingUp className="h-3 w-3 text-[oklch(0.65_0.18_155)]" />
                  Predictions <span className="font-mono text-foreground">+18.4%</span> this week
                </div>
                {driftCount > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--destructive)_45%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] px-3 py-1.5 text-[11px] font-semibold text-destructive backdrop-blur">
                    <AlertTriangle className="h-3 w-3" />
                    {driftCount} model{driftCount === 1 ? "" : "s"} need attention
                  </div>
                )}
              </div>
            </div>

            {/* Centered headline + sub — vertically anchored to fill space */}
            <div className="relative z-10 my-auto max-w-3xl py-6">
              <h1 className="font-display text-[34px] font-semibold leading-[1.05] tracking-tight md:text-[56px]">
                Good morning,{" "}
                <span className="text-gradient-primary">Alex</span>.
              </h1>
              <h2 className="mt-3 font-display text-2xl font-medium leading-tight tracking-tight text-muted-foreground md:text-3xl">
                Your content is performing well today.
              </h2>
              <p className="mt-5 max-w-xl text-base text-muted-foreground">
                <span className="font-semibold text-foreground">{personalCount}</span> of your brands now have a personalised model, and the rest are learning fast. Pick a workflow below to keep momentum going.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/predict"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  New Prediction
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/calendar"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-all hover:bg-surface-2 active:scale-[0.98]"
                >
                  <CalendarRange className="h-4 w-4" />
                  Plan a Calendar
                </Link>
                <Link
                  to="/history"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/40 px-5 py-3 text-sm font-medium text-muted-foreground backdrop-blur transition-all hover:text-foreground hover:bg-surface-2 active:scale-[0.98]"
                >
                  <History className="h-4 w-4" />
                  View History
                </Link>
              </div>
            </div>

            {/* Bottom row: scroll cue + brand snapshot strip (no duplicated KPIs) */}
            <div className="relative z-10 mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-border/50 pt-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-block h-px w-8 bg-border-strong" />
                Scroll for performance details
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
                <span>
                  Personal models live{" "}
                  <span className="font-mono text-foreground">{personalCount}/{BRANDS.length}</span>
                </span>
                <span className="hidden h-3 w-px bg-border-strong sm:inline-block" />
                <span>
                  Last training{" "}
                  <span className="font-mono text-foreground">12h ago</span>
                </span>
                <span className="hidden h-3 w-px bg-border-strong sm:inline-block" />
                <span>
                  Predictions today{" "}
                  <span className="font-mono text-foreground">428</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, i) => {
            const KpiIcon = [TrendingUp, Sparkles, Activity, BarChart3][i] ?? Target;
            return (
              <div
                key={kpi.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur-xl transition-all hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
                style={{ animation: `slide-up 0.6s ${i * 80}ms both cubic-bezier(0.22, 1, 0.36, 1)` }}
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 30%, transparent), transparent 70%)",
                    filter: "blur(28px)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] text-primary">
                      <KpiIcon className="h-[18px] w-[18px]" />
                    </div>
                    <div
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        kpi.trend === "up"
                          ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[oklch(0.55_0.18_150)] dark:text-[oklch(0.78_0.18_150)]"
                          : "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[oklch(0.55_0.22_22)] dark:text-[oklch(0.78_0.22_22)]"
                      }`}
                    >
                      {kpi.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {kpi.delta}
                    </div>
                  </div>
                  <div className="mt-4 font-display text-3xl font-semibold tabular-nums tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-muted-foreground">{kpi.label}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground/70">{kpi.sub}</div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Charts row */}
        <section className="mb-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-xl">
            <SectionHeader
              eyebrow="Last 30 days"
              title={<span className="text-2xl">Prediction volume</span>}
              description="Daily predictions and HIGH-tier classifications."
              actions={
                <div className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs">
                  {["7d", "30d", "90d"].map((p, i) => (
                    <button
                      key={p}
                      className={`rounded-md px-3 py-1 transition active:scale-95 ${
                        i === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="mt-6 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USAGE_TREND} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pred-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.18 295)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.55 0.18 295)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="high-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 130)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 130)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.22 0.02 280 / 0.06)" vertical={false} />
                  <XAxis dataKey="day" stroke="oklch(0.5 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: "var(--shadow-elevated)",
                    }}
                    cursor={{ stroke: "oklch(0.55 0.18 295)", strokeWidth: 1, strokeDasharray: "3 3" }}
                  />
                  <Area type="monotone" dataKey="predictions" stroke="oklch(0.55 0.18 295)" strokeWidth={2} fill="url(#pred-grad)" />
                  <Area type="monotone" dataKey="high" stroke="oklch(0.78 0.18 130)" strokeWidth={2} fill="url(#high-grad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-xl">
            <SectionHeader
              eyebrow="This week"
              title={<span className="text-2xl">Tier distribution</span>}
              description="Random Forest output classes."
            />
            <div className="mt-8 space-y-4">
              {PERFORMANCE_DISTRIBUTION.map((d, i) => {
                const max = Math.max(...PERFORMANCE_DISTRIBUTION.map((x) => x.count));
                const pct = (d.count / max) * 100;
                return (
                  <div key={d.tier} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
                        />
                        <span className="font-medium uppercase tracking-wider">{d.tier}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{d.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${d.color}, color-mix(in oklab, ${d.color} 60%, transparent))`,
                          boxShadow: `0 0 12px ${d.color}`,
                          animation: `slide-up 0.8s ${i * 100}ms both`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Posting heatmap */}
        <section className="mb-10 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <PostingHeatmap />
        </section>

        {/* Hierarchy panel — Model status per brand */}
        <section className="mb-10 rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--primary)_30%,transparent)] bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Model hierarchy
              </div>
              <h3 className="mt-2.5 font-display text-lg font-semibold">
                Per-brand model status
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Personal Model activates at 200 samples. Below threshold, predictions fall back to the niche model.
              </p>
            </div>
            <Link to="/niches" className="shrink-0 text-xs font-medium text-primary hover:underline">
              Manage brands →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BRANDS.slice(0, 6).map((b) => {
              const pct = Math.min(100, Math.round((b.samples / 200) * 100));
              return (
                <li
                  key={b.id}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-semibold">{b.name}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{b.handle}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
                        b.stage === "Personal"
                          ? "bg-[color-mix(in_oklab,var(--accent-lime)_18%,transparent)] text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)] ring-[color-mix(in_oklab,var(--accent-lime)_45%,transparent)]"
                          : "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary ring-[color-mix(in_oklab,var(--primary)_35%,transparent)]"
                      }`}
                    >
                      {b.stage} Model
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      <span className="font-mono tabular-nums text-foreground">{b.samples}</span>
                      {b.stage === "Personal" ? " samples · Personal active" : `/200 · ${pct}%`}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-foreground">
                      {b.accuracy.toFixed(1)}% Acc
                      {b.drift && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-destructive animate-pulse">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Drift
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          b.stage === "Personal" ? "var(--gradient-lime)" : "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Quick actions + recent predictions */}
        <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Quick actions</h3>
            <div className="grid gap-3">
              {[
                {
                  to: "/predict" as const,
                  icon: Sparkles,
                  title: "New Prediction",
                  desc: "Score one upcoming post in seconds",
                  glow: "var(--primary)",
                },
                {
                  to: "/calendar" as const,
                  icon: CalendarRange,
                  title: "Content Calendar",
                  desc: "Upload an Excel file to score in batch",
                  glow: "var(--secondary-glow)",
                },
                {
                  to: "/history" as const,
                  icon: History,
                  title: "Prediction History",
                  desc: "Browse and filter past predictions",
                  glow: "var(--success)",
                },
              ].map((a, i) => (
                <Link
                  key={a.title}
                  to={a.to}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface/60 p-4 backdrop-blur transition-all hover:border-border-strong hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ animation: `slide-up 0.5s ${i * 80}ms both` }}
                >
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border-strong"
                    style={{
                      background: `color-mix(in oklab, ${a.glow} 14%, transparent)`,
                      boxShadow: `inset 0 0 20px color-mix(in oklab, ${a.glow} 25%, transparent)`,
                    }}
                  >
                    <a.icon className="h-5 w-5" style={{ color: a.glow }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/70 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--primary)_30%,transparent)] bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
                  Live feed
                </div>
                <h3 className="mt-2 font-display text-base font-semibold">
                  Recent predictions
                </h3>
              </div>
              <Link to="/history" className="text-xs font-medium text-primary hover:underline">
                View all →
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {RECENT_PREDICTIONS.map((r) => (
                <li
                  key={r.id}
                  className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2/60"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-secondary to-surface-3 font-mono text-[10px] text-muted-foreground">
                    {r.account.slice(1, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{r.account}</span>
                      <span className="rounded-md border border-border bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {r.format}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{r.when}</div>
                  </div>
                  <div className="hidden items-center gap-1.5 text-xs sm:flex">
                    <span className="font-mono text-muted-foreground">{r.confidence}%</span>
                    <span className="text-muted-foreground/50">conf</span>
                  </div>
                  <TierBadge tier={r.tier} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
