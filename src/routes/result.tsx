import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { TierBadge } from "@/components/TierBadge";
import { FlowStepper } from "@/components/FlowStepper";
import { ModelMaturity } from "@/components/ModelMaturity";
import { WhyThisScore } from "@/components/WhyThisScore";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { ArrowRight, Activity, Lightbulb, Share2, Download } from "lucide-react";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Prediction Result — FAIV Predict" },
      { name: "description", content: "Random Forest classification: predicted_class (HIGH / AVERAGE / LOW) and confidence_score." },
    ],
  }),
  component: ResultPage,
});

// Random Forest output: predicted_class probabilities (sum = 1.0)
const CLASS_PROBS = [
  { tier: "High" as const, prob: 0.71 },
  { tier: "Average" as const, prob: 0.22 },
  { tier: "Low" as const, prob: 0.07 },
];

const REASONS = [
  {
    label: "Media type aligns with niche-HIGH baseline",
    detail:
      "media_type = Reels (1) — the most frequent format among HIGH-tier posts in this account's niche.",
    weight: 0.28,
    direction: "positive" as const,
  },
  {
    label: "posting_hour inside niche peak window",
    detail:
      "19:30 sits inside the 19:00–21:00 high-engagement band derived from the niche-level Random Forest.",
    weight: 0.22,
    direction: "positive" as const,
  },
  {
    label: "has_cta = 1",
    detail:
      "An explicit save-prompt CTA is detected in the caption. Carries 8% MDI weight in the niche stage.",
    weight: 0.08,
    direction: "positive" as const,
  },
];

function ResultPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const top = CLASS_PROBS[0];
  const confidence = Math.round(top.prob * 100);

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <FlowStepper />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/predict" className="hover:text-foreground">Predict</Link>
            <span>/</span>
            <span className="text-foreground">Result</span>
          </div>
        </div>

        {loading ? (
          <ResultSkeleton />
        ) : (
          <>
            {/* HERO RESULT */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface-2 to-surface shadow-[var(--shadow-elevated)]">
              <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
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
                  <ConfidenceMeter value={confidence} tier={`Tier: ${top.tier.toUpperCase()}`} label="Confidence Score" />
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <TierBadge tier={top.tier} />
                    <span className="text-xs text-muted-foreground">
                      Personal Model: Nova Studio · v1.4.0 · 12s ago
                    </span>
                  </div>
                  <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                    Predicted class:{" "}
                    <span className="text-gradient-primary">Tier {top.tier.toUpperCase()}</span>
                  </h1>
                  <p className="text-base text-muted-foreground">
                    The Random Forest classifier returned{" "}
                    <span className="font-mono text-foreground">predicted_class = "{top.tier.toLowerCase()}"</span>{" "}
                    with{" "}
                    <span className="font-mono text-foreground">confidence_score = {confidence}%</span>.
                    Niche-relative labeling (P33 / P67) used during training.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to="/suggest"
                      className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Lihat rekomendasi
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      to="/diagnose"
                      className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-surface-2 active:scale-[0.98]"
                    >
                      <Activity className="h-4 w-4" />
                      Diagnose features
                    </Link>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface/60 text-muted-foreground transition-all hover:text-foreground active:scale-95"
                      aria-label="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-surface/60 text-muted-foreground transition-all hover:text-foreground active:scale-95"
                      aria-label="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* WHY + MATURITY */}
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <WhyThisScore
                reasons={REASONS}
                context="Hierarchical Random Forest · 247 personal samples (Personal Model active)"
              />
              <ModelMaturity samples={247} />
            </section>

            {/* CLASS PROBABILITIES */}
            <section className="mt-6 rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-base font-semibold">Class probabilities</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Random Forest output — probabilities sum to 1.0 across the 3 niche-relative classes.
                  </p>
                </div>
                <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  predict_proba
                </span>
              </div>
              <div className="space-y-4">
                {CLASS_PROBS.map((c) => {
                  const pct = Math.round(c.prob * 100);
                  const color =
                    c.tier === "High"
                      ? "var(--primary)"
                      : c.tier === "Average"
                      ? "var(--warning)"
                      : "color-mix(in oklab, var(--foreground) 35%, transparent)";
                  return (
                    <div key={c.tier}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <TierBadge tier={c.tier} />
                          <span className="font-mono text-muted-foreground">
                            P({c.tier.toLowerCase()})
                          </span>
                        </div>
                        <span className="font-mono tabular-nums text-foreground">{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-surface-3">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 60%, transparent))`,
                            boxShadow: `0 0 12px ${color}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
