import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { FlowStepper } from "@/components/FlowStepper";
import { FEATURE_IMPORTANCE } from "@/lib/mock-data";
import { Info, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/diagnose")({
  head: () => ({
    meta: [
      { title: "Diagnose — FAIV Predict" },
      { name: "description", content: "Mean Decrease in Impurity (MDI) feature importance for the Random Forest model." },
    ],
  }),
  component: DiagnosePage,
});

function DiagnosePage() {
  const max = Math.max(...FEATURE_IMPORTANCE.map((f) => f.importance));
  const total = FEATURE_IMPORTANCE.reduce((s, f) => s + f.importance, 0);

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6">
          <FlowStepper />
        </div>
        <SectionHeader
          eyebrow="Diagnose"
          title="Feature importance (MDI)"
          description="Mean Decrease in Impurity — proportion of impurity reduction each feature contributes across all trees in the forest. Always non-negative; sums to 1.0."
          actions={
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              MDI · scikit-learn feature_importances_
            </div>
          }
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-semibold">Horizontal bar chart</h3>
              </div>
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                Σ = {(total * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-4">
              {FEATURE_IMPORTANCE.map((f, i) => {
                const pct = (f.importance / max) * 100;
                return (
                  <div
                    key={f.key}
                    style={{ animation: `slide-up 0.5s ${i * 60}ms both` }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{f.feature}</span>
                        <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {f.key}
                        </span>
                      </div>
                      <span className="font-mono tabular-nums text-foreground">
                        {(f.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-surface-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 55%, transparent))",
                          boxShadow: "0 0 12px var(--primary)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <h3 className="font-display text-lg font-semibold">About MDI</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              MDI measures how often each feature is used to split nodes across all decision trees,
              weighted by the impurity reduction at each split. Values are always between 0 and 1
              and always positive — there is no concept of a feature "reducing" the score, only
              how strongly it shapes the model's decision boundaries.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                Sums to 100% across all 6 features.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                Highest signal: <span className="font-mono text-foreground">media_type</span> (28%).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                Computed at training time per niche / personal model.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Format dominates the niche split",
              body: "media_type accounts for ~28% of impurity reduction — the model relies heavily on whether a post is Reels, Carousel or Single Image.",
            },
            {
              title: "Posting time is the runner-up",
              body: "posting_hour and posting_day together carry ~33% of the model's decision weight in this niche.",
            },
            {
              title: "Caption signals are secondary",
              body: "caption_length, hashtag_count and has_cta together account for ~39% — they inform but rarely drive the classification alone.",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl"
              style={{ animation: `slide-up 0.5s ${i * 80}ms both` }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Insight
              </div>
              <div className="mt-3 font-display text-base font-semibold">{c.title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
