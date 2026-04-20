// Centralized dummy data for the FAIV Predict UI.
// All numbers, names, and timestamps are fake — UI only.

export const KPIS = [
  {
    id: "predictions",
    label: "Predictions run",
    value: "12,847",
    delta: "+18.4%",
    trend: "up" as const,
    sub: "vs last 7 days",
  },
  {
    id: "viral-rate",
    label: "Viral hit rate",
    value: "23.6%",
    delta: "+4.1%",
    trend: "up" as const,
    sub: "of high-tier posts",
  },
  {
    id: "model-confidence",
    label: "Avg. confidence",
    value: "91.2%",
    delta: "+2.0%",
    trend: "up" as const,
    sub: "across 6 models",
  },
  {
    id: "accuracy",
    label: "7d accuracy",
    value: "87.9%",
    delta: "-0.6%",
    trend: "down" as const,
    sub: "drift detected",
  },
];

export const PERFORMANCE_DISTRIBUTION = [
  { tier: "Viral", count: 184, color: "var(--color-chart-1)" },
  { tier: "Strong", count: 612, color: "var(--color-chart-2)" },
  { tier: "Average", count: 1024, color: "var(--color-chart-3)" },
  { tier: "Weak", count: 318, color: "var(--color-chart-4)" },
  { tier: "Risky", count: 92, color: "var(--color-chart-5)" },
];

// Posting performance heatmap: 7 days × 24 hours, value = avg engagement score
export const HEATMAP_DATA: number[][] = (() => {
  const days = 7;
  const hours = 24;
  const grid: number[][] = [];
  for (let d = 0; d < days; d++) {
    const row: number[] = [];
    for (let h = 0; h < hours; h++) {
      // Synthesize realistic posting peaks: morning (8-10), lunch (12-13), evening (18-22)
      const morning = Math.exp(-Math.pow((h - 9) / 2.2, 2)) * 0.6;
      const lunch = Math.exp(-Math.pow((h - 12.5) / 1.4, 2)) * 0.45;
      const evening = Math.exp(-Math.pow((h - 20) / 2.5, 2)) * 0.95;
      const weekendBoost = d >= 5 ? 0.15 : 0;
      const noise = (Math.sin(d * 7.3 + h * 1.9) + 1) * 0.08;
      const v = Math.min(1, morning + lunch + evening + weekendBoost + noise);
      row.push(Math.round(v * 100) / 100);
    }
    grid.push(row);
  }
  return grid;
})();

export const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Content calendar — scheduled posts for the current month
export type CalendarEntry = {
  id: string;
  day: number; // day of month
  account: string;
  format: "Reels" | "Carousel" | "Story" | "Single image";
  title: string;
  tier: Tier;
  time: string;
};

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  { id: "c1", day: 2, account: "@nova.studio", format: "Reels", title: "Spring drop teaser", tier: "Viral", time: "20:15" },
  { id: "c2", day: 3, account: "@kindred.brand", format: "Carousel", title: "Founder story pt.2", tier: "Strong", time: "12:30" },
  { id: "c3", day: 5, account: "@orbit.media", format: "Story", title: "BTS shoot day", tier: "Average", time: "09:00" },
  { id: "c4", day: 7, account: "@nova.studio", format: "Reels", title: "Studio walkthrough", tier: "Strong", time: "19:45" },
  { id: "c5", day: 8, account: "@halcyon.fm", format: "Single image", title: "Album artwork reveal", tier: "Viral", time: "18:00" },
  { id: "c6", day: 10, account: "@solene.atelier", format: "Carousel", title: "Atelier lookbook", tier: "Strong", time: "11:00" },
  { id: "c7", day: 12, account: "@kindred.brand", format: "Reels", title: "Customer feature", tier: "Average", time: "20:00" },
  { id: "c8", day: 13, account: "@vector.goods", format: "Story", title: "Limited drop alert", tier: "Weak", time: "16:30" },
  { id: "c9", day: 15, account: "@nova.studio", format: "Reels", title: "Behind the brand", tier: "Viral", time: "20:30" },
  { id: "c10", day: 17, account: "@orbit.media", format: "Carousel", title: "Editorial recap", tier: "Strong", time: "13:15" },
  { id: "c11", day: 18, account: "@halcyon.fm", format: "Reels", title: "Track teaser", tier: "Strong", time: "21:00" },
  { id: "c12", day: 20, account: "@solene.atelier", format: "Single image", title: "Press feature", tier: "Average", time: "10:00" },
  { id: "c13", day: 22, account: "@kindred.brand", format: "Carousel", title: "Sustainability report", tier: "Average", time: "14:00" },
  { id: "c14", day: 23, account: "@nova.studio", format: "Reels", title: "Campaign launch", tier: "Viral", time: "19:30" },
  { id: "c15", day: 25, account: "@vector.goods", format: "Story", title: "Restock teaser", tier: "Strong", time: "17:00" },
  { id: "c16", day: 27, account: "@orbit.media", format: "Reels", title: "Founder Q&A", tier: "Strong", time: "20:00" },
  { id: "c17", day: 28, account: "@halcyon.fm", format: "Carousel", title: "Tour dates", tier: "Average", time: "12:00" },
];

