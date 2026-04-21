import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAIV Predict — Sign in" },
      {
        name: "description",
        content: "Sign in to FAIV Predict — AI content performance prediction for creative agencies.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  };

  return (
    <div className="dark relative grid min-h-screen w-full bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div
          className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 60%, transparent), transparent 70%)",
            filter: "blur(80px)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--secondary-glow) 60%, transparent), transparent 70%)",
            filter: "blur(100px)",
            animation: "glow-pulse 8s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Logo size={42} />
            <div>
              <div className="font-display text-lg font-semibold tracking-tight">
                FAIV<span className="text-primary"> Predict</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Performance OS for creative work
              </div>
            </div>
          </div>

          <div className="max-w-lg space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trained on 4.2M agency posts
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight">
              Classify your post{" "}
              <span className="text-gradient-primary">before</span>
              <br />
              you ever hit publish.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              FAIV Predict runs every post through a hierarchical Random Forest — Personal Model
              for mature accounts, Niche fallback otherwise — returning a tier (HIGH / AVERAGE /
              LOW) with a confidence score.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { v: "83.2%", l: "30d Accuracy" },
                { v: "<400ms", l: "Inference time" },
                { v: "3 tiers", l: "HIGH · AVG · LOW" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-border bg-surface/40 p-4 backdrop-blur"
                >
                  <div className="font-display text-2xl font-semibold text-foreground">
                    {s.v}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            © 2026 FAIV Labs · Trusted by 240+ creative agencies
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="absolute inset-0 lg:hidden">
          <div
            className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 50%, transparent), transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="relative w-full max-w-md animate-[fade-in_0.6s_ease-out]">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <Logo />
            <div className="font-display text-lg font-semibold">
              FAIV<span className="text-primary"> Predict</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your prediction workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              icon={<Mail className="h-4 w-4" />}
              label="Work email"
              type="email"
              placeholder="alex@studio.com"
              defaultValue="alex@nova.studio"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              label="Password"
              type="password"
              placeholder="••••••••"
              defaultValue="demoaccount"
              hint={
                <a className="text-xs text-primary hover:underline" href="#">
                  Forgot?
                </a>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[var(--shadow-glow-cyan)] disabled:opacity-70"
            >
              <span className="relative z-10">
                {loading ? "Signing in…" : "Sign in"}
              </span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-border-strong hover:bg-surface-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              No account?{" "}
              <Link to="/dashboard" className="text-primary hover:underline">
                Request a demo
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  hint,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  hint?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {hint}
      </div>
      <div className="group relative flex items-center rounded-xl border border-border bg-surface/50 px-3.5 transition-all focus-within:border-ring focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_20%,transparent)]">
        <span className="text-muted-foreground">{icon}</span>
        <input
          {...props}
          className="ml-3 h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
