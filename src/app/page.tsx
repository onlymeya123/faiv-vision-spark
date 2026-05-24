"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/AppShell";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <div className="light relative grid min-h-screen w-full bg-background text-foreground lg:grid-cols-[1.05fr_1fr]">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
        <div
          aria-hidden
          className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, hsl(var(--primary-glow)) 35%, transparent), transparent 70%)",
            filter: "blur(80px)",
            animation: "glow-pulse 6s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, hsl(var(--secondary-glow)) 30%, transparent), transparent 70%)",
            filter: "blur(100px)",
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

          <div className="max-w-lg space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Hierarchical Random Forest · live in production
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

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { v: "83.2%", l: "30d Accuracy" },
                { v: "<400ms", l: "Inference time" },
                { v: "3 tiers", l: "HIGH · AVG · LOW" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-border bg-surface/60 p-4 backdrop-blur"
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
        <div aria-hidden className="absolute inset-0 lg:hidden">
          <div
            className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, hsl(var(--primary-glow)) 30%, transparent), transparent 70%)",
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
                <a className="text-xs font-medium text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              }
            />

            <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              />
              Keep me signed in for 30 days
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[var(--shadow-glow-purple)] disabled:opacity-70"
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

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Protected by SSO &amp; encrypted at rest
            </div>

            <p className="pt-2 text-center text-xs text-muted-foreground">
              No account?{" "}
              <Link href="/dashboard" className="font-medium text-primary hover:underline">
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
      <div className="group relative flex items-center rounded-xl border border-border bg-surface/70 px-3.5 transition-all focus-within:border-ring focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,hsl(var(--ring))_18%,transparent)]">
        <span className="text-muted-foreground">{icon}</span>
        <input
          {...props}
          className="ml-3 h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
