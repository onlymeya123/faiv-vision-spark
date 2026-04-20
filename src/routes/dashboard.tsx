import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import {
  KPIS,
  PERFORMANCE_DISTRIBUTION,
  USAGE_TREND,
  RECENT_PREDICTIONS,
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
import { ArrowUpRight, ArrowDownRight, Sparkles, Zap, Target, FlaskConical, CalendarDays } from "lucide-react";
import { PostingHeatmap } from "@/components/PostingHeatmap";
import type { Tier } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FAIV Predict" },
      { name: "description", content: "Overview of prediction performance, KPIs, and recent activity." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        {/* HERO */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-surface via-surface-2 to-surface p-1">
          <div className="relative overflow-hidden rounded-[22px] p-8 md:p-12">
            <div
              aria-hidden
              className="absolute inset-0 grid-bg opacity-40"
            />
            <div
              aria-hidden
              className="absolute -top-32 -right-20 h-[400px] w-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              aria-hidden
              className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--secondary-glow) 45%, transparent), transparent 70%)",
                filter: "blur(80px)",
              }}
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  Live · 6 models running
                </div>
                <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  Good morning,{" "}
                  <span className="text-gradient-primary">Alex</span>.
                  <br />
                  <span className="text-muted-foreground">
                    Today's signal looks strong.
                  </span>
                </h1>
                <p className="max-w-xl text-base text-muted-foreground">
                  Your team queued <span className="font-semibold text-foreground">42 predictions</span> in
                  the last 24h. <span className="font-semibold text-foreground">11</span> are projected
                  to outperform — three are trending toward viral.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/predict"
                    className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Run a prediction
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    to="/batch"
                    className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition-all hover:bg-surface-2"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Open batch
                  </Link>
                </div>
              </div>

              {/* Hero side: pulse stat */}
              <div className="relative">
                <div className="relative rounded-2xl border border-border-strong bg-background/40 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      Forecast lift · 7d
                    </div>
                    <TierBadge tier="Viral" />
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="font-display text-6xl font-semibold tracking-tight text-gradient-primary">
                      +31.4%
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Projected reach if all 11 outperformers ship as scheduled.
                  </p>

                  <div className="mt-6 h-[110px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={USAGE_TREND.slice(-14)} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.55 0.18 295)" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="oklch(0.55 0.18 295)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="predictions"
                          stroke="oklch(0.55 0.18 295)"
                          strokeWidth={2}
                          fill="url(#hero-grad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, i) => (
            <div
              key={kpi.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl transition-all hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
              style={{ animation: `slide-up 0.6s ${i * 80}ms both cubic-bezier(0.22, 1, 0.36, 1)` }}
            >
              <div
                aria-hidden
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 35%, transparent), transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {kpi.label}
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      kpi.trend === "up"
                        ? "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[oklch(0.85_0.18_155)]"
                        : "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[oklch(0.80_0.22_22)]"
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
                <div className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  {kpi.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{kpi.sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts row */}
        <section className="mb-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* Usage trend */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <SectionHeader
              eyebrow="Last 30 days"
              title={<span className="text-2xl">Prediction volume</span>}
              description="Daily predictions and viral classifications."
              actions={
                <div className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs">
                  {["7d", "30d", "90d"].map((p, i) => (
                    <button
                      key={p}
                      className={`rounded-md px-3 py-1 transition ${
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
                    <linearGradient id="viral-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 130)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 130)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.22 0.02 280 / 0.06)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="oklch(0.5 0.02 280)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.5 0.02 280)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
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
                  <Area
                    type="monotone"
                    dataKey="predictions"
                    stroke="oklch(0.55 0.18 295)"
                    strokeWidth={2}
                    fill="url(#pred-grad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="viral"
                    stroke="oklch(0.78 0.18 130)"
                    strokeWidth={2}
                    fill="url(#viral-grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <SectionHeader
              eyebrow="This week"
              title={<span className="text-2xl">Performance tiers</span>}
              description="Distribution of predicted outcomes."
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
                        <span className="font-medium">{d.tier}</span>
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

        {/* Quick actions + recent predictions */}
        <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Quick actions</h3>
            <div className="grid gap-3">
              {[
                {
                  to: "/predict" as const,
                  icon: Sparkles,
                  title: "New prediction",
                  desc: "Score a single post",
                  glow: "var(--primary)",
                },
                {
                  to: "/calendar" as const,
                  icon: CalendarDays,
                  title: "Open calendar",
                  desc: "Plan the month",
                  glow: "var(--accent-lime)",
                },
                {
                  to: "/diagnose" as const,
                  icon: Zap,
                  title: "Diagnose post",
                  desc: "Inspect feature impact",
                  glow: "var(--secondary-glow)",
                },
                {
                  to: "/suggest" as const,
                  icon: Target,
                  title: "Get suggestions",
                  desc: "AI-powered rewrites",
                  glow: "var(--success)",
                },
              ].map((a, i) => (
                <Link
                  key={a.title}
                  to={a.to}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-surface/60 p-4 backdrop-blur transition-all hover:border-border-strong hover:-translate-y-0.5"
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

          <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Live feed
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  Recent predictions
                </h3>
              </div>
              <Link
                to="/diagnose"
                className="text-xs font-medium text-primary hover:underline"
              >
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
                  <TierBadge tier={r.tier as Tier} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
