import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Activity,
  Lightbulb,
  GitCompare,
  Layers,
  Shield,
  Search,
  Bell,
  Sun,
  Moon,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/predict", label: "Predict", icon: Sparkles },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/diagnose", label: "Diagnose", icon: Activity },
  { to: "/suggest", label: "Suggest", icon: Lightbulb },
  { to: "/ab-test", label: "A/B Test", icon: GitCompare },
  { to: "/batch", label: "Batch", icon: Layers },
  { to: "/admin", label: "Admin", icon: Shield },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [theme, setTheme] = React.useState<"dark" | "light">("light");

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen w-full text-foreground">
      {/* Decorative aurora */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 55%, transparent), transparent 70%)",
            filter: "blur(80px)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--secondary-glow) 55%, transparent), transparent 70%)",
            filter: "blur(100px)",
            animation: "glow-pulse 8s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl md:flex">
          <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
            <Logo />
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">
                FAIV<span className="text-primary"> Predict</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Performance OS
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3">
            <div className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
              Workspace
            </div>
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active =
                  location.pathname === item.to ||
                  (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        active
                          ? "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-foreground"
                          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
                        />
                      )}
                      <Icon
                        className={cn(
                          "h-[17px] w-[17px] shrink-0 transition-colors",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="m-3 rounded-xl border border-border-strong bg-gradient-to-br from-surface-2 to-surface p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <div className="text-xs font-medium">Models live</div>
            </div>
            <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              6 production models · canary v0.9
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/60 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <Logo />
              </div>
              <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors focus-within:border-ring md:flex">
                <Search className="h-4 w-4" />
                <input
                  className="w-72 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/70"
                  placeholder="Search predictions, brands, models…"
                />
                <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface/50 text-muted-foreground transition-all hover:text-foreground hover:border-border-strong"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface/50 text-muted-foreground transition-all hover:text-foreground hover:border-border-strong">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              </button>
              <div className="ml-1 flex items-center gap-2 rounded-lg border border-border bg-surface/50 py-1 pl-1 pr-3">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary-glow text-[11px] font-semibold text-primary-foreground">
                  AM
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <div className="text-xs font-medium">Alex Morgan</div>
                  <div className="text-[10px] text-muted-foreground">Strategist · Nova</div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center overflow-hidden rounded-xl"
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
