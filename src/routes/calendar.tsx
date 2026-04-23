import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { BRANDS, type Tier, type ContentFormat } from "@/lib/mock-data";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  Loader2,
  CalendarRange,
} from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar — FAIV Predict" },
      {
        name: "description",
        content:
          "Batch prediction via Excel upload. Score an entire content calendar in one go and download tier classifications.",
      },
    ],
  }),
  component: CalendarPage,
});

type Row = {
  id: string;
  scheduled: string;
  account: string;
  format: ContentFormat;
  caption: string;
  tier: Tier;
  confidence: number;
};

const SAMPLE_ROWS: Row[] = [
  { id: "r1", scheduled: "Mon, 28 Apr · 19:30", account: "@nova.studio", format: "Reels", caption: "Behind the scenes — week 17 shoot day…", tier: "High", confidence: 91 },
  { id: "r2", scheduled: "Tue, 29 Apr · 12:15", account: "@lasence.bakeshop", format: "Carousel", caption: "Spring menu lineup, 6 new pastries arriving…", tier: "High", confidence: 87 },
  { id: "r3", scheduled: "Tue, 29 Apr · 20:00", account: "@kindred.brand", format: "Single Image", caption: "New drop · linen series 02 now live…", tier: "Average", confidence: 74 },
  { id: "r4", scheduled: "Wed, 30 Apr · 09:00", account: "@bison.gym", format: "Reels", caption: "Morning mobility flow, 6 minutes flat…", tier: "Average", confidence: 68 },
  { id: "r5", scheduled: "Wed, 30 Apr · 18:45", account: "@orbit.media", format: "Carousel", caption: "Editor's picks — 5 reads to close the week…", tier: "Low", confidence: 61 },
  { id: "r6", scheduled: "Thu, 1 May · 20:15", account: "@solene.atelier", format: "Reels", caption: "Atelier walkthrough · the cutting room…", tier: "High", confidence: 93 },
  { id: "r7", scheduled: "Fri, 2 May · 11:30", account: "@nova.studio", format: "Single Image", caption: "Soft launch poster, comment what you see…", tier: "Average", confidence: 76 },
  { id: "r8", scheduled: "Sat, 3 May · 19:00", account: "@lasence.bakeshop", format: "Reels", caption: "Croissant lamination, slow motion…", tier: "High", confidence: 89 },
];

function CalendarPage() {
  const [stage, setStage] = useState<"empty" | "uploaded" | "scoring" | "done">("empty");
  const [fileName, setFileName] = useState<string | null>(null);
  const [brand, setBrand] = useState(BRANDS[0]?.name ?? "");

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setStage("uploaded");
  };

  const runBatch = async () => {
    setStage("scoring");
    await new Promise((r) => setTimeout(r, 1400));
    setStage("done");
  };

  const distribution = SAMPLE_ROWS.reduce(
    (acc, r) => ({ ...acc, [r.tier]: (acc[r.tier] ?? 0) + 1 }),
    {} as Record<Tier, number>,
  );

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Batch prediction"
          title="Content Calendar"
          description="Upload an Excel file with your scheduled posts and score the whole calendar in one run."
          actions={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download template
            </button>
          }
        />

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          {/* Upload card */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
              Step 1 — Upload
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold">Calendar file</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted: .xlsx, .csv. Use the provided template for the smoothest run.
            </p>

            <label
              htmlFor="calendar-upload"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-2/40 px-6 py-10 text-center transition-all hover:border-primary hover:bg-[color-mix(in_oklab,var(--primary)_5%,transparent)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm font-medium">
                {fileName ?? "Drop your file or click to browse"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Up to 500 rows per upload
              </div>
              <input
                id="calendar-upload"
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={onPickFile}
              />
            </label>

            <div className="mt-5">
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Brand
              </div>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3 text-sm outline-none focus:border-ring"
              >
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={stage === "empty" || stage === "scoring"}
              onClick={runBatch}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {stage === "scoring" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scoring calendar…
                </>
              ) : stage === "done" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Re-run prediction
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run batch prediction
                </>
              )}
            </button>
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Step 2 — Review
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold">Calendar summary</h3>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--secondary-glow)_14%,transparent)]">
                <CalendarRange className="h-5 w-5 text-primary" />
              </div>
            </div>

            {stage === "done" ? (
              <>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {(["High", "Average", "Low"] as Tier[]).map((t) => (
                    <div
                      key={t}
                      className="rounded-xl border border-border bg-surface p-3"
                    >
                      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {t}
                      </div>
                      <div className="mt-2 font-display text-2xl font-semibold">
                        {distribution[t] ?? 0}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">posts</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-semibold">{fileName ?? "calendar.xlsx"}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {SAMPLE_ROWS.length} rows scored · ready to download
                      </div>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 py-1.5 text-xs font-semibold hover:bg-surface-3 active:scale-95">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6 grid place-items-center gap-2 rounded-xl border border-dashed border-border bg-surface-2/40 px-6 py-12 text-center">
                <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />
                <div className="text-sm font-medium">No calendar scored yet</div>
                <div className="text-[11px] text-muted-foreground">
                  Upload a file to see the tier distribution here.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results table */}
        {stage === "done" && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Step 3 — Results
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold">Scored calendar</h3>
              </div>
              <div className="text-xs text-muted-foreground">
                Showing {SAMPLE_ROWS.length} of {SAMPLE_ROWS.length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Scheduled</th>
                    <th className="px-5 py-4 font-medium">Account</th>
                    <th className="px-5 py-4 font-medium">Format</th>
                    <th className="px-5 py-4 font-medium">Caption preview</th>
                    <th className="px-5 py-4 font-medium">Confidence</th>
                    <th className="px-5 py-4 font-medium">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROWS.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/60 last:border-0 hover:bg-surface-2/60"
                      style={{ animation: `slide-up 0.4s ${i * 40}ms both` }}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                        {r.scheduled}
                      </td>
                      <td className="px-5 py-3.5 font-medium">{r.account}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-md border border-border bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {r.format}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[320px] truncate text-xs text-muted-foreground">
                        {r.caption}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs">{r.confidence}%</td>
                      <td className="px-5 py-3.5">
                        <TierBadge tier={r.tier} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
