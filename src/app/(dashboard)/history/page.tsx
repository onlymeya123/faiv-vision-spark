"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { TierBadge } from "@/components/TierBadge";
import { BRANDS, type Tier, type ContentFormat } from "@/lib/mock-data";
import { Search, ArrowUpRight, Filter } from "lucide-react";

type HistoryItem = {
  id: string;
  brand: string;
  account: string;
  format: ContentFormat;
  caption: string;
  tier: Tier;
  confidence: number;
  when: string;
};

const HISTORY: HistoryItem[] = [
  { id: "p_8821", brand: "Nova Studio", account: "@nova.studio", format: "Reels", caption: "Behind the scenes — week 17 shoot day", tier: "High", confidence: 94, when: "2 min ago" },
  { id: "p_8820", brand: "Kindred", account: "@kindred.brand", format: "Carousel", caption: "New drop · linen series 02 now live", tier: "High", confidence: 88, when: "6 min ago" },
  { id: "p_8819", brand: "Orbit Media", account: "@orbit.media", format: "Single Image", caption: "Editor's picks for the long weekend", tier: "Average", confidence: 71, when: "11 min ago" },
  { id: "p_8818", brand: "Solène Atelier", account: "@solene.atelier", format: "Reels", caption: "Atelier walkthrough · the cutting room", tier: "Low", confidence: 64, when: "18 min ago" },
  { id: "p_8817", brand: "Lasence Bakeshop", account: "@lasence.bakeshop", format: "Carousel", caption: "Spring menu lineup, 6 new pastries", tier: "Average", confidence: 82, when: "24 min ago" },
  { id: "p_8816", brand: "Bison Gym", account: "@bison.gym", format: "Reels", caption: "Morning mobility flow, 6 minutes flat", tier: "Average", confidence: 76, when: "1 hour ago" },
  { id: "p_8815", brand: "Nova Studio", account: "@nova.studio", format: "Single Image", caption: "Soft launch poster, comment what you see", tier: "High", confidence: 90, when: "2 hours ago" },
  { id: "p_8814", brand: "Kindred", account: "@kindred.brand", format: "Reels", caption: "Day-in-the-life — store opening", tier: "Low", confidence: 58, when: "3 hours ago" },
  { id: "p_8813", brand: "Lasence Bakeshop", account: "@lasence.bakeshop", format: "Reels", caption: "Croissant lamination, slow motion", tier: "High", confidence: 92, when: "Yesterday" },
  { id: "p_8812", brand: "Solène Atelier", account: "@solene.atelier", format: "Carousel", caption: "Lookbook spring 25 — sneak peek", tier: "Average", confidence: 79, when: "Yesterday" },
  { id: "p_8811", brand: "Orbit Media", account: "@orbit.media", format: "Reels", caption: "Studio tour with the new hires", tier: "Low", confidence: 62, when: "2 days ago" },
  { id: "p_8810", brand: "Bison Gym", account: "@bison.gym", format: "Single Image", caption: "Membership promo — May only", tier: "Average", confidence: 73, when: "2 days ago" },
];

export default function HistoryPage() {
  const [tier, setTier] = useState<"All" | Tier>("All");
  const [brand, setBrand] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      HISTORY.filter(
        (h) =>
          (tier === "All" || h.tier === tier) &&
          (brand === "All" || h.brand === brand) &&
          (q === "" ||
            h.account.toLowerCase().includes(q.toLowerCase()) ||
            h.caption.toLowerCase().includes(q.toLowerCase())),
      ),
    [tier, brand, q],
  );

  return (
    <div className="px-5 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow="Audit log"
        title="Prediction History"
        description="Every classification this workspace has produced. Filter by brand or tier to spot patterns."
      />

      {/* Filters */}
      <section className="mt-8 grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2.5 backdrop-blur focus-within:border-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by account or caption…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
        </div>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="h-11 rounded-xl border border-border bg-surface/60 px-3 text-sm outline-none focus:border-ring"
        >
          <option value="All">All brands</option>
          {BRANDS.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface/60 p-1">
          {(["All", "High", "Average", "Low"] as const).map((t) => {
            const active = tier === t;
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-purple)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* Table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-semibold">
              {filtered.length} prediction{filtered.length === 1 ? "" : "s"}
            </h3>
          </div>
          <Link href="/predict" className="text-xs font-medium text-primary hover:underline">
            + New prediction
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-5 py-4 font-medium">Account</th>
                <th className="px-5 py-4 font-medium">Brand</th>
                <th className="px-5 py-4 font-medium">Format</th>
                <th className="px-5 py-4 font-medium">Caption preview</th>
                <th className="px-5 py-4 font-medium">Confidence</th>
                <th className="px-5 py-4 font-medium">Tier</th>
                <th className="px-5 py-4 font-medium">When</th>
                <th className="px-5 py-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr
                  key={h.id}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-2/60"
                  style={{ animation: `slide-up 0.35s ${i * 30}ms both` }}
                >
                  <td className="px-5 py-3.5 font-medium">{h.account}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{h.brand}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md border border-border bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {h.format}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-[300px] truncate text-xs text-muted-foreground">
                    {h.caption}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs">{h.confidence}%</td>
                  <td className="px-5 py-3.5">
                    <TierBadge tier={h.tier} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{h.when}</td>
                  <td className="px-5 py-3.5">
                    <Link
                      href="/result"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No predictions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
