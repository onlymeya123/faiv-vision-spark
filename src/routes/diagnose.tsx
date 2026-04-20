import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { FlowStepper } from "@/components/FlowStepper";
import { FEATURE_IMPORTANCE } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/diagnose")({
  head: () => ({
    meta: [
      { title: "Diagnose — FAIV Predict" },
      { name: "description", content: "Feature importance and signal contribution for the prediction." },
    ],
  }),
  component: DiagnosePage,
});

const RADAR = [
  { axis: "Hook", value: 92, baseline: 64 },
  { axis: "Format", value: 88, baseline: 70 },
  { axis: "Timing", value: 84, baseline: 60 },
  { axis: "CTA", value: 76, baseline: 55 },
  { axis: "Hashtags", value: 82, baseline: 68 },
  { axis: "Audience", value: 90, baseline: 71 },
];

function DiagnosePage() {
  const max = Math.max(...FEATURE_IMPORTANCE.map((f) => f.impact));

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6">
          <FlowStepper />
        </div>
        <SectionHeader
          eyebrow="Diagnose"
          title="Why this score?"
          description="Inspect every signal contributing to the prediction. Positive bars push the score up, negative pull it down."
          actions={
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              SHAP-style attribution
            </div>
          }
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Feature importance</h3>
              <div className="flex gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  Lifts score
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-destructive shadow-[0_0_8px_var(--destructive)]" />
                  Reduces score
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {FEATURE_IMPORTANCE.map((f, i) => {
                const pct = (f.impact / max) * 100;
                const positive = f.direction === "positive";
                return (
                  <div
                    key={f.feature}
                    style={{ animation: `slide-up 0.5s ${i * 60}ms both` }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {positive ? (
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span className="font-medium">{f.feature}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">
                        {positive ? "+" : "−"}
                        {(f.impact * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-surface-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: positive
                            ? "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 60%, transparent))"
                            : "linear-gradient(90deg, var(--destructive), color-mix(in oklab, var(--destructive) 60%, transparent))",
                          boxShadow: positive
                            ? "0 0 12px var(--primary)"
                            : "0 0 12px var(--destructive)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <h3 className="font-display text-lg font-semibold">Signal radar</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Your post (cyan) vs. account baseline (violet).
            </p>
            <div className="mt-2 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR} outerRadius="72%">
                  <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: "oklch(0.7 0.02 255)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar
                    dataKey="baseline"
                    stroke="oklch(0.78 0.18 130)"
                    fill="oklch(0.78 0.18 130)"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                  />
                  <Radar
                    dataKey="value"
                    stroke="oklch(0.55 0.18 295)"
                    fill="oklch(0.55 0.18 295)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              tone: "positive",
              title: "Hook is doing heavy lifting",
              body: "Your opening 8 words drove ~28% of the score. The model recognized 'behind every drop' as a high-retention pattern.",
            },
            {
              tone: "positive",
              title: "Timing aligns with audience peak",
              body: "Posting at 19:30 sits within the 19:00–21:00 high-engagement window for this account's audience cluster.",
            },
            {
              tone: "negative",
              title: "Caption length adds drag",
              body: "At 412 characters you're slightly above the optimal 180–320 range for Reels in this niche.",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl"
              style={{ animation: `slide-up 0.5s ${i * 80}ms both` }}
            >
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  c.tone === "positive"
                    ? "bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary"
                    : "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[oklch(0.80_0.22_22)]"
                }`}
              >
                {c.tone === "positive" ? "Lift" : "Drag"}
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
