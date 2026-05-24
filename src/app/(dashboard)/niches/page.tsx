"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { BRANDS, NICHES, type Brand } from "@/lib/mock-data";
import {
  MoreHorizontal,
  Sparkles,
  Cpu,
  AlertTriangle,
  X,
  Wand2,
  Loader2,
} from "lucide-react";

export default function NichesPage() {
  const [showAddBrand, setShowAddBrand] = useState(false);

  return (
    <div className="px-5 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Niche management"
        title="Brands & niches"
        description="Each brand belongs to a niche. New brands start on the niche model and graduate to a personal one as they collect more samples."
        actions={
          <button
            onClick={() => setShowAddBrand(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Add brand
          </button>
        }
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BRANDS.map((b, i) => (
          <BrandCard key={b.id} brand={b} index={i} />
        ))}
      </section>

      {showAddBrand && <AddBrandDialog onClose={() => setShowAddBrand(false)} />}
    </div>
  );
}

function BrandCard({ brand: b, index: i }: { brand: Brand; index: number }) {
  const pct = Math.min(100, Math.round((b.samples / 200) * 100));
  const isPersonal = b.stage === "Personal";

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl transition-all hover:border-border-strong hover:-translate-y-0.5"
      style={{ animation: `slide-up 0.5s ${i * 60}ms both` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-secondary to-surface-3 font-display text-sm font-semibold">
            {b.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="font-display text-base font-semibold">{b.name}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{b.handle}</div>
          </div>
        </div>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground active:scale-95">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-1 w-1 rounded-full bg-primary" />
        {b.niche}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
              isPersonal
                ? "bg-[color-mix(in_oklab,hsl(var(--accent-lime))_18%,transparent)] text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)] ring-[color-mix(in_oklab,hsl(var(--accent-lime))_45%,transparent)]"
                : "bg-[color-mix(in_oklab,hsl(var(--primary))_12%,transparent)] text-primary ring-[color-mix(in_oklab,hsl(var(--primary))_35%,transparent)]"
            }`}
          >
            {isPersonal ? <Sparkles className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
            {isPersonal ? "Personal active" : "Niche fallback"}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-foreground">
            {b.samples}
            <span className="text-muted-foreground">/200</span>
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: isPersonal ? "var(--gradient-lime)" : "var(--gradient-primary)",
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Stat label="Accuracy" value={`${b.accuracy.toFixed(1)}%`} />
        <Stat label="Status" value={b.status === "active" ? "Active" : b.status === "paused" ? "Paused" : "Trial"} />
        <Stat label="Last run" value={b.lastRun} />
      </div>

      {b.drift && (
        <div
          role="alert"
          className="mt-4 inline-flex w-full items-center gap-2 rounded-lg bg-[color-mix(in_oklab,hsl(var(--destructive))_12%,transparent)] px-3 py-2 text-xs font-semibold text-destructive ring-1 ring-inset ring-[color-mix(in_oklab,hsl(var(--destructive))_35%,transparent)] animate-pulse"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Performance drop detected
        </div>
      )}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-semibold">{value}</div>
    </div>
  );
}

type Suggestion = { niche: string; match: number };

function AddBrandDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [classifying, setClassifying] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const classify = async () => {
    setClassifying(true);
    setSuggestions([]);
    await new Promise((r) => setTimeout(r, 1100));
    const seed = (description + audience).toLowerCase();
    const score = (n: string) => {
      let s = 0.4 + Math.random() * 0.3;
      if (seed.includes(n.split(" ")[0].toLowerCase())) s += 0.35;
      return Math.min(0.98, s);
    };
    const ranked = NICHES.map((n) => ({ niche: n, match: score(n) }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
    setSuggestions(ranked);
    setPicked(ranked[0]?.niche ?? null);
    setClassifying(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm animate-[fade-in_0.18s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[var(--shadow-elevated)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,hsl(var(--primary))_15%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              AI brand classifier
            </div>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">Add brand</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Describe the business and audience — we&apos;ll suggest the best matching niche.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground active:scale-95"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <DialogField label="Brand name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lasence Bakeshop"
              className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,hsl(var(--ring))_20%,transparent)]"
            />
          </DialogField>
          <DialogField label="Instagram handle">
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@lasence.bakeshop"
              className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3.5 font-mono text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,hsl(var(--ring))_20%,transparent)]"
            />
          </DialogField>
          <DialogField label="Business description" full>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Artisan sourdough bakery in Bandung with seasonal pastries…"
              className="w-full resize-none rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,hsl(var(--ring))_20%,transparent)]"
            />
          </DialogField>
          <DialogField label="Target audience" full>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              rows={2}
              placeholder="Urban professionals 25–40, weekend brunch crowd…"
              className="w-full resize-none rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,hsl(var(--ring))_20%,transparent)]"
            />
          </DialogField>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={classify}
              disabled={classifying || description.trim().length < 10}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {classifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Classifying…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Suggest niche with AI
                </>
              )}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="md:col-span-2">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Recommended niches
              </div>
              <div className="grid gap-2">
                {suggestions.map((s) => {
                  const active = picked === s.niche;
                  const pct = Math.round(s.match * 100);
                  return (
                    <button
                      key={s.niche}
                      type="button"
                      onClick={() => setPicked(s.niche)}
                      className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.99] ${
                        active
                          ? "border-primary bg-[color-mix(in_oklab,hsl(var(--primary))_8%,transparent)]"
                          : "border-border bg-surface hover:border-border-strong"
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-lg ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface-2 text-muted-foreground"
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{s.niche}</div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: "var(--gradient-primary)" }}
                          />
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                        {pct}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-2/40 p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name || !picked}
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            Create brand
          </button>
        </div>
      </div>
    </div>
  );
}

function DialogField({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
