import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { FlowStepper } from "@/components/FlowStepper";
import { SUGGESTIONS } from "@/lib/mock-data";
import { Sparkles, ArrowRight, AlertTriangle, ServerCrash, Wand2 } from "lucide-react";

export const Route = createFileRoute("/suggest")({
  head: () => ({
    meta: [
      { title: "Recommendations — FAIV Predict" },
      { name: "description", content: "Hybrid recommendations: instant local TRE templates, optionally enriched by AI (Gemini)." },
    ],
  }),
  component: SuggestPage,
});

type AiState = "idle" | "loading" | "enriched" | "fallback";

function SuggestPage() {
  const [aiState, setAiState] = useState<AiState>("idle");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const enrichWithAI = async () => {
    setAiState("loading");
    // Simulated Gemini call — randomly succeed or fall back to TRE.
    await new Promise((r) => setTimeout(r, 1100));
    const ok = Math.random() > 0.25;
    if (ok) {
      setAiSuggestions([
        "Open the caption with a one-line outcome statement followed by the back-story.",
        "Pair the save-CTA with a question to widen comment-driven reach.",
        "Cluster hashtags by intent: 3 niche + 2 community + 1 branded.",
      ]);
      setAiState("enriched");
    } else {
      setAiState("fallback");
    }
  };

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <div className="mb-6">
          <FlowStepper />
        </div>
        <SectionHeader
          eyebrow="Recommendations"
          title="TRE templates · optionally enriched by AI"
          description="Default suggestions come instantly from the local Template Recommendation Engine. Enrich with AI to layer Gemini-generated context (auto-falls back to TRE on error)."
          actions={
            <button
              type="button"
              onClick={enrichWithAI}
              disabled={aiState === "loading"}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {aiState === "loading" ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Memanggil Gemini…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Perkaya dengan AI
                </>
              )}
            </button>
          }
        />

        {/* TRE local suggestions — always visible, instant */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-lime)_18%,transparent)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)]">
                Default · TRE
              </span>
              Instant local recommendations from niche baselines.
            </div>
            <Link to="/predict" className="text-xs font-medium text-primary hover:underline">
              Edit & re-predict →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SUGGESTIONS.map((s, i) => (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl transition-all hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.feature}
                    </span>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.detail}
                </p>
                <div className="mt-4 rounded-lg border border-border bg-surface-2 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Why
                  </div>
                  <div className="mt-1 text-xs text-foreground">{s.rationale}</div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Update inputs in the <Link to="/predict" className="text-primary hover:underline">Predict</Link> form
                  and re-submit to see a new <span className="font-mono">predicted_class</span>.
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* AI enrichment block */}
        <section className="mt-8">
          <AnimatePresence mode="wait">
            {aiState === "enriched" && (
              <motion.div
                key="enriched"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-primary/40 bg-[color-mix(in_oklab,var(--primary)_6%,var(--surface))] p-6"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                    AI · Gemini
                  </span>
                  <span className="text-muted-foreground">Enriched suggestions layered on top of TRE.</span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {aiSuggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {aiState === "fallback" && (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                role="alert"
                className="rounded-2xl border border-[color-mix(in_oklab,var(--warning)_40%,transparent)] bg-[color-mix(in_oklab,var(--warning)_8%,var(--surface))] p-5"
              >
                <div className="flex items-start gap-3">
                  <ServerCrash className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.55_0.16_75)] dark:text-[oklch(0.85_0.16_75)]" />
                  <div>
                    <div className="text-sm font-semibold">AI service unavailable — falling back to TRE</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Gemini API timed out or returned an error. The local Template Recommendation Engine
                      above remains fully functional. You can retry enrichment shortly.
                    </p>
                    <button
                      onClick={enrichWithAI}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2 active:scale-95"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Retry AI enrichment
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </AppShell>
  );
}
