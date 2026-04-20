import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { GitCompare, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/ab-test")({
  head: () => ({
    meta: [
      { title: "A/B Test — FAIV Predict" },
      { name: "description", content: "Compare two caption variants side-by-side with predicted performance." },
    ],
  }),
  component: ABTestPage,
});

const initialA =
  "Behind every drop is a 4am sketch. Save this if you've ever doubted a 2am idea. ✨";
const initialB =
  "We almost killed this collection. Here's the 4am sketch that saved it. Save for later — your future self will thank you. 🧵";

function ABTestPage() {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  const score = (text: string) => {
    let s = 50;
    if (/save|share|comment|tag|tap|swipe/i.test(text)) s += 12;
    if (/\?/.test(text)) s += 6;
    if (text.length > 60 && text.length < 400) s += 14;
    if ((text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length > 0) s += 4;
    if (/almost|never|secret|truth|behind/i.test(text)) s += 8;
    return Math.min(98, Math.max(20, s));
  };

  const scoreA = useMemo(() => score(a), [a]);
  const scoreB = useMemo(() => score(b), [b]);
  const winner = scoreA === scoreB ? null : scoreA > scoreB ? "A" : "B";
  const lift = Math.abs(scoreA - scoreB);

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="A/B test"
          title="Caption duel"
          description="Score two caption variants against each other under identical context."
          actions={
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted-foreground">
              <GitCompare className="h-3.5 w-3.5" />
              Same brand, format, time
            </div>
          }
        />

        {/* Verdict bar */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface-2 to-surface p-6">
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary-glow shadow-[var(--shadow-glow-cyan)]">
              <Trophy className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary">
                Predicted winner
              </div>
              <div className="mt-1 font-display text-3xl font-semibold tracking-tight">
                {winner ? (
                  <>
                    Variant {winner} wins by{" "}
                    <span className="text-gradient-primary">+{lift} pts</span>
                  </>
                ) : (
                  <>It's a tie</>
                )}
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-cyan)] transition hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" />
              Use winner
            </button>
          </div>
        </div>

        {/* Variants */}
        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <Variant
            label="A"
            value={a}
            onChange={setA}
            score={scoreA}
            isWinner={winner === "A"}
            color="var(--primary)"
          />
          <Variant
            label="B"
            value={b}
            onChange={setB}
            score={scoreB}
            isWinner={winner === "B"}
            color="var(--secondary-glow)"
          />
        </section>

        {/* Comparison details */}
        <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl">
          <h3 className="font-display text-lg font-semibold">Signal-by-signal</h3>
          <div className="mt-5 space-y-4">
            {[
              { l: "Hook strength", a: 92, b: 86 },
              { l: "Curiosity gap", a: 74, b: 91 },
              { l: "CTA clarity", a: 88, b: 82 },
              { l: "Emotional pull", a: 70, b: 84 },
              { l: "Length fit", a: 76, b: 70 },
            ].map((row) => (
              <div key={row.l} className="grid grid-cols-[100px_1fr_40px_1fr_40px] items-center gap-3 text-xs">
                <span className="text-muted-foreground">{row.l}</span>
                <div className="flex justify-end">
                  <div className="flex h-2 w-full items-center justify-end overflow-hidden rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.a}%`,
                        background: "var(--primary)",
                        boxShadow: "0 0 8px var(--primary)",
                      }}
                    />
                  </div>
                </div>
                <span className="text-center font-mono text-foreground">{row.a}</span>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.b}%`,
                      background: "var(--secondary-glow)",
                      boxShadow: "0 0 8px var(--secondary-glow)",
                    }}
                  />
                </div>
                <span className="font-mono text-foreground">{row.b}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Variant({
  label,
  value,
  onChange,
  score,
  isWinner,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  score: number;
  isWinner: boolean;
  color: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all ${
        isWinner
          ? "border-primary bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] shadow-[var(--shadow-glow-cyan)]"
          : "border-border bg-surface/60"
      }`}
    >
      {isWinner && (
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      )}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl font-display text-lg font-bold text-primary-foreground"
              style={{ background: color, boxShadow: `0 0 16px ${color}` }}
            >
              {label}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Variant {label}
              </div>
              <div className="font-display text-sm">
                {isWinner ? "Predicted winner" : "Challenger"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-semibold tracking-tight">
              {score}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              score
            </div>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="mt-5 w-full resize-none rounded-xl border border-border bg-surface/60 p-4 text-sm leading-relaxed outline-none transition focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{value.length} chars</span>
          <TierBadge tier={score > 85 ? "Viral" : score > 70 ? "Strong" : "Average"} />
        </div>
      </div>
    </div>
  );
}
