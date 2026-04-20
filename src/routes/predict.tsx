import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  Target as TargetIcon,
  Image as ImageIcon,
  Film,
  LayoutGrid,
} from "lucide-react";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "New Prediction — FAIV Predict" },
      { name: "description", content: "Score a single post: caption, format, posting time, and content fit." },
    ],
  }),
  component: PredictPage,
});

const FORMATS = [
  { id: "reels", label: "Reels", icon: Film, hint: "Vertical video" },
  { id: "carousel", label: "Carousel", icon: LayoutGrid, hint: "Multi-image" },
  { id: "image", label: "Single Image", icon: ImageIcon, hint: "Static post" },
  { id: "story", label: "Story", icon: Sparkles, hint: "24h ephemeral" },
] as const;

const ACCOUNTS: { handle: string; samples: number }[] = [
  { handle: "@nova.studio", samples: 247 },
  { handle: "@kindred.brand", samples: 124 },
  { handle: "@orbit.media", samples: 38 },
  { handle: "@solene.atelier", samples: 192 },
];

function PredictPage() {
  const navigate = useNavigate();
  const [accountIdx, setAccountIdx] = useState(0);
  const account = ACCOUNTS[accountIdx];
  const maturityState = getMaturityState(account.samples);
  const [format_, setFormat] = useState<string>("reels");

  const [scheduledAt, setScheduledAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(19, 30, 0, 0);
    return d;
  });
  const day = format(scheduledAt, "EEE");
  const timeLabel = format(scheduledAt, "HH:mm");

  const [caption, setCaption] = useState(
    "Behind every drop is a 4am sketch. Here's the unfiltered story of how we built our spring capsule — from late nights to first ship. Save this if you've ever doubted a 2am idea. ✨\n\nWhat's the one project that almost didn't make it?",
  );
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => analyzeCaption(caption), [caption]);
  const tooLong = stats.charCount > CAPTION_MAX;
  const tooShort = stats.charCount < 40;

  const score = useMemo(() => {
    let s = 50;
    if (stats.charCount >= 80 && stats.charCount <= 1200) s += 12;
    if (stats.hasCTA) s += 10;
    if (stats.hasQuestion) s += 6;
    if (stats.hashtags.length >= 3 && stats.hashtags.length <= 8) s += 8;
    if (stats.emojiCount >= 1 && stats.emojiCount <= 4) s += 4;
    if (tooLong || tooShort) s -= 15;
    // Cold start drag — less personal data → less confidence in upper range
    if (maturityState === "low") s -= 6;
    if (maturityState === "learning") s -= 2;
    return Math.max(20, Math.min(98, s));
  }, [stats, tooLong, tooShort, maturityState]);

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
          description="We'll score this post across audience fit, hook strength, posting window, and historical patterns."
        />

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* MAIN COLUMN */}
          <div className="space-y-6">
            {/* Account + format */}
            <Panel title="Context" subtitle="Who is posting and what shape is the content?">
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
                  <Label>Schedule</Label>
                  <DateTimePicker
                    value={scheduledAt}
                    onChange={setScheduledAt}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-5">
                <Label>Format</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {FORMATS.map((f) => {
                    const active = format_ === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
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
              subtitle="Live analysis of hook, length, CTAs and hashtags."
            >
              <div className="flex items-center justify-between">
                <Label>Caption</Label>
                <CaptionMeter count={stats.charCount} />
              </div>
              <div className="mt-1.5 rounded-xl border border-border bg-surface/60 transition-all focus-within:border-ring focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={9}
                  maxLength={CAPTION_MAX + 200} /* allow over-typing to surface warning */
                  className="w-full resize-none bg-transparent p-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
                  placeholder="Write your caption…"
                />
                <div className="border-t border-border px-4 py-3">
                  <CaptionSignals stats={stats} />
                </div>
              </div>

              <CaptionLimitWarning count={stats.charCount} />

              {/* Hook preview + hashtag chips */}
              <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr]">
                <div className="rounded-xl border border-border-strong bg-gradient-to-br from-surface-2 to-surface p-4">
                  <div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
                    First-3-second hook
                  </div>
                  <div className="font-display text-base font-semibold leading-snug">
                    "{stats.hookWords || "Add a strong opening line…"}…"
                  </div>
                  {tooShort && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[oklch(0.50_0.16_75)] dark:text-[oklch(0.85_0.16_75)]">
                      <TargetIcon className="h-3 w-3" />
                      Caption is short — add context to anchor the hook.
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-surface/40 p-4">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Hashtags · {stats.hashtags.length}
                  </div>
                  {stats.hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {stats.hashtags.map((h) => (
                        <span
                          key={h}
                          className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-primary"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Add 3–8 niche hashtags to improve discovery.
                    </p>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-6">
            {/* Cold-start awareness */}
            <ModelMaturity samples={account.samples} />

            <Panel title="Posting window" subtitle="When this goes live.">
              <Label>Scheduled for</Label>
              <DateTimePicker
                value={scheduledAt}
                onChange={setScheduledAt}
                className="mt-1.5"
              />
              <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-primary">Tip:</span> Audience for {account.handle}{" "}
                peaks <span className="font-mono text-foreground">20:15</span> on {day}s.
                Window <span className="font-mono text-foreground">{timeLabel}</span> sits in the second-best slot.
              </div>
            </Panel>

            <Panel
              title="Live signal"
              subtitle="Pre-flight estimate — final score after model run."
            >
              <div className="relative overflow-hidden rounded-xl border border-border-strong bg-gradient-to-br from-surface-2 to-surface p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Pre-flight score
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <motion.div
                    key={score}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="font-display text-5xl font-semibold tracking-tight text-gradient-primary"
                  >
                    {score}
                  </motion.div>
                  <div className="pb-2 text-sm text-muted-foreground">/100</div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3">
                  <motion.div
                    className="h-full rounded-full"
                    initial={false}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow-purple)",
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <Stat label="Hook" v={Math.min(99, score + 4)} />
                  <Stat label="Format" v={Math.max(20, score - 6)} />
                  <Stat label="Timing" v={Math.min(95, score + 1)} />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || tooLong}
                className="mt-4 group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--shadow-glow-purple)] disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
                    </span>
                    Running hierarchical Random Forest…
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run prediction
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Niche → Account → Personal stages run in sequence
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
      <div className="mb-5 flex items-baseline justify-between">
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

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-1.5 py-2">
      <div className="font-mono text-sm font-semibold text-foreground">{v}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
