import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { CALENDAR_ENTRIES, type CalendarEntry } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content calendar — FAIV Predict" },
      { name: "description", content: "Plan, schedule, and forecast your content month at a glance." },
    ],
  }),
  component: CalendarPage,
});

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatColor(format: CalendarEntry["format"]) {
  switch (format) {
    case "Reels": return "var(--primary)";
    case "Carousel": return "var(--accent-lime)";
    case "Story": return "var(--chart-3)";
    case "Single image": return "var(--chart-4)";
  }
}

function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = React.useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selected, setSelected] = React.useState<number | null>(today.getDate());

  const firstDay = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  // Monday = 0
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const entriesByDay = React.useMemo(() => {
    const map = new Map<number, CalendarEntry[]>();
    for (const e of CALENDAR_ENTRIES) {
      if (!map.has(e.day)) map.set(e.day, []);
      map.get(e.day)!.push(e);
    }
    return map;
  }, []);

  const selectedEntries =
    selected != null ? entriesByDay.get(selected) ?? [] : [];

  const monthTotal = CALENDAR_ENTRIES.length;
  const viralCount = CALENDAR_ENTRIES.filter((e) => e.tier === "Viral").length;
  const strongCount = CALENDAR_ENTRIES.filter((e) => e.tier === "Strong").length;

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Planning"
          title="Content calendar"
          description="Every scheduled post, color-coded by format and forecasted tier."
          actions={
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-transform hover:scale-[1.02]"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Plus className="h-3.5 w-3.5" />
                New post
              </button>
            </div>
          }
        />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Calendar grid */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {MONTH_NAMES[cursor.month]} {cursor.year}
                </h3>
                <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {monthTotal} posts
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCursor((c) => ({
                      year: c.month === 0 ? c.year - 1 : c.year,
                      month: (c.month + 11) % 12,
                    }))
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const d = new Date();
                    setCursor({ year: d.getFullYear(), month: d.getMonth() });
                    setSelected(d.getDate());
                  }}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
                >
                  Today
                </button>
                <button
                  onClick={() =>
                    setCursor((c) => ({
                      year: c.month === 11 ? c.year + 1 : c.year,
                      month: (c.month + 1) % 12,
                    }))
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
              {WEEK.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - startOffset + 1;
                const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
                const isToday =
                  inMonth &&
                  dayNum === today.getDate() &&
                  cursor.month === today.getMonth() &&
                  cursor.year === today.getFullYear();
                const isSelected = inMonth && dayNum === selected;
                const dayEntries = inMonth ? entriesByDay.get(dayNum) ?? [] : [];

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!inMonth}
                    onClick={() => setSelected(dayNum)}
                    className={`group relative aspect-square min-h-[88px] rounded-xl border p-2 text-left transition-all ${
                      !inMonth
                        ? "cursor-default border-transparent bg-transparent"
                        : isSelected
                        ? "border-primary bg-[color-mix(in_oklab,var(--primary)_8%,var(--surface))] shadow-[var(--shadow-soft)]"
                        : "border-border bg-surface hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    {inMonth && (
                      <>
                        <div className="flex items-center justify-between">
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-md text-xs font-semibold ${
                              isToday
                                ? "text-primary-foreground"
                                : isSelected
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                            style={
                              isToday
                                ? { background: "var(--gradient-primary)" }
                                : undefined
                            }
                          >
                            {dayNum}
                          </span>
                          {dayEntries.length > 0 && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {dayEntries.length}
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 space-y-1">
                          {dayEntries.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                              style={{
                                background: `color-mix(in oklab, ${formatColor(
                                  e.format
                                )} 18%, transparent)`,
                                color: `color-mix(in oklab, ${formatColor(
                                  e.format
                                )} 80%, var(--foreground))`,
                                borderLeft: `2px solid ${formatColor(e.format)}`,
                              }}
                            >
                              {e.title}
                            </div>
                          ))}
                          {dayEntries.length > 2 && (
                            <div className="px-1.5 text-[10px] text-muted-foreground">
                              +{dayEntries.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Format legend */}
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              {(["Reels", "Carousel", "Story", "Single image"] as const).map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: formatColor(f) }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Side panel: selected day + month stats */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Month forecast
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <div className="font-display text-2xl font-semibold">{monthTotal}</div>
                  <div className="text-[11px] text-muted-foreground">Scheduled</div>
                </div>
                <div>
                  <div
                    className="font-display text-2xl font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {viralCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Viral</div>
                </div>
                <div>
                  <div
                    className="font-display text-2xl font-semibold"
                    style={{ color: "color-mix(in oklab, var(--accent-lime) 70%, var(--foreground))" }}
                  >
                    {strongCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Strong</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
              <div className="border-b border-border p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  {selected
                    ? `${MONTH_NAMES[cursor.month]} ${selected}`
                    : "Select a day"}
                </div>
                <h4 className="mt-1 font-display text-base font-semibold">
                  {selectedEntries.length === 0
                    ? "Nothing scheduled"
                    : `${selectedEntries.length} post${selectedEntries.length > 1 ? "s" : ""} planned`}
                </h4>
              </div>
              {selectedEntries.length === 0 ? (
                <div className="p-5">
                  <button
                    className="w-full rounded-xl border border-dashed border-border-strong bg-surface-2 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
                  >
                    + Schedule a post
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {selectedEntries.map((e) => (
                    <li key={e.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1 h-8 w-1 shrink-0 rounded-full"
                          style={{ background: formatColor(e.format) }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate text-sm font-semibold">
                              {e.title}
                            </div>
                            <TierBadge tier={e.tier} />
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                            <span className="font-mono">{e.time}</span>
                            <span>·</span>
                            <span>{e.account}</span>
                            <span>·</span>
                            <span
                              className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium"
                              style={{ color: formatColor(e.format) }}
                            >
                              {e.format}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
