import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { BRANDS, MODELS } from "@/lib/mock-data";
import { Plus, MoreHorizontal, Building2, Cpu, CheckCircle2, AlertCircle, Archive } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — FAIV Predict" },
      { name: "description", content: "Brand management and model registry." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"brands" | "models">("brands");

  return (
    <AppShell>
      <div className="px-5 py-8 md:px-10 md:py-10">
        <SectionHeader
          eyebrow="Admin"
          title="Workspace control"
          description="Manage brand accounts and the model registry."
          actions={
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow-cyan)] transition hover:scale-[1.02]">
              <Plus className="h-4 w-4" />
              {tab === "brands" ? "Add brand" : "Deploy model"}
            </button>
          }
        />

        {/* Tabs */}
        <div className="mt-8 inline-flex gap-1 rounded-xl border border-border bg-surface/60 p-1 backdrop-blur">
          {[
            { id: "brands" as const, label: "Brands", icon: Building2, count: BRANDS.length },
            { id: "models" as const, label: "Model registry", icon: Cpu, count: MODELS.length },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-cyan)]"
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

        {tab === "brands" ? (
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {BRANDS.map((b, i) => (
              <article
                key={b.id}
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
                      <div className="font-mono text-[11px] text-muted-foreground">
                        {b.handle}
                      </div>
                    </div>
                  </div>
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <StatusPill status={b.status} />
                  <div
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      b.tier === "Enterprise"
                        ? "border-primary/40 bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-primary"
                        : b.tier === "Growth"
                        ? "border-[color-mix(in_oklab,var(--secondary-glow)_40%,transparent)] bg-[color-mix(in_oklab,var(--secondary-glow)_15%,transparent)] text-[oklch(0.85_0.20_295)]"
                        : "border-border bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {b.tier}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <Stat label="Posts" value={b.posts.toString()} />
                  <Stat label="Last run" value="2h ago" />
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-border bg-surface/60 backdrop-blur-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Model</th>
                  <th className="px-6 py-4 font-medium">Version</th>
                  <th className="px-6 py-4 font-medium">Accuracy</th>
                  <th className="px-6 py-4 font-medium">Last trained</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m, i) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                    style={{ animation: `slide-up 0.4s ${i * 60}ms both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="grid h-9 w-9 place-items-center rounded-lg border border-border-strong"
                          style={{
                            background:
                              m.status === "production"
                                ? "color-mix(in oklab, var(--primary) 14%, transparent)"
                                : m.status === "canary"
                                ? "color-mix(in oklab, var(--warning) 14%, transparent)"
                                : "var(--surface-2)",
                          }}
                        >
                          <Cpu
                            className={`h-4 w-4 ${
                              m.status === "production"
                                ? "text-primary"
                                : m.status === "canary"
                                ? "text-[oklch(0.85_0.16_75)]"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span className="font-mono text-sm font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px]">
                        {m.version}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${m.accuracy}%`,
                              background: "var(--gradient-primary)",
                              boxShadow: "0 0 8px var(--primary)",
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs">{m.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{m.trained}</td>
                    <td className="px-6 py-4">
                      <ModelStatus status={m.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-medium text-primary hover:underline">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { c: string; t: string }> = {
    active: { c: "var(--success)", t: "Active" },
    paused: { c: "oklch(0.7 0.02 255)", t: "Paused" },
    trial: { c: "var(--warning)", t: "Trial" },
  };
  const m = map[status] || map.active;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px]">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: m.c, boxShadow: `0 0 8px ${m.c}` }}
      />
      <span className="text-muted-foreground">{m.t}</span>
    </span>
  );
}

function ModelStatus({ status }: { status: string }) {
  if (status === "production")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--success)_15%,transparent)] px-2 py-1 text-[11px] font-medium text-[oklch(0.85_0.18_155)]">
        <CheckCircle2 className="h-3 w-3" /> Production
      </span>
    );
  if (status === "canary")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] px-2 py-1 text-[11px] font-medium text-[oklch(0.85_0.16_75)]">
        <AlertCircle className="h-3 w-3" /> Canary
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-1 text-[11px] font-medium text-muted-foreground">
      <Archive className="h-3 w-3" /> Archived
    </span>
  );
}
