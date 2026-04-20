import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { TierBadge } from "@/components/TierBadge";
import { ArrowRight, Activity, Lightbulb, Share2, Download } from "lucide-react";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Prediction Result — FAIV Predict" },
      { name: "description", content: "Performance classification, confidence score, and projected reach for your post." },
    ],
  }),
  component: ResultPage,
});

const PROJECTIONS = [
  { label: "Reach", value: "284k", delta: "+22%" },
  { label: "Engagement", value: "9.4%", delta: "+1.6%" },
  { label: "Saves", value: "3,120", delta: "+18%" },
  { label: "Shares", value: "1,840", delta: "+27%" },
];

const COMPARISON = [
  { label: "Your post", v: 91, color: "var(--primary)" },
  { label: "Account avg.", v: 64, color: "var(--secondary-glow)" },
  { label: "Industry avg.", v: 52, color: "oklch(0.6 0.02 255)" },
];

function ResultPage() {
  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/predict" className="hover:text-foreground">Predict</Link>
          <span>/</span>
          <span className="text-foreground">Result</span>
        </div>

        {/* HERO RESULT */}
        <section className="relative overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-surface via-surface-2 to-surface">
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-30"
          />
          <div
            aria-hidden
            className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
              filter: "blur(80px)",
              animation: "glow-pulse 6s ease-in-out infinite",
            }}
          />

          <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="flex justify-center">
              <ConfidenceMeter value={94} tier="Viral" />
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <TierBadge tier="Viral" />
                <span className="text-xs text-muted-foreground">
                  Run · 12 sec ago · faiv-reels v3.8.0
                </span>
              </div>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                This post is forecast to{" "}
                <span className="text-gradient-primary">significantly outperform</span>{" "}
                your account baseline.
              </h1>
              <p className="text-base text-muted-foreground">
                The combination of a strong opening hook, peak posting window, and a
                save-driven CTA places this post in the top 6% of expected outcomes for
                <span className="text-foreground"> @nova.studio</span>.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/suggest"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-cyan)] transition-all hover:scale-[1.02]"
                >
                  <Lightbulb className="h-4 w-4" />
                  See AI suggestions
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/diagnose"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-surface-2"
                >
                  <Activity className="h-4 w-4" />
                  Diagnose features
                </Link>
                <button className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface/60 text-muted-foreground transition-all hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface/60 text-muted-foreground transition-all hover:text-foreground">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTIONS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTIONS.map((p, i) => (
            <div
              key={p.label}
              className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl"
              style={{ animation: `slide-up 0.5s ${i * 80}ms both` }}
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Projected {p.label}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="font-display text-3xl font-semibold tracking-tight">
                  {p.value}
                </div>
                <div className="text-xs font-semibold text-[oklch(0.85_0.18_155)]">
                  {p.delta}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">in first 48h</div>
            </div>
          ))}
        </section>

        {/* COMPARISON + BREAKDOWN */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <h3 className="font-display text-lg font-semibold">vs. baselines</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Predicted score against rolling averages.
            </p>
            <div className="mt-6 space-y-5">
              {COMPARISON.map((c, i) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium">{c.label}</span>
                    <span className="font-mono text-muted-foreground">{c.v}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.v}%`,
                        background: `linear-gradient(90deg, ${c.color}, color-mix(in oklab, ${c.color} 60%, transparent))`,
                        boxShadow: i === 0 ? `0 0 14px ${c.color}` : undefined,
                        animation: `slide-up 0.7s ${i * 120}ms both`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <h3 className="font-display text-lg font-semibold">Score breakdown</h3>
            <p className="mt-1 text-xs text-muted-foreground">Weighted contribution per signal.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { l: "Hook", v: 96, c: "var(--primary)" },
                { l: "Format fit", v: 92, c: "var(--secondary-glow)" },
                { l: "Timing", v: 88, c: "var(--success)" },
                { l: "CTA", v: 84, c: "oklch(0.82 0.16 75)" },
                { l: "Hashtags", v: 79, c: "var(--primary)" },
                { l: "Audience", v: 91, c: "var(--secondary-glow)" },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-border bg-surface-2 p-3"
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {x.l}
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="font-display text-2xl font-semibold">{x.v}</span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${x.v}%`,
                        background: x.c,
                        boxShadow: `0 0 8px ${x.c}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