export const USAGE_TREND = Array.from({ length: 30 }, (_, i) => {
  const seed = Math.sin(i * 1.7) * 0.5 + 0.5;
  return {
    day: i + 1,
    predictions: Math.round(280 + seed * 420 + (i % 5) * 30),
    viral: Math.round(40 + seed * 90 + (i % 7) * 6),
  };
});

export const RECENT_PREDICTIONS = [
  {
    id: "pr_8821",
    account: "@nova.studio",
    format: "Reels",
    tier: "Viral",
    confidence: 94,
    when: "2 min ago",
  },
  {
    id: "pr_8820",
    account: "@kindred.brand",
    format: "Carousel",
    tier: "Strong",
    confidence: 88,
    when: "6 min ago",
  },
  {
    id: "pr_8819",
    account: "@orbit.media",
    format: "Single image",
    tier: "Average",
    confidence: 71,
    when: "11 min ago",
  },
  {
    id: "pr_8818",
    account: "@solene.atelier",
    format: "Reels",
    tier: "Weak",
    confidence: 64,
    when: "18 min ago",
  },
  {
    id: "pr_8817",
    account: "@halcyon.fm",
    format: "Story",
    tier: "Strong",
    confidence: 82,
    when: "24 min ago",
  },
];

export const FEATURE_IMPORTANCE = [
  { feature: "Caption hook strength", impact: 0.28, direction: "positive" as const },
  { feature: "Posting time (peak)", impact: 0.19, direction: "positive" as const },
  { feature: "Hashtag relevance", impact: 0.14, direction: "positive" as const },
  { feature: "Format × audience fit", impact: 0.12, direction: "positive" as const },
  { feature: "CTA presence", impact: 0.09, direction: "positive" as const },
  { feature: "Caption length", impact: 0.08, direction: "negative" as const },
  { feature: "Emoji density", impact: 0.06, direction: "negative" as const },
  { feature: "Repetition vs prior", impact: 0.04, direction: "negative" as const },
];

export const SUGGESTIONS = [
  {
    id: "s1",
    title: "Tighten the hook to 8 words",
    detail:
      "Lead with the outcome, defer context. Predicted lift on first-3-second retention.",
    projection: "+14% reach",
    tierShift: { from: "Strong", to: "Viral" },
  },
  {
    id: "s2",
    title: "Move CTA to second line",
    detail:
      "Audiences in this segment respond 1.6× when CTA follows the value statement.",
    projection: "+6% saves",
    tierShift: { from: "Average", to: "Strong" },
  },
  {
    id: "s3",
    title: "Swap 3 broad hashtags for niche",
    detail:
      "Lower competition, higher discovery probability for current posting window.",
    projection: "+9% impressions",
    tierShift: null,
  },
  {
    id: "s4",
    title: "Reschedule to 20:15 local",
    detail:
      "Audience activity peaks 47 minutes later than your default slot.",
    projection: "+11% engagement",
    tierShift: { from: "Strong", to: "Viral" },
  },
];

