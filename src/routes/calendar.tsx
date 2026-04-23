import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { BRANDS, type Tier, type ContentFormat } from "@/lib/mock-data";
import {
  UploadCloud,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  X,
  Plus,
  Save,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — FAIV Predict" },
      {
        name: "description",
        content:
          "Plan, score and export your monthly content calendar with predicted tier per post.",
      },
    ],
  }),
  component: CalendarPage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type CalendarEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  account: string;
  format: ContentFormat;
  caption: string;
  tier: Tier;
  confidence: number;
  status: "scheduled" | "predicted" | "draft";
};

// ---------------------------------------------------------------------------
// Mock data — anchored to the current month so the grid always has content
// ---------------------------------------------------------------------------
const today = new Date();
const yyyy = today.getFullYear();
const mm = today.getMonth();
const ymd = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const SEED_ENTRIES: CalendarEntry[] = [
  { id: "e1", date: ymd(yyyy, mm, 3), time: "09:00", account: "@nova.studio", format: "Reels", caption: "Behind the scenes — week 17 shoot day", tier: "High", confidence: 91, status: "predicted" },
  { id: "e2", date: ymd(yyyy, mm, 5), time: "19:30", account: "@lasence.bakeshop", format: "Carousel", caption: "Spring menu lineup, 6 new pastries arriving", tier: "High", confidence: 87, status: "predicted" },
  { id: "e3", date: ymd(yyyy, mm, 8), time: "12:15", account: "@kindred.brand", format: "Single Image", caption: "New drop · linen series 02 now live", tier: "Average", confidence: 74, status: "predicted" },
  { id: "e4", date: ymd(yyyy, mm, 10), time: "20:00", account: "@bison.gym", format: "Reels", caption: "Morning mobility flow, 6 minutes flat", tier: "Average", confidence: 68, status: "scheduled" },
  { id: "e5", date: ymd(yyyy, mm, 12), time: "18:45", account: "@orbit.media", format: "Carousel", caption: "Editor's picks — 5 reads to close the week", tier: "Low", confidence: 61, status: "predicted" },
  { id: "e6", date: ymd(yyyy, mm, 15), time: "20:15", account: "@solene.atelier", format: "Reels", caption: "Atelier walkthrough · the cutting room", tier: "High", confidence: 93, status: "predicted" },
  { id: "e7", date: ymd(yyyy, mm, 17), time: "11:30", account: "@nova.studio", format: "Single Image", caption: "Soft launch poster, comment what you see", tier: "Average", confidence: 76, status: "predicted" },
  { id: "e8", date: ymd(yyyy, mm, 17), time: "21:00", account: "@lasence.bakeshop", format: "Reels", caption: "Croissant lamination, slow motion", tier: "High", confidence: 89, status: "predicted" },
  { id: "e9", date: ymd(yyyy, mm, 22), time: "10:00", account: "@kindred.brand", format: "Reels", caption: "Studio tour — capsule SS25", tier: "High", confidence: 90, status: "draft" },
  { id: "e10", date: ymd(yyyy, mm, 24), time: "19:00", account: "@bison.gym", format: "Single Image", caption: "Coach spotlight — meet Mia", tier: "Average", confidence: 72, status: "scheduled" },
  { id: "e11", date: ymd(yyyy, mm, 27), time: "20:00", account: "@orbit.media", format: "Carousel", caption: "Q&A roundup · 8 community questions", tier: "Low", confidence: 58, status: "predicted" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function CalendarPage() {
  const [entries, setEntries] = useState<CalendarEntry[]>(SEED_ENTRIES);
  const [cursor, setCursor] = useState<{ y: number; m: number }>({ y: yyyy, m: mm });
  const [view, setView] = useState<"month" | "list">("month");
  const [editing, setEditing] = useState<CalendarEntry | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const monthEntries = useMemo(
    () =>
      entries.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === cursor.y && d.getMonth() === cursor.m;
      }),
    [entries, cursor],
  );

  const grid = useMemo(() => buildMonthGrid(cursor.y, cursor.m), [cursor]);

  // ------- Mock API: GET /api/v1/calendar/{account_id}?month=YYYY-MM -------
  // (already loaded into local state from SEED_ENTRIES)

  // ------- Mock API: POST /api/v1/calendar/import -------
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    await new Promise((r) => setTimeout(r, 1100));
    // pretend the API parsed file → returned 4 fresh predicted entries
    const fresh: CalendarEntry[] = [
      { id: `imp-${Date.now()}-1`, date: ymd(cursor.y, cursor.m, 6), time: "08:30", account: "@nova.studio", format: "Reels", caption: file.name + " · row 1", tier: "High", confidence: 88, status: "predicted" },
      { id: `imp-${Date.now()}-2`, date: ymd(cursor.y, cursor.m, 14), time: "13:00", account: "@nova.studio", format: "Carousel", caption: file.name + " · row 2", tier: "Average", confidence: 71, status: "predicted" },
      { id: `imp-${Date.now()}-3`, date: ymd(cursor.y, cursor.m, 19), time: "20:30", account: "@nova.studio", format: "Single Image", caption: file.name + " · row 3", tier: "Low", confidence: 55, status: "predicted" },
      { id: `imp-${Date.now()}-4`, date: ymd(cursor.y, cursor.m, 26), time: "19:15", account: "@nova.studio", format: "Reels", caption: file.name + " · row 4", tier: "High", confidence: 92, status: "predicted" },
    ];
    setEntries((prev) => [...prev, ...fresh]);
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ------- Mock API: GET /api/v1/calendar/{account_id}/export -------
  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 700));
    setExporting(false);
  };

  // ------- Mock API: PATCH /api/v1/calendar/{entry_id} -------
  const handleSave = (next: CalendarEntry) => {
    setEntries((prev) =>
      prev.some((e) => e.id === next.id)
        ? prev.map((e) => (e.id === next.id ? next : e))
        : [...prev, next],
    );
    setEditing(null);
    setCreatingDate(null);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setEditing(null);
  };

  const goPrev = () =>
    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const goNext = () =>
    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  const goToday = () => setCursor({ y: yyyy, m: mm });

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Content planning"
          title="Calendar"
          description="Plan your month, see predicted tier per post, and edit any entry inline."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleImport}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={importing}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 active:scale-[0.98] disabled:opacity-60"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                {importing ? "Importing…" : "Upload Excel / CSV"}
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export to Excel
              </button>
            </div>
          }
        />

        {/* Toolbar — month nav + view toggle */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 p-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface hover:bg-surface-2 active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface hover:bg-surface-2 active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2 active:scale-95"
            >
              Today
            </button>
            <div className="ml-2 font-display text-xl font-semibold tracking-tight">
              {MONTH_NAMES[cursor.m]} {cursor.y}
            </div>
            <span className="ml-2 rounded-full border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {monthEntries.length} posts
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs">
            <button
              type="button"
              onClick={() => setView("month")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                view === "month"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Month
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Calendar / List */}
        {view === "month" ? (
          <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
            {/* Weekday header */}
            <div className="grid grid-cols-7 border-b border-border bg-surface-2/60">
              {WEEK_LABELS.map((w) => (
                <div
                  key={w}
                  className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {w}
                </div>
              ))}
            </div>
            {/* Cells */}
            <div className="grid grid-cols-7">
              {grid.map((cell, idx) => {
                const dateStr = ymd(cell.year, cell.month, cell.day);
                const dayEntries = entries.filter((e) => e.date === dateStr);
                const isToday =
                  cell.year === today.getFullYear() &&
                  cell.month === today.getMonth() &&
                  cell.day === today.getDate();
                return (
                  <div
                    key={idx}
                    className={`group relative min-h-[120px] border-b border-r border-border p-2 transition-colors hover:bg-surface-2/60 ${
                      cell.inMonth ? "" : "bg-surface-2/30 text-muted-foreground/60"
                    } ${(idx + 1) % 7 === 0 ? "border-r-0" : ""}`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span
                        className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                          isToday
                            ? "bg-primary text-primary-foreground shadow-[0_0_10px_var(--primary)]"
                            : ""
                        }`}
                      >
                        {cell.day}
                      </span>
                      {cell.inMonth && (
                        <button
                          type="button"
                          onClick={() => setCreatingDate(dateStr)}
                          className="grid h-5 w-5 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-3 hover:text-foreground group-hover:opacity-100"
                          aria-label="Add entry"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayEntries.slice(0, 3).map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setEditing(e)}
                          className="block w-full text-left"
                        >
                          <EntryChip entry={e} />
                        </button>
                      ))}
                      {dayEntries.length > 3 && (
                        <div className="px-1 text-[10px] text-muted-foreground">
                          +{dayEntries.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Time</th>
                    <th className="px-5 py-4 font-medium">Account</th>
                    <th className="px-5 py-4 font-medium">Format</th>
                    <th className="px-5 py-4 font-medium">Caption</th>
                    <th className="px-5 py-4 font-medium">Confidence</th>
                    <th className="px-5 py-4 font-medium">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {monthEntries
                    .slice()
                    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                    .map((r, i) => (
                      <tr
                        key={r.id}
                        onClick={() => setEditing(r)}
                        className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-surface-2/60"
                        style={{ animation: `slide-up 0.3s ${i * 30}ms both` }}
                      >
                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                          {formatDayLabel(r.date)}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs">{r.time}</td>
                        <td className="px-5 py-3.5 font-medium">{r.account}</td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-md border border-border bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground">
                            {r.format}
                          </span>
                        </td>
                        <td className="max-w-[320px] truncate px-5 py-3.5 text-xs text-muted-foreground">
                          {r.caption}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs">{r.confidence}%</td>
                        <td className="px-5 py-3.5">
                          <TierBadge tier={r.tier} />
                        </td>
                      </tr>
                    ))}
                  {monthEntries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No entries this month yet. Upload a file or click a date to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Edit / create modal */}
      {(editing || creatingDate) && (
        <EntryModal
          initial={
            editing ?? {
              id: `new-${Date.now()}`,
              date: creatingDate!,
              time: "19:00",
              account: BRANDS[0]?.handle ?? "@nova.studio",
              format: "Reels",
              caption: "",
              tier: "Average",
              confidence: 70,
              status: "draft",
            }
          }
          isNew={!editing}
          onClose={() => {
            setEditing(null);
            setCreatingDate(null);
          }}
          onSave={handleSave}
          onDelete={editing ? () => handleDelete(editing.id) : undefined}
        />
      )}
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Entry chip (badge inside calendar cell)
// ---------------------------------------------------------------------------
function EntryChip({ entry }: { entry: CalendarEntry }) {
  const tone =
    entry.tier === "High"
      ? "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary ring-[color-mix(in_oklab,var(--primary)_40%,transparent)]"
      : entry.tier === "Average"
      ? "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[oklch(0.50_0.16_75)] dark:text-[oklch(0.85_0.16_75)] ring-[color-mix(in_oklab,var(--warning)_40%,transparent)]"
      : "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-[oklch(0.48_0.18_22)] dark:text-[oklch(0.78_0.20_22)] ring-[color-mix(in_oklab,var(--destructive)_35%,transparent)]";
  return (
    <div
      className={`flex items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-[11px] ring-1 ring-inset transition-all hover:scale-[1.01] ${tone}`}
    >
      <span className="font-mono text-[10px] opacity-70">{entry.time}</span>
      <span className="truncate font-medium text-foreground/90">{entry.account}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
function EntryModal({
  initial,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  initial: CalendarEntry;
  isNew: boolean;
  onClose: () => void;
  onSave: (next: CalendarEntry) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<CalendarEntry>(initial);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[var(--shadow-elevated)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              {isNew ? "New entry" : "Edit entry"}
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold">
              {formatDayLabel(draft.date)} · {draft.time}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-ring"
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-ring"
              />
            </Field>
          </div>
          <Field label="Account">
            <select
              value={draft.account}
              onChange={(e) => setDraft({ ...draft, account: e.target.value })}
              className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-ring"
            >
              {BRANDS.map((b) => (
                <option key={b.id} value={b.handle}>
                  {b.handle}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Format">
            <div className="flex gap-2">
              {(["Reels", "Carousel", "Single Image"] as ContentFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDraft({ ...draft, format: f })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    draft.format === f
                      ? "border-primary bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-primary"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Caption">
            <textarea
              value={draft.caption}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-ring"
              placeholder="What's the post about?"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Predicted tier">
              <div className="flex gap-2">
                {(["High", "Average", "Low"] as Tier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDraft({ ...draft, tier: t })}
                    className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      draft.tier === t
                        ? "border-primary bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-primary"
                        : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`Confidence · ${draft.confidence}%`}>
              <input
                type="range"
                min={30}
                max={99}
                value={draft.confidence}
                onChange={(e) =>
                  setDraft({ ...draft, confidence: Number(e.target.value) })
                }
                className="w-full accent-[var(--primary)]"
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-2/40 p-4">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs font-medium text-destructive hover:underline"
            >
              Delete entry
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(draft)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] hover:scale-[1.02] active:scale-95"
            >
              <Save className="h-4 w-4" />
              {isNew ? "Add entry" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type GridCell = { year: number; month: number; day: number; inMonth: boolean };

function buildMonthGrid(year: number, month: number): GridCell[] {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: GridCell[] = [];
  // Leading days from prev month
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const date = new Date(year, month - 1, d);
    cells.push({ year: date.getFullYear(), month: date.getMonth(), day: d, inMonth: false });
  }
  // This month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ year, month, day: d, inMonth: true });
  }
  // Trailing to fill 6 rows × 7 columns = 42 cells
  while (cells.length < 42) {
    const next = cells.length - (startWeekday + daysInMonth) + 1;
    const date = new Date(year, month + 1, next);
    cells.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      inMonth: false,
    });
  }
  return cells;
}

function formatDayLabel(yyyymmdd: string) {
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
