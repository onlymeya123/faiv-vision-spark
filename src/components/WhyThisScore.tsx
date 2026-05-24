import Link from "next/link";
import { Sparkles, TrendingUp, TrendingDown, ArrowRight, Brain } from "lucide-react";

export interface WhyReason {
  label: string;
  detail: string;
  weight: number; // 0..1
  direction: "positive" | "negative";
}

export interface WhyThisScoreProps {
  reasons: WhyReason[];
  /** Short context line, e.g. "Based on niche-level data + 124 personal samples." */
  context?: string;
}

export function WhyThisScore({ reasons, context }: WhyThisScoreProps) {
  const sorted = [...reasons].sort((a, b) => b.weight - a.weight).slice(0, 3);
  const max = Math.max(...reasons.map((r) => r.weight), 0.001);

  return (
    <section
      aria-labelledby="why-score-heading"
      className="rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-surface p-6 shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,hsl(var(--primary))_12%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3 w-3" />
            Why this score
          </div>
          <h3
            id="why-score-heading"
            className="font-display mt-2.5 text-xl font-semibold tracking-tight"
          >
            The model's top three reasons
          </h3>
          {context && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Brain className="h-3 w-3" />
              {context}
            </p>
          )}
        </div>
        <Link
          href="/diagnose"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2"
        >
          Full breakdown
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul className="mt-5 space-y-3">
        {sorted.map((r, i) => {
          const positive = r.direction === "positive";
          const pct = Math.round((r.weight / max) * 100);
          return (
            <li key={r.label} className="grid grid-cols-[24px_1fr_auto] items-start gap-3">
              <span
                className={`mt-0.5 grid h-6 w-6 place-items-center rounded-md text-xs font-mono font-semibold ${
                  positive
                    ? "bg-[color-mix(in_oklab,hsl(var(--accent-lime))_18%,transparent)] text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)]"
                    : "bg-[color-mix(in_oklab,hsl(var(--destructive))_15%,transparent)] text-destructive"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {positive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-[oklch(0.55_0.18_130)] dark:text-[oklch(0.85_0.20_130)]" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                  {r.label}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: positive
                        ? "var(--gradient-lime)"
                        : "hsl(var(--destructive))",
                    }}
                  />
                </div>
              </div>
              <div
                className={`pt-0.5 font-mono text-xs font-semibold tabular-nums ${
                  positive
                    ? "text-[oklch(0.45_0.18_130)] dark:text-[oklch(0.85_0.20_130)]"
                    : "text-destructive"
                }`}
              >
                {positive ? "+" : "−"}
                {(r.weight * 100).toFixed(0)}%
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
