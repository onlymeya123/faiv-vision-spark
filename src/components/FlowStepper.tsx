import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, Gauge, Activity, Lightbulb, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { to: "/predict", label: "Predict", icon: Sparkles },
  { to: "/result", label: "Result", icon: Gauge },
  { to: "/diagnose", label: "Diagnose", icon: Activity },
  { to: "/suggest", label: "Suggest", icon: Lightbulb },
] as const;

export function FlowStepper({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const currentIdx = Math.max(
    0,
    STEPS.findIndex((s) => pathname.startsWith(s.to)),
  );

  return (
    <nav
      aria-label="Prediction flow"
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-full border border-border bg-surface/60 p-1 backdrop-blur-xl",
        className,
      )}
    >
      {STEPS.map((step, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        const Icon = isDone ? Check : step.icon;
        return (
          <div key={step.to} className="flex items-center gap-1">
            <Link
              to={step.to}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-purple)]"
                  : isDone
                  ? "text-foreground hover:bg-surface-2"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full text-[10px] font-mono",
                  isActive
                    ? "bg-white/20"
                    : isDone
                    ? "bg-[color-mix(in_oklab,var(--accent-lime)_40%,transparent)] text-foreground"
                    : "bg-surface-2 text-muted-foreground",
                )}
              >
                <Icon className="h-2.5 w-2.5" />
              </span>
              {step.label}
            </Link>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-4 transition-colors",
                  i < currentIdx ? "bg-foreground/30" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
