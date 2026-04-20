# FAIV Predict — Design System

> A clean, Notion-inspired SaaS aesthetic with Apple-system typography, a confident purple primary, and a lime-green accent. Light-mode first, dark-mode supported.

---

## 1. Design Principles

1. **Clarity over decoration.** Reduce borders, soften shadows, lean on whitespace and typography to create hierarchy.
2. **Mixed density.** Avoid endless card grids — alternate borderless sections, highlight panels, and dense data zones for rhythm.
3. **Effortless motion.** 180ms ease-out is the baseline. Motion confirms intent; it never delays it.
4. **Optimistic feedback.** Actions reflect instantly. Numbers animate, badges crossfade, layouts reflow smoothly.
5. **Premium calm.** Subtle gradients, minimal glow, no decorative chrome. The product should feel lightweight and fast.

---

## 2. Color System

All colors are defined as OKLCH tokens in `src/styles.css`. **Never hardcode color values in components.**

### Core palette

| Token | Light | Role |
|---|---|---|
| `--background` | `oklch(0.995 0.002 280)` | Page background — near-white with cool tint |
| `--foreground` | `oklch(0.18 0.02 270)` | Primary text |
| `--primary` | Purple `oklch(~0.55 0.22 290)` | Brand actions, links, focus |
| `--primary-foreground` | White | Text on primary |
| `--accent` | Lime `oklch(~0.88 0.20 130)` | Highlights, positive deltas, callouts |
| `--muted` | `oklch(0.96 0.005 270)` | Secondary surfaces |
| `--muted-foreground` | `oklch(0.45 0.02 270)` | Captions, labels |
| `--border` | `oklch(0.92 0.005 270)` | Hairlines (use sparingly) |
| `--destructive` | Red | Errors, deletions |

### Semantic aliases

- `--gradient-primary` — purple → lighter purple, used for hero bands
- `--shadow-elevated` — soft 2-layer shadow for floating panels
- `--shadow-soft` — barely-there ambient lift for cards

### Usage rules

- Purple = action / brand. Lime = signal / positive change. Never swap them.
- Use `color-mix(in oklab, var(--primary) X%, transparent)` for translucent fills.
- Borders are optional. Prefer background separation or whitespace.

---

## 3. Typography

Apple-system stack for a familiar, refined SaaS feel.

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
             "Inter", system-ui, sans-serif;
font-feature-settings: "ss01", "cv11";
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
```

### Scale & tracking

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Display | 40–56px | 600 | `-0.024em` |
| H1 | 28–32px | 600 | `-0.02em` |
| H2 | 22–24px | 600 | `-0.015em` |
| H3 | 18px | 600 | `-0.01em` |
| Body | 14–15px | 400 | `-0.005em` |
| Label | 12–13px | 500 | `0` (uppercase optional, use 0.04em then) |
| Data / numeric | tabular-nums, slightly heavier | 500 | `-0.005em` |

### Hierarchy rules

- **One H1 per page.** Use `<SectionHeader>` for consistent spacing.
- Numbers use `font-variant-numeric: tabular-nums` so they don't shift when animating.
- Don't mix more than 2 weights in a single block.

---

## 4. Spacing & Layout

Base unit: **4px**. Use Tailwind's spacing scale (`gap-2`, `p-6`, etc.).

| Token | Use |
|---|---|
| `4 / 8` | Inline gaps, chip padding |
| `12 / 16` | Component internal padding |
| `24 / 32` | Section padding, card padding |
| `48 / 64` | Page-level vertical rhythm |

### Layout patterns

- **App shell**: 240px sidebar + topbar + main. Sidebar collapses on mobile.
- **Page max-width**: `max-w-[1280px]`, centered, with `px-6 lg:px-10`.
- **Mixed density**: Alternate full-bleed hero → 2-column grid → borderless data row → highlight panel.
- **Avoid**: 4 identical cards in a row. Break it up with a wider feature panel or borderless metric strip.

---

## 5. Motion

| Property | Value |
|---|---|
| Default duration | **180ms** |
| Easing | **ease-out** (`cubic-bezier(0.22, 1, 0.36, 1)`) |
| Hover | 120ms ease-out |
| Page enter | 240ms ease-out, 8px y-offset |
| Number tween | `requestAnimationFrame`, 400–600ms |

### Patterns

- **Pressed state**: `active:scale-[0.97]` on all interactive elements.
- **Hover lift**: shadow + 1px translateY, never scale.
- **Layout shift**: use `framer-motion`'s `layout` prop, not manual transitions.
- **Skeleton states** > spinners. Match the shape of the content that's loading.

---

## 6. Components

### Buttons
- Primary: filled purple, soft shadow, white text.
- Secondary: muted background, foreground text.
- Ghost: transparent until hover (muted bg).
- Always: rounded-lg (10px), `active:scale-[0.97]`, 180ms transitions.

### Cards & Panels
- Default card: `bg-card`, `rounded-2xl`, `shadow-soft`, **no border**.
- Highlight panel: gradient background, lime accent stroke, used for hero metrics.
- Borderless section: just whitespace + heading — for secondary data.

### Inputs
- 40px height, `rounded-lg`, muted border, focus ring uses primary at 30%.
- Datetime picker: Radix popover with calendar + tactile time spinner. Never use a raw `<input type="datetime-local">`.

### Badges (Tier)
- `Viral` — lime fill, dark text
- `Strong` — purple fill, white text
- `Solid` — muted fill
- `Weak` — destructive at 15%, destructive text

### Data viz
- Recharts with palette: primary purple, accent lime, muted gray for baselines.
- Grid lines: `var(--border)` at 50% opacity.
- Tooltips: `bg-popover`, `shadow-elevated`, no border.

---

## 7. Iconography

- **Library**: `lucide-react` only.
- **Stroke**: 1.75 (slightly lighter than default 2).
- **Size**: 16px inline, 20px buttons, 24px section headers.

---

## 8. Accessibility

- Minimum contrast: WCAG AA (4.5:1 for body, 3:1 for large text).
- Focus rings always visible — `ring-2 ring-primary/40 ring-offset-2`.
- Hit targets ≥ 36×36px.
- Motion-reduced users: respect `prefers-reduced-motion` (skip number tweens, instant layout shifts).

---

## 9. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use semantic tokens (`bg-primary`, `text-foreground`) | Hardcode `#7c3aed` or `bg-purple-600` |
| Animate numbers and tier shifts on apply | Show a spinner and wait |
| Mix layout densities for rhythm | Stack 6 identical cards in a column |
| Use whitespace for separation | Add a border to every section |
| Keep motion under 300ms | Use 500ms+ "fancy" easings |
| One bold accent per view | Rainbow every metric chip |

---

## 10. File References

- **Tokens & globals**: `src/styles.css`
- **Layout shell**: `src/components/AppShell.tsx`
- **Section header**: `src/components/SectionHeader.tsx`
- **Datetime picker**: `src/components/DateTimePicker.tsx`
- **Tier badge**: `src/components/TierBadge.tsx`
- **Confidence meter**: `src/components/ConfidenceMeter.tsx`
- **Heatmap**: `src/components/PostingHeatmap.tsx`
