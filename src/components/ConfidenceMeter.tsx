"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface ConfidenceMeterProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  tier?: string;
}

export function ConfidenceMeter({
  value,
  size = 220,
  label = "Confidence",
  tier,
}: ConfidenceMeterProps) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const motionVal = useMotionValue(0);
  const dash = useTransform(motionVal, (v) => circumference - (v / 100) * circumference);
  const [displayed, setDisplayed] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return controls.stop;
  }, [value, motionVal]);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="conf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210 55% 64%)" />
            <stop offset="100%" stopColor="hsl(95 75% 68%)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in oklab, hsl(var(--foreground)) 8%, transparent)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#conf-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dash, filter: "drop-shadow(0 0 12px hsl(210 55% 64% / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-[44px] font-semibold leading-none tracking-tight">
            {displayed}
            <span className="text-2xl text-muted-foreground">%</span>
          </div>
          <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
          {tier && (
            <div className="mt-2 text-xs font-medium text-primary">{tier} prediction</div>
          )}
        </div>
      </div>
    </div>
  );
}