export const BRANDS = [
  { id: "b1", name: "Nova Studio", handle: "@nova.studio", posts: 412, tier: "Enterprise", status: "active" },
  { id: "b2", name: "Kindred", handle: "@kindred.brand", posts: 287, tier: "Growth", status: "active" },
  { id: "b3", name: "Orbit Media", handle: "@orbit.media", posts: 198, tier: "Growth", status: "paused" },
  { id: "b4", name: "Solène Atelier", handle: "@solene.atelier", posts: 144, tier: "Boutique", status: "active" },
  { id: "b5", name: "Halcyon FM", handle: "@halcyon.fm", posts: 96, tier: "Boutique", status: "active" },
  { id: "b6", name: "Vector Goods", handle: "@vector.goods", posts: 72, tier: "Boutique", status: "trial" },
];

export const MODELS = [
  { id: "m1", name: "faiv-core", version: "v4.2.1", accuracy: 89.4, status: "production", trained: "2 days ago" },
  { id: "m2", name: "faiv-reels", version: "v3.8.0", accuracy: 92.1, status: "production", trained: "5 days ago" },
  { id: "m3", name: "faiv-carousel", version: "v2.5.3", accuracy: 86.7, status: "production", trained: "1 week ago" },
  { id: "m4", name: "faiv-experimental", version: "v0.9.0", accuracy: 81.2, status: "canary", trained: "12 hours ago" },
  { id: "m5", name: "faiv-legacy", version: "v3.1.0", accuracy: 78.5, status: "archived", trained: "3 months ago" },
];

export const BATCH_RESULTS = [
  { id: 1, name: "Spring drop teaser", format: "Reels", tier: "Viral", confidence: 93 },
  { id: 2, name: "Founder origin story", format: "Carousel", tier: "Strong", confidence: 86 },
  { id: 3, name: "Behind the scenes", format: "Story", tier: "Average", confidence: 72 },
  { id: 4, name: "Product unbox", format: "Reels", tier: "Strong", confidence: 81 },
  { id: 5, name: "Customer review", format: "Single image", tier: "Weak", confidence: 58 },
  { id: 6, name: "Sale countdown", format: "Story", tier: "Average", confidence: 69 },
  { id: 7, name: "Lookbook page", format: "Carousel", tier: "Viral", confidence: 91 },
  { id: 8, name: "Studio tour", format: "Reels", tier: "Strong", confidence: 84 },
];

export type Tier = "Viral" | "Strong" | "Average" | "Weak" | "Risky";

export const TIER_META: Record<Tier, { label: string; color: string; bg: string; ring: string }> = {
  Viral: {
    label: "Viral",
    color: "text-[oklch(0.45_0.20_295)]",
    bg: "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]",
    ring: "ring-[color-mix(in_oklab,var(--primary)_35%,transparent)]",
  },
  Strong: {
    label: "Strong",
    color: "text-[oklch(0.40_0.18_130)]",
    bg: "bg-[color-mix(in_oklab,var(--accent-lime)_22%,transparent)]",
    ring: "ring-[color-mix(in_oklab,var(--accent-lime)_45%,transparent)]",
  },
  Average: {
    label: "Average",
    color: "text-[oklch(0.40_0.10_230)]",
    bg: "bg-[color-mix(in_oklab,var(--chart-3)_15%,transparent)]",
    ring: "ring-[color-mix(in_oklab,var(--chart-3)_35%,transparent)]",
  },
  Weak: {
    label: "Weak",
    color: "text-[oklch(0.45_0.14_75)]",
    bg: "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)]",
    ring: "ring-[color-mix(in_oklab,var(--warning)_40%,transparent)]",
  },
  Risky: {
    label: "Risky",
    color: "text-[oklch(0.48_0.20_22)]",
    bg: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)]",
    ring: "ring-[color-mix(in_oklab,var(--destructive)_35%,transparent)]",
  },
};
