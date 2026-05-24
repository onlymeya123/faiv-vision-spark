"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { MODELS, type MlModel } from "@/lib/mock-data";
import {
  Cpu,
  CheckCircle2,
  PauseCircle,
  Sparkles,
  RefreshCw,
  TrendingDown,
} from "lucide-react";

export default function ModelHealthPage() {
  return (
    <div className="px-5 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Model health"
        title="Performance & drift"
        description="Live view of every model in the workspace. Drift alerts trigger when rolling accuracy drops more than 15 points below baseline."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-surface-2 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Trigger manual retrain
          </button>
        }
      />

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Active models"
          value={MODELS.filter((m) => m.is_active).length.toString()}
          tone="primary"
        />
        <SummaryCard
          label="Average rolling accuracy"
          value={`${(
            MODELS.reduce((s, m) => s + m.rollingAccuracy, 0) / MODELS.length
          ).toFixed(1)}%`}
          tone="lime"
        />
        <SummaryCard
          label="Drift alerts"
          value={MODELS.filter((m) => m.baselineAccuracy - m.rollingAccuracy > 15).length.toString()}
          tone="destructive"
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-6 py-4 font-medium">Model</th>
                <th className="px-6 py-4 font-medium">Niche</th>
                <th className="px-6 py-4 font-medium">Version</th>
                <th className="px-6 py-4 font-medium">Baseline</th>
                <th className="px-6 py-4 font-medium">30d rolling</th>
                <th className="px-6 py-4 font-medium">Trend</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m, i) => (
                <ModelRow key={m.id} m={m} i={i} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ModelRow({ m, i }: { m: MlModel; i: number }) {
  const drop = m.baselineAccuracy - m.rollingAccuracy;
  const drift = drop > 15;
  const isPersonal = m.scope === "Personal";

  return (
    <tr
      className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
      style={{ animation: `slide-up 0.4s ${i * 60}ms both` }}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border-strong"
            style={{
              background: isPersonal
                ? "color-mix(in oklab, hsl(var(--accent-lime)) 14%, transparent)"
                : "color-mix(in oklab, hsl(var(--primary)) 14%, transparent)",
              boxShadow: isPersonal
                ? "inset 0 0 16px color-mix(in oklab, hsl(var(--accent-lime)) 22%, transparent)"
                : "inset 0 0 16px color-mix(in oklab, hsl(var(--primary)) 22%, transparent)",
            }}
          >
            {isPersonal ? (
              <Sparkles className="h-[18px] w-[18px] text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)]" />
            ) : (
              <Cpu className="h-[18px] w-[18px] text-primary" />
            )}
          </div>
          <span className="font-mono text-sm font-medium leading-tight">{m.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">{m.niche}</td>
      <td className="px-6 py-4">
        <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px]">
          {m.version}
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-xs">{m.baselineAccuracy.toFixed(1)}%</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{
                width: `${m.rollingAccuracy}%`,
                background: drift ? "hsl(var(--destructive))" : "var(--gradient-primary)",
                boxShadow: drift
                  ? "0 0 8px hsl(var(--destructive))"
                  : "0 0 8px hsl(var(--primary))",
              }}
            />
          </div>
          <span className={`font-mono text-xs ${drift ? "text-destructive font-semibold" : ""}`}>
            {m.rollingAccuracy.toFixed(1)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Sparkline values={m.rolling30d} drift={drift} />
      </td>
      <td className="px-6 py-4">
        {drift ? (
          <span
            role="alert"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,hsl(var(--destructive))_18%,transparent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive ring-1 ring-inset ring-[color-mix(in_oklab,hsl(var(--destructive))_45%,transparent)] animate-pulse"
          >
            <TrendingDown className="h-3 w-3" />
            Drift −{drop.toFixed(1)}pt
          </span>
        ) : m.is_active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,hsl(var(--success))_15%,transparent)] px-2 py-1 text-[11px] font-medium text-[oklch(0.85_0.18_155)]">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-1 text-[11px] font-medium text-muted-foreground">
            <PauseCircle className="h-3 w-3" /> Inactive
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {drift ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-[11px] font-semibold text-destructive-foreground transition-all hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw className="h-3 w-3" />
            Retrain
          </button>
        ) : (
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
          >
            Manage
          </button>
        )}
      </td>
    </tr>
  );
}

function Sparkline({ values, drift }: { values: number[]; drift: boolean }) {
  const w = 80;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = drift ? "hsl(var(--destructive))" : "hsl(var(--primary))";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
    </svg>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "lime" | "destructive";
}) {
  const bg =
    tone === "primary"
      ? "color-mix(in oklab, hsl(var(--primary)) 8%, hsl(var(--surface)))"
      : tone === "lime"
      ? "color-mix(in oklab, hsl(var(--accent-lime)) 8%, hsl(var(--surface)))"
      : "color-mix(in oklab, hsl(var(--destructive)) 8%, hsl(var(--surface)))";
  const dot =
    tone === "primary"
      ? "hsl(var(--primary))"
      : tone === "lime"
      ? "hsl(var(--accent-lime))"
      : "hsl(var(--destructive))";
  return (
    <div
      className="rounded-2xl border border-border p-5"
      style={{ background: bg }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
        />
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
