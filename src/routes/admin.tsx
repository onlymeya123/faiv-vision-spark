import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { BRANDS, MODELS, NICHES, type Brand, type MlModel } from "@/lib/mock-data";
import {
  Plus,
  MoreHorizontal,
  Building2,
  Cpu,
  CheckCircle2,
  PauseCircle,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  X,
  Wand2,
  Loader2,
  TrendingDown,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — FAIV Predict" },
      { name: "description", content: "Brand registry with N/200 hierarchy indicator and Model Health dashboard with concept drift alerts." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"brands" | "models">("brands");
  const [showAddBrand, setShowAddBrand] = useState(false);

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Admin"
          title="Workspace control"
          description="Manage brand accounts (with hierarchy stage) and the Model Health dashboard."
          actions={
            tab === "brands" ? (
              <button
                onClick={() => setShowAddBrand(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-purple)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Tambah Brand (AI Classifier)
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-surface-2 active:scale-[0.98]"
              >
                <RefreshCw className="h-4 w-4" />
                Trigger Retrain Manual
              </button>
            )
          }
        />

        {/* Tabs */}
        <div className="mt-8 inline-flex gap-1 rounded-xl border border-border bg-surface/60 p-1 backdrop-blur">
          {[
            { id: "brands" as const, label: "Brands", icon: Building2, count: BRANDS.length },
            { id: "models" as const, label: "Model Health", icon: Cpu, count: MODELS.length },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-purple)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-surface-3 text-muted-foreground"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {tab === "brands" ? <BrandsGrid /> : <ModelHealth />}

        {showAddBrand && <AddBrandDialog onClose={() => setShowAddBrand(false)} />}
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Brands grid — N/200 indicator + drift badge
// ---------------------------------------------------------------------------
function BrandsGrid() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {BRANDS.map((b, i) => (
        <BrandCard key={b.id} brand={b} index={i} />
      ))}
    </section>
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

      {/* Niche pill */}
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-1 w-1 rounded-full bg-primary" />
        {b.niche}
      </div>

      {/* Hierarchy stage + N/200 */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
              isPersonal
                ? "bg-[color-mix(in_oklab,var(--accent-lime)_18%,transparent)] text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)] ring-[color-mix(in_oklab,var(--accent-lime)_45%,transparent)]"
                : "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary ring-[color-mix(in_oklab,var(--primary)_35%,transparent)]"
            }`}
          >
            {isPersonal ? <Sparkles className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
            {isPersonal ? "Personal Aktif" : "Niche Fallback"}
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
          className="mt-4 inline-flex w-full items-center gap-2 rounded-lg bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] px-3 py-2 text-xs font-semibold text-destructive ring-1 ring-inset ring-[color-mix(in_oklab,var(--destructive)_35%,transparent)] animate-pulse"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Concept Drift Alert · accuracy down &gt;15 pts
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

// ---------------------------------------------------------------------------
// Model Health dashboard — rolling accuracy table + drift alerts + retrain
// ---------------------------------------------------------------------------
function ModelHealth() {
  return (
    <section className="mt-6 space-y-5">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Active Models"
          value={MODELS.filter((m) => m.is_active).length.toString()}
          tone="primary"
        />
        <SummaryCard
          label="Avg. Rolling Accuracy"
          value={`${(
            MODELS.reduce((s, m) => s + m.rollingAccuracy, 0) / MODELS.length
          ).toFixed(1)}%`}
          tone="lime"
        />
        <SummaryCard
          label="Concept Drift Alerts"
          value={MODELS.filter((m) => m.baselineAccuracy - m.rollingAccuracy > 15).length.toString()}
          tone="destructive"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-6 py-4 font-medium">Model</th>
                <th className="px-6 py-4 font-medium">Niche</th>
                <th className="px-6 py-4 font-medium">Version</th>
                <th className="px-6 py-4 font-medium">Baseline</th>
                <th className="px-6 py-4 font-medium">30d Rolling</th>
                <th className="px-6 py-4 font-medium">Trend</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m, i) => (
                <ModelRow key={m.id} m={m} i={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ModelRow({ m, i }: { m: MlModel; i: number }) {
  const drop = m.baselineAccuracy - m.rollingAccuracy;
  const drift = drop > 15;
  const isPersonal = m.scope === "Personal";

  return (
    <tr
      className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
      style={{ animation: `slide-up 0.4s ${i * 60}ms both` }}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg border border-border-strong"
            style={{
              background: isPersonal
                ? "color-mix(in oklab, var(--accent-lime) 14%, transparent)"
                : "color-mix(in oklab, var(--primary) 14%, transparent)",
            }}
          >
            {isPersonal ? (
              <Sparkles className="h-4 w-4 text-[oklch(0.40_0.18_130)] dark:text-[oklch(0.85_0.20_130)]" />
            ) : (
              <Cpu className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="font-mono text-sm font-medium">{m.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">{m.niche}</td>
      <td className="px-6 py-4">
        <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px]">
          {m.version}
        </span>
      </td>
      <td className="px-6 py-4 font-mono text-xs">{m.baselineAccuracy.toFixed(1)}%</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{
                width: `${m.rollingAccuracy}%`,
                background: drift ? "var(--destructive)" : "var(--gradient-primary)",
                boxShadow: drift
                  ? "0 0 8px var(--destructive)"
                  : "0 0 8px var(--primary)",
              }}
            />
          </div>
          <span className={`font-mono text-xs ${drift ? "text-destructive font-semibold" : ""}`}>
            {m.rollingAccuracy.toFixed(1)}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Sparkline values={m.rolling30d} drift={drift} />
      </td>
      <td className="px-6 py-4">
        {drift ? (
          <span
            role="alert"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive ring-1 ring-inset ring-[color-mix(in_oklab,var(--destructive)_45%,transparent)] animate-pulse"
          >
            <TrendingDown className="h-3 w-3" />
            Drift −{drop.toFixed(1)}pt
          </span>
        ) : m.is_active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--success)_15%,transparent)] px-2 py-1 text-[11px] font-medium text-[oklch(0.85_0.18_155)]">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-1 text-[11px] font-medium text-muted-foreground">
            <PauseCircle className="h-3 w-3" /> Inactive
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {drift ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-[11px] font-semibold text-destructive-foreground transition-all hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw className="h-3 w-3" />
            Trigger Retrain
          </button>
        ) : (
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
          >
            Manage
          </button>
        )}
      </td>
    </tr>
  );
}

function Sparkline({ values, drift }: { values: number[]; drift: boolean }) {
  const w = 80;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = drift ? "var(--destructive)" : "var(--primary)";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
    </svg>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "lime" | "destructive";
}) {
  const bg =
    tone === "primary"
      ? "color-mix(in oklab, var(--primary) 8%, var(--surface))"
      : tone === "lime"
      ? "color-mix(in oklab, var(--accent-lime) 8%, var(--surface))"
      : "color-mix(in oklab, var(--destructive) 8%, var(--surface))";
  const dot =
    tone === "primary"
      ? "var(--primary)"
      : tone === "lime"
      ? "var(--accent-lime)"
      : "var(--destructive)";
  return (
    <div
      className="rounded-2xl border border-border p-5"
      style={{ background: bg }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dot, boxShadow: `0 0 8px ${dot}` }}
        />
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add Brand dialog with AI Brand Classifier (Gemini placeholder)
// ---------------------------------------------------------------------------
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
    // Placeholder Gemini call — fake but deterministic-ish based on text length.
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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              AI Brand Classifier
            </div>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
              Tambah Brand
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Describe the business and audience — Gemini suggests a matching niche so the system can pick
              the right fallback model.
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
          <Field label="Brand name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lasence Bakeshop"
              className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
            />
          </Field>
          <Field label="Instagram handle">
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@lasence.bakeshop"
              className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3.5 font-mono text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
            />
          </Field>
          <Field label="Business description" full>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Artisan sourdough bakery in Bandung with seasonal pastries…"
              className="w-full resize-none rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
            />
          </Field>
          <Field label="Target audience" full>
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              rows={2}
              placeholder="Urban professionals 25–40, weekend brunch crowd, café enthusiasts…"
              className="w-full resize-none rounded-xl border border-border bg-surface/60 p-3.5 text-sm outline-none transition-all focus:border-ring focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]"
            />
          </Field>

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
                  Classifying with Gemini…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Classify niche with AI
                </>
              )}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="md:col-span-2">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                AI niche recommendations
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
                          ? "border-primary bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
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
                            style={{
                              width: `${pct}%`,
                              background: "var(--gradient-primary)",
                            }}
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

function Field({
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
