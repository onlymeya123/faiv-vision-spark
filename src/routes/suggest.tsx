import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { SUGGESTIONS } from "@/lib/mock-data";
import { Sparkles, ArrowRight, Check, X } from "lucide-react";
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

function SuggestPage() {
  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="AI suggestions"
          title="Make this post stronger"
          description="Each suggestion is ranked by predicted lift, with the tier shift if you apply it."
          actions={
            <button className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-surface-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Re-generate
            </button>
          }
        />

        {/* Composite lift banner */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface-2 via-surface to-surface p-6 md:p-8">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
              filter: "blur(70px)",
            }}
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary">
                If you apply all 4 suggestions
              </div>
              <div className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Projected lift{" "}
                <span className="text-gradient-primary">+38%</span>
              </div>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Tier shifts from <TierBadge tier="Strong" className="mx-1" /> to{" "}
                <TierBadge tier="Viral" className="mx-1" /> with 96% model confidence.
              </p>
            </div>
            <button className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-cyan)] transition-all hover:scale-[1.02] md:self-center">
              Apply all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {SUGGESTIONS.map((s, i) => (
            <article
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl transition-all hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
              style={{ animation: `slide-up 0.5s ${i * 80}ms both` }}
            >
              <div className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="pr-12">
                <h3 className="font-display text-lg font-semibold leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.detail}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Projection
                  </span>
                  <span className="font-display text-xl font-semibold text-gradient-primary">
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

              <div className="mt-4 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground transition hover:shadow-[var(--shadow-glow-cyan)]">
                  <Check className="h-3.5 w-3.5" />
                  Apply
                </button>
                <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                  Dismiss
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
