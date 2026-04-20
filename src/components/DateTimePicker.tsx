import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const setDate = (d: Date | undefined) => {
    if (!d) return;
    const merged = new Date(d);
    merged.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onChange(merged);
  };

  const setHour = (h: number) => {
    const next = new Date(value);
    next.setHours(h);
    onChange(next);
  };

  const setMinute = (m: number) => {
    const next = new Date(value);
    next.setMinutes(m);
    onChange(next);
  };

  const bumpHour = (delta: number) => setHour((value.getHours() + 24 + delta) % 24);
  const bumpMinute = (delta: number) => {
    const cur = value.getMinutes();
    const next = (cur + 60 + delta) % 60;
    setMinute(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-12 w-full items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 text-left text-sm outline-none transition-all hover:border-border-strong focus-visible:border-ring focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]",
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          <div className="flex flex-1 items-baseline gap-2">
            <span className="font-medium tabular-nums">{format(value, "EEE, MMM d")}</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono text-[13px] tabular-nums text-foreground">
              {format(value, "HH:mm")}
            </span>
          </div>
          <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            change
          </kbd>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto overflow-hidden rounded-2xl border border-border-strong p-0 shadow-[var(--shadow-elevated)]"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="border-b border-border sm:border-b-0 sm:border-r">
            <Calendar
              mode="single"
              selected={value}
              onSelect={setDate}
              className={cn("p-3 pointer-events-auto")}
              initialFocus
            />
          </div>

          <div className="flex w-full flex-col gap-3 p-4 sm:w-[200px]">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Clock className="h-3 w-3" />
              Time
            </div>

            {/* Spinner */}
            <div className="grid grid-cols-2 gap-2">
              <Spinner
                value={value.getHours()}
                onUp={() => bumpHour(1)}
                onDown={() => bumpHour(-1)}
                label="Hour"
              />
              <Spinner
                value={value.getMinutes()}
                onUp={() => bumpMinute(5)}
                onDown={() => bumpMinute(-5)}
                label="Min"
              />
            </div>

            {/* Quick times */}
            <div>
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Suggested
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  [9, 0],
                  [12, 30],
                  [18, 0],
                  [19, 30],
                  [20, 15],
                  [21, 0],
                ].map(([h, m]) => {
                  const active = value.getHours() === h && value.getMinutes() === m;
                  return (
                    <button
                      key={`${h}-${m}`}
                      type="button"
                      onClick={() => {
                        setHour(h);
                        setMinute(m);
                      }}
                      className={cn(
                        "rounded-md border px-1.5 py-1 font-mono text-[11px] tabular-nums transition-all",
                        active
                          ? "border-primary bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary"
                          : "border-border bg-surface-2 text-muted-foreground hover:border-border-strong hover:text-foreground",
                      )}
                    >
                      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  onChange(now);
                }}
                className="rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all hover:shadow-[var(--shadow-glow-purple)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Inline hour/minute selectors collapsed for compactness */}
        <div className="hidden">
          {HOURS.map((h) => h)}
          {MINUTES.map((m) => m)}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Spinner({
  value,
  onUp,
  onDown,
  label,
}: {
  value: number;
  onUp: () => void;
  onDown: () => void;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-2">
      <button
        type="button"
        onClick={onUp}
        className="flex w-full items-center justify-center py-1 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-primary"
        aria-label={`Increase ${label}`}
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <div className="border-y border-border bg-surface px-2 py-2 text-center font-mono text-lg font-semibold tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <button
        type="button"
        onClick={onDown}
        className="flex w-full items-center justify-center py-1 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-primary"
        aria-label={`Decrease ${label}`}
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
