import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { DateTimePicker } from "@/components/DateTimePicker";
import { format } from "date-fns";
import {
  Sparkles,
  Hash,
  Target as TargetIcon,
  Image as ImageIcon,
  Film,
  LayoutGrid,
  AlertCircle,
  CheckCircle2,
  Loader2,
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

const ACCOUNTS = ["@nova.studio", "@kindred.brand", "@orbit.media", "@solene.atelier"];
const MAX_CHARS = 2200;

function PredictPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [format_, setFormat] = useState<string>("reels");

  // Single timestamp drives both date and time — Apple-like, no manual input
  const [scheduledAt, setScheduledAt] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(19, 30, 0, 0);
    return d;
  });
  const day = format(scheduledAt, "EEE");
  const timeLabel = format(scheduledAt, "HH:mm");

  const [caption, setCaption] = useState(
    "Behind every drop is a 4am sketch. Here's the unfiltered story of how we built our spring capsule — from late nights to first ship. Save this if you've ever doubted a 2am idea. ✨\n\nWhat's the one project that almost didn't make it?"
  );
  const [submitting, setSubmitting] = useState(false);

  const intel = useMemo(() => {
    const text = caption;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const hashtags = (text.match(/#[\w]+/g) || []);
    const mentions = (text.match(/@[\w.]+/g) || []);
    const ctaPatterns = /\b(save|share|follow|tag|comment|click|link|swipe|tap|drop|grab|join|sign|book|shop|read more|learn more|discover|don'?t miss|what'?s|tell me|let me know)\b/i;
    const hasCTA = ctaPatterns.test(text);
    const hasQuestion = /\?/.test(text);
    const emojiCount = (text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length;
    const charCount = text.length;
    const tooLong = charCount > MAX_CHARS;
    const tooShort = charCount < 40;
    const hookWords = words.slice(0, 8).join(" ");

    let score = 50;
    if (charCount >= 80 && charCount <= 1200) score += 12;
    if (hasCTA) score += 10;
    if (hasQuestion) score += 6;
    if (hashtags.length >= 3 && hashtags.length <= 8) score += 8;
    if (emojiCount >= 1 && emojiCount <= 4) score += 4;
    if (tooLong || tooShort) score -= 15;
    score = Math.max(20, Math.min(98, score));

    return {
      charCount,
      wordCount: words.length,
      hashtags,
      mentions,
      hasCTA,
      hasQuestion,
      emojiCount,
      tooLong,
      tooShort,
      hookWords,
      score,
    };
  }, [caption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate({ to: "/result" }), 1100);
  };

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="New prediction"
          title="Compose & forecast"
          description="We'll score this post across audience fit, hook strength, posting window, and historical patterns."
        />

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* MAIN COLUMN */}
          <div className="space-y-6">
            {/* Account + format */}
            <Panel title="Context" subtitle="Who is posting and what shape is the content?">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Brand account</Label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface/60 px-4 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
                  >
                    {ACCOUNTS.map((a) => (
                      <option key={a}>{a}</option>
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
                            ? "border-primary bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] shadow-[var(--shadow-glow-cyan)]"
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
              <Label>Caption</Label>
              <div className="mt-1.5 rounded-xl border border-border bg-surface/60 transition-all focus-within:border-ring focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={9}
                  className="w-full resize-none bg-transparent p-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground/60"
                  placeholder="Write your caption…"
                />
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-mono">
                      {intel.wordCount} words · {intel.hashtags.length} #
                    </span>
                    {intel.hasCTA && (
                      <span className="inline-flex items-center gap-1 text-[oklch(0.85_0.18_155)]">
                        <CheckCircle2 className="h-3 w-3" /> CTA detected
                      </span>
                    )}
                    {intel.hasQuestion && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Question
                      </span>
                    )}
                  </div>
                  <div
                    className={`font-mono font-medium ${
                      intel.tooLong
                        ? "text-destructive"
                        : intel.charCount > MAX_CHARS * 0.85
                        ? "text-[oklch(0.82_0.16_75)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {intel.charCount}/{MAX_CHARS}
                  </div>
                </div>
              </div>

              {/* Validation chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {intel.tooShort && (
                  <Chip tone="warning" icon={<AlertCircle className="h-3 w-3" />}>
                    Caption is short — consider adding context
                  </Chip>
                )}
                {intel.tooLong && (
                  <Chip tone="danger" icon={<AlertCircle className="h-3 w-3" />}>
                    Exceeds Instagram's 2,200 character limit
                  </Chip>
                )}
                {!intel.hasCTA && !intel.tooShort && (
                  <Chip tone="info" icon={<TargetIcon className="h-3 w-3" />}>
                    No CTA detected — try inviting a save or comment
                  </Chip>
                )}
                {intel.hashtags.length === 0 && (
                  <Chip tone="info" icon={<Hash className="h-3 w-3" />}>
                    Add 3–8 niche hashtags to improve discovery
                  </Chip>
                )}
                {intel.hashtags.length > 10 && (
                  <Chip tone="warning" icon={<Hash className="h-3 w-3" />}>
                    Too many hashtags — risks looking spammy
                  </Chip>
                )}
                {intel.emojiCount === 0 && (
                  <Chip tone="info">No emoji — adds warmth in this brand voice</Chip>
                )}
              </div>

              {/* Hook preview */}
              <div className="mt-5 rounded-xl border border-border-strong bg-gradient-to-br from-surface-2 to-surface p-4">
                <div className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-primary">
                  First-3-second hook
                </div>
                <div className="font-display text-lg font-semibold leading-snug">
                  "{intel.hookWords}…"
                </div>
              </div>

              {/* Hashtag chips */}
              {intel.hashtags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {intel.hashtags.map((h) => (
                    <span
                      key={h}
                      className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-[11px] text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-6">
            <Panel title="Posting window" subtitle="When does this go live?">
              <Label>Time (local)</Label>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="mt-3 rounded-lg border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-primary">Tip:</span> Audience for {account}{" "}
                peaks <span className="font-mono text-foreground">20:15</span> on {day}s.
                Window {time} sits in the second-best slot.
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
                  <div className="font-display text-5xl font-semibold tracking-tight text-gradient-primary">
                    {intel.score}
                  </div>
                  <div className="pb-2 text-sm text-muted-foreground">/100</div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${intel.score}%`,
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow-cyan)",
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <Stat label="Hook" v={Math.min(99, intel.score + 4)} />
                  <Stat label="Format" v={Math.max(20, intel.score - 6)} />
                  <Stat label="Timing" v={Math.min(95, intel.score + 1)} />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || intel.tooLong}
                className="mt-4 group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[var(--shadow-glow-cyan)] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running 6 models…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run prediction
                  </>
                )}
              </button>
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

function Chip({
  children,
  icon,
  tone = "info",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "info" | "warning" | "danger";
}) {
  const styles = {
    info: "border-border bg-surface-2 text-muted-foreground",
    warning:
      "border-[color-mix(in_oklab,var(--warning)_30%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] text-[oklch(0.85_0.16_75)]",
    danger:
      "border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-[oklch(0.80_0.22_22)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${styles[tone]}`}
    >
      {icon}
      {children}
    </span>
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
