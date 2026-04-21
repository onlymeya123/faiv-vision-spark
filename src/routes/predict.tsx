import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { DateTimePicker } from "@/components/DateTimePicker";
import { FlowStepper } from "@/components/FlowStepper";
import { ModelMaturity, getMaturityState } from "@/components/ModelMaturity";
import {
  analyzeCaption,
  CaptionMeter,
  CaptionSignals,
  CaptionLimitWarning,
  CAPTION_MAX,
} from "@/components/CaptionIntel";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Film,
  LayoutGrid,
} from "lucide-react";
import type { ContentFormat } from "@/lib/mock-data";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "New Prediction — FAIV Predict" },
      { name: "description", content: "Score a single post: format, schedule, caption length, hashtag count, CTA." },
    ],
  }),
  component: PredictPage,
});

// Only 3 formats supported by the model: media_type ∈ {carousel(0), reels(1), single_image(2)}
const FORMATS: { id: ContentFormat; label: string; icon: typeof Film; hint: string }[] = [
  { id: "Reels", label: "Reels", icon: Film, hint: "Vertical video (1)" },
  { id: "Carousel", label: "Carousel", icon: LayoutGrid, hint: "Multi-image (0)" },
  { id: "Single Image", label: "Single Image", icon: ImageIcon, hint: "Static post (2)" },
];

const ACCOUNTS: { handle: string; samples: number }[] = [
  { handle: "@nova.studio", samples: 247 },
  { handle: "@kindred.brand", samples: 124 },
  { handle: "@orbit.media", samples: 38 },
  { handle: "@solene.atelier", samples: 192 },
];

// 500ms debounce for Caption Intelligence updates (per spec)
function useDebounced<T>(value: T, delay = 500): T {
  const [v, setV] = useState(value);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setV(value), delay);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [value, delay]);
  return v;
}

function PredictPage() {
  const navigate = useNavigate();
  const [accountIdx, setAccountIdx] = useState(0);
  const account = ACCOUNTS[accountIdx];
  const maturityState = getMaturityState(account.samples);
  const [contentFormat, setContentFormat] = useState<ContentFormat>("Reels");

  const [scheduledAt, setScheduledAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(19, 30, 0, 0);
    return d;
  });
  const day = format(scheduledAt, "EEE");
  const timeLabel = format(scheduledAt, "HH:mm");

  const [caption, setCaption] = useState(
    "Behind every drop is a 4am sketch. Save this if you've ever doubted a 2am idea.\n\nWhat's the one project that almost didn't make it?",
  );
  const [submitting, setSubmitting] = useState(false);

  // Live, immediate (no debounce) — used for the character meter color transitions.
  const liveStats = useMemo(() => analyzeCaption(caption), [caption]);
  // Debounced (500ms) — used for downstream model-update preview.
  const debouncedCaption = useDebounced(caption, 500);
  const stats = useMemo(() => analyzeCaption(debouncedCaption), [debouncedCaption]);

  const tooLong = liveStats.charCount > CAPTION_MAX;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate({ to: "/result" }), 900);
  };

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6">
          <FlowStepper />
        </div>

        <SectionHeader
          eyebrow="New prediction"
          title="Compose & forecast"
          description="The model scores 6 inputs only: media_type, posting_hour, posting_day, caption_length, hashtag_count, has_cta."
        />

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* MAIN COLUMN */}
          <div className="space-y-6">
            <Panel title="Context" subtitle="Brand account and content format.">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Brand account</Label>
                  <select
                    value={account.handle}
                    onChange={(e) =>
                      setAccountIdx(ACCOUNTS.findIndex((a) => a.handle === e.target.value))
                    }
                    className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface/60 px-4 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
                  >
                    {ACCOUNTS.map((a) => (
                      <option key={a.handle}>{a.handle}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Schedule (posting_hour + posting_day)</Label>
                  <DateTimePicker
                    value={scheduledAt}
                    onChange={setScheduledAt}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label>Format (media_type)</Label>
                <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {FORMATS.map((f) => {
                    const active = contentFormat === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setContentFormat(f.id)}
                        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all active:scale-[0.98] ${
                          active
                            ? "border-primary bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] shadow-[var(--shadow-glow-purple)]"
                            : "border-border bg-surface/60 hover:border-border-strong"
                        }`}
                      >
                        <f.icon
                          className={`h-5 w-5 transition-colors ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div className="mt-3 text-sm font-medium">{f.label}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{f.hint}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Panel>

            {/* Caption */}
            <Panel
              title="Caption intelligence"
              subtitle="Live counters: caption_length, hashtag_count, has_cta. Updates debounced 500ms."
            >
              <div className="flex items-center justify-between">
                <Label>Caption</Label>
                <CaptionMeter count={liveStats.charCount} />
              </div>
              <div className="mt-1.5 rounded-xl border border-border bg-surface/60 transition-all focus-within:border-ring focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={9}
                  maxLength={CAPTION_MAX + 200}
                  className="w-full resize-none bg-transparent p-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
                  placeholder="Write your caption…"
                />
                <div className="border-t border-border px-4 py-3">
                  <CaptionSignals stats={stats} />
                </div>
              </div>

              <CaptionLimitWarning count={liveStats.charCount} />

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Metric
                  label="caption_length"
                  value={stats.charCount.toString()}
                  hint="characters"
                />
                <Metric
                  label="hashtag_count"
                  value={stats.hashtags.length.toString()}
                  hint={stats.hashtags.length === 0 ? "none detected" : `${stats.hashtags.length} tags`}
                />
                <Metric
                  label="has_cta"
                  value={stats.hasCTA ? "1" : "0"}
                  hint={stats.hasCTA ? `detected: ${stats.ctaTerms[0]}` : "no CTA verb found"}
                />
              </div>
            </Panel>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-6">
            <ModelMaturity samples={account.samples} />

            <Panel title="Posting window" subtitle="Maps to posting_hour + posting_day features.">
              <Label>Scheduled for</Label>
              <DateTimePicker value={scheduledAt} onChange={setScheduledAt} className="mt-1.5" />
              <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-primary">Niche baseline:</span> audience peak{" "}
                <span className="font-mono text-foreground">20:15</span> on {day}s. Your slot{" "}
                <span className="font-mono text-foreground">{timeLabel}</span>.
              </div>
            </Panel>

            <Panel
              title="Submit prediction"
              subtitle={
                maturityState === "personal"
                  ? "Personal Model active for this account."
                  : "Niche-fallback model will handle this prediction."
              }
            >
              <motion.button
                type="submit"
                disabled={submitting || tooLong}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--shadow-glow-purple)] disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                    </span>
                    Calling /predict endpoint…
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run prediction
                  </>
                )}
              </motion.button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Hierarchical RF: chooses Personal Model if samples ≥ 200, else Niche fallback.
              </p>
            </Panel>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}
