"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  CalendarRange,
  History,
  Building2,
  Cpu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/predict", label: "Prediction", icon: Sparkles },
      { to: "/calendar", label: "Calendar", icon: CalendarRange },
      { to: "/history", label: "History", icon: History },
    ],
  },
  {
    label: "Administrator",
    items: [
      { to: "/niches", label: "Niche Management", icon: Building2 },
      { to: "/model-health", label: "Model Health", icon: Cpu },
    ],
  },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<"dark" | "light">("light");

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen w-full text-foreground">
      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, hsl(var(--primary-glow)) 50%, transparent), transparent 70%)",
            filter: "blur(90px)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, hsl(var(--secondary-glow)) 45%, transparent), transparent 70%)",
            filter: "blur(110px)",
            animation: "glow-pulse 8s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
          {/* Logo row — same height as topbar */}
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
            <Logo />
            <div className="min-w-0 leading-tight">
              <div className="font-display text-[14px] font-semibold tracking-tight">
                FAIV<span className="text-primary"> Predict</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                Hierarchical RF
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-5">
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/50">
                  {group.label}
                </div>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.to ||
                      (item.to !== "/dashboard" && pathname.startsWith(item.to));
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <Link
                          href={item.to}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                            active
                              ? "bg-sidebar-accent text-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-[26px] w-[26px] shrink-0 place-items-center rounded-md transition-colors",
                              active
                                ? "bg-[color-mix(in_oklab,hsl(var(--primary))_15%,transparent)] text-primary"
                                : "text-muted-foreground/60 group-hover:text-muted-foreground"
                            )}
                          >
                            <Icon className="h-[14px] w-[14px]" />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User footer */}
          <div className="shrink-0 border-t border-border p-2">
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-sidebar-accent/50 cursor-pointer">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary-glow text-[11px] font-bold text-primary-foreground">
                AM
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-sidebar-foreground">
                  Alex Morgan
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_150)] shadow-[0_0_6px_oklch(0.72_0.16_150)]" />
                  Strategist · Nova
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
            {/* Left: mobile logo + search */}
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <Logo />
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm text-muted-foreground transition-all focus-within:border-ring focus-within:bg-surface focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,hsl(var(--ring))_15%,transparent)] md:flex">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input
                  className="w-60 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  placeholder="Search predictions, brands, models…"
                />
                <kbd className="ml-1 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
              </button>
              <div className="ml-1 hidden cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface/60 px-2 py-1 transition-colors hover:bg-surface-2 sm:flex">
                <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary-glow text-[10px] font-bold text-primary-foreground">
                  AM
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[12px] font-medium">Alex Morgan</div>
                  <div className="text-[10px] text-muted-foreground">Strategist</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        background: "var(--gradient-primary)",
        boxShadow: "var(--shadow-glow-purple)",
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20V4h12M4 12h9M16 14l4 4-4 4M20 18H10"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
