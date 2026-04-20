import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { SUGGESTIONS } from "@/lib/mock-data";
import { Sparkles, ArrowRight, Check, X, Undo2 } from "lucide-react";
import type { Tier } from "@/lib/mock-data";

export const Route = createFileRoute("/suggest")({
  head: () => ({
    meta: [
      { title: "Suggestions — FAIV Predict" },
      { name: "description", content: "AI-driven recommendations with projected lift and tier shift." },
    ],
  }),
  component: SuggestPage,
});

const TIER_ORDER: Tier[] = ["Risky", "Weak", "Average", "Strong", "Viral"];

// Parse "+14% reach" → 14
function parseLift(s: string): number {
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function SuggestPage() {
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const totals = useMemo(() => {
    const ids = Object.keys(applied).filter((id) => applied[id]);
    const lift = ids.reduce((sum, id) => {
      const s = SUGGESTIONS.find((x) => x.id === id);
      return sum + (s ? parseLift(s.projection) : 0);
    }, 0);

    // Resolve final tier from highest applied target
    const baseTier: Tier = "Strong";
    let finalTierIdx = TIER_ORDER.indexOf(baseTier);
    ids.forEach((id) => {
      const s = SUGGESTIONS.find((x) => x.id === id);
      if (s?.tierShift) {
        const toIdx = TIER_ORDER.indexOf(s.tierShift.to as Tier);
        if (toIdx > finalTierIdx) finalTierIdx = toIdx;
      }
    });
    const finalTier = TIER_ORDER[finalTierIdx];

    const totalAvailable = SUGGESTIONS.length;
    const appliedCount = ids.length;
    const confidence = 88 + Math.min(8, appliedCount * 2);

    return { lift, finalTier, baseTier, appliedCount, totalAvailable, confidence };
  }, [applied]);

  const allApplied = totals.appliedCount === SUGGESTIONS.length;

  const applyAll = () => {
    const next: Record<string, boolean> = {};
    SUGGESTIONS.forEach((s) => (next[s.id] = true));
    setApplied(next);
    setDismissed({});
  };

  const reset = () => setApplied({});

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="AI suggestions"
          title="Make this post stronger"
          description="Each suggestion is ranked by predicted lift. Apply to update the projection live."
          actions={
            <div className="flex items-center gap-2">
              {totals.appliedCount > 0 && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
              <button className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-surface-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Re-generate
              </button>
            </div>
          }
        />

        {/* Composite lift hero — borderless gradient panel, no card */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-surface-2 via-surface to-surface p-6 md:p-10 shadow-[var(--shadow-elevated)]">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-[340px] w-[340px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 55%, transparent), transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary">
                {totals.appliedCount === 0
                  ? "Apply suggestions to see lift"
                  : allApplied
                  ? "All 4 suggestions applied"
                  : `${totals.appliedCount} of ${totals.totalAvailable} applied`}
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  Projected lift
                </h2>
                <AnimatedNumber value={totals.lift} />
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Tier{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totals.baseTier}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    <TierBadge tier={totals.baseTier} className="mx-1" />
                  </motion.span>
                </AnimatePresence>
                <ArrowRight className="mx-1 inline h-3.5 w-3.5 -translate-y-0.5 text-muted-foreground" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totals.finalTier}
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    <TierBadge tier={totals.finalTier} className="mx-1" />
                  </motion.span>
                </AnimatePresence>
                with{" "}
                <span className="font-mono tabular-nums text-foreground">{totals.confidence}%</span>{" "}
                model confidence.
              </p>
            </div>
            <button
              onClick={applyAll}
              disabled={allApplied}
              className="group inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] hover:scale-[1.02] disabled:scale-100 disabled:opacity-60 md:self-center"
            >
              {allApplied ? (
                <>
                  <Check className="h-4 w-4" />
                  All applied
                </>
              ) : (
                <>
                  Apply all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {SUGGESTIONS.map((s, i) => {
            const isApplied = !!applied[s.id];
            const isDismissed = !!dismissed[s.id];
            return (
              <motion.article
                key={s.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: isDismissed ? 0.4 : 1,
                  y: 0,
                  scale: isApplied ? 1 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.04,
                }}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all ${
                  isApplied
                    ? "bg-[color-mix(in_oklab,var(--primary)_8%,var(--surface))] shadow-[var(--shadow-glow-purple)]"
                    : "bg-surface/60 hover:bg-surface backdrop-blur-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)]"
                }`}
              >
                {/* Applied badge */}
                <AnimatePresence>
                  {isApplied && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-5 top-5 flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary-foreground"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Applied
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isApplied && (
                  <div className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg bg-surface-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}

                <div className="pr-16">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.detail}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Projection
                    </span>
                    <span className="font-display text-xl font-semibold tabular-nums text-gradient-primary">
                      {s.projection}
                    </span>
                  </div>
                  {s.tierShift && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <TierBadge tier={s.tierShift.from as Tier} />
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <TierBadge tier={s.tierShift.to as Tier} />
                    </div>
                  )}
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setApplied((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                    }
                    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      isApplied
                        ? "bg-surface-2 text-foreground hover:bg-surface-3"
                        : "bg-primary text-primary-foreground hover:shadow-[var(--shadow-glow-purple)]"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Undo2 className="h-3.5 w-3.5" />
                        Undo
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Apply
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDismissed((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-surface-2 px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Dismiss
                  </button>
                </div>
              </motion.article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}

/** Animated lift counter — eases between values */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    const start = performance.now();
    const dur = 360;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(from + (to - from) * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const sign = display >= 0 ? "+" : "";
  return (
    <span className="font-display text-5xl font-semibold tabular-nums text-gradient-primary md:text-7xl">
      {sign}
      {display.toFixed(0)}%
    </span>
  );
}
