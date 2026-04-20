import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { BATCH_RESULTS } from "@/lib/mock-data";
import type { Tier } from "@/lib/mock-data";
import { Upload, FileSpreadsheet, Download, Filter, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/batch")({
  head: () => ({
    meta: [
      { title: "Batch Predict — FAIV Predict" },
      { name: "description", content: "Score multiple posts at once via CSV upload or queued drafts." },
    ],
  }),
  component: BatchPage,
});

function BatchPage() {
  const summary = {
    total: BATCH_RESULTS.length,
    viral: BATCH_RESULTS.filter((r) => r.tier === "Viral").length,
    strong: BATCH_RESULTS.filter((r) => r.tier === "Strong").length,
    avgConfidence: Math.round(
      BATCH_RESULTS.reduce((s, r) => s + r.confidence, 0) / BATCH_RESULTS.length
    ),
  };

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Batch"
          title="Predict at scale"
          description="Upload a CSV of posts or pull drafts from a connected workspace."
          actions={
            <>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-surface-2">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-cyan)] transition hover:scale-[1.02]">
                <Upload className="h-4 w-4" />
                Upload CSV
              </button>
            </>
          }
        />

        {/* Upload zone + summary */}
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="group relative flex min-h-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border-strong bg-surface/40 p-8 backdrop-blur transition-all hover:border-primary hover:bg-surface-2">
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at center, color-mix(in oklab, var(--primary-glow) 20%, transparent), transparent 60%)",
              }}
            />
            <div className="relative text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-border-strong bg-surface-2 transition-all group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-cyan)]">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-4 font-display text-lg font-semibold">
                Drop a CSV or click to browse
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Required columns: <span className="font-mono text-foreground">caption</span>,{" "}
                <span className="font-mono text-foreground">format</span>,{" "}
                <span className="font-mono text-foreground">post_time</span>
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-3 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Up to 5,000 rows
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="Total predicted" value={summary.total} accent="var(--primary)" />
            <SummaryCard label="Viral hits" value={summary.viral} accent="var(--secondary-glow)" />
            <SummaryCard label="Strong" value={summary.strong} accent="oklch(0.78 0.18 155)" />
            <SummaryCard label="Avg. confidence" value={`${summary.avgConfidence}%`} accent="oklch(0.82 0.16 75)" />
          </div>
        </section>

        {/* Results table */}
        <section className="mt-8 rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Latest batch · spring-drop.csv</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Processed {BATCH_RESULTS.length} rows · 12 minutes ago
              </p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" /> Sort
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Content</th>
                  <th className="px-5 py-3 font-medium">Format</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 font-medium">Tier</th>
                </tr>
              </thead>
              <tbody>
                {BATCH_RESULTS.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {String(r.id).padStart(3, "0")}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{r.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">
                        {r.format}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${r.confidence}%`,
                              background: "var(--gradient-primary)",
                              boxShadow: "0 0 8px var(--primary)",
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs">{r.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <TierBadge tier={r.tier as Tier} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl">
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50"
        style={{
          background: `radial-gradient(circle, ${accent}, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {value}
        </div>
      </div>
    </div>
  );
}
