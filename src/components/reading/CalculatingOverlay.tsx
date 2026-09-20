"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";

const THRESHOLDS = [0, 20, 44, 66, 86];

export default function CalculatingOverlay({ progress }: { progress: number | null }) {
  const { t } = useLang();
  const open = progress !== null;
  const p = progress ?? 0;
  const stepIndex = THRESHOLDS.filter((th) => p >= th).length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-cosmic-950/90 p-4 backdrop-blur-md">
          <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} className="glass-strong relative w-full max-w-md overflow-hidden rounded-[2rem] p-8 text-center">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              {/* spinning mandala + hand */}
              <div className="relative mx-auto h-40 w-40">
                <div className="absolute inset-0 rounded-full border border-dashed border-gold-400/40" style={{ animation: "halo-spin 14s linear infinite" }} />
                <div className="absolute inset-3 rounded-full border border-mystic-500/40" style={{ animation: "halo-spin 9s linear infinite reverse" }} />
                <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="url(#pg)" strokeWidth="5" strokeLinecap="round" strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - p / 100)} style={{ transition: "stroke-dashoffset 0.15s linear" }} />
                  <defs>
                    <linearGradient id="pg" x1="0" x2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#f5c242" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-[22%]" style={{ animation: "hand-float 4s ease-in-out infinite" }}>
                  <Image src="/images/hand.png" alt="" fill sizes="100px" className="blend-screen object-contain" />
                </div>
              </div>

              <p className="mt-5 font-display text-5xl font-bold gold-text tabular-nums">{p}%</p>
              <h2 className="mt-2 font-display text-xl text-white">{p >= 100 ? t.progress.done : t.progress.title}</h2>
              <p className="mt-1 text-xs text-slate-400">{t.progress.sub}</p>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-mystic-500 via-gold-400 to-gold-300" style={{ width: `${p}%`, transition: "width 0.15s linear" }} />
              </div>

              <ul className="mt-5 space-y-2 text-left">
                {t.progress.steps.map((s, i) => {
                  const done = i < stepIndex || p >= 100;
                  const current = i === stepIndex && p < 100;
                  return (
                    <li key={s} className={cn("flex items-center gap-2.5 text-sm transition-colors", done ? "text-emerald-300" : current ? "text-gold-200" : "text-slate-500")}>
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs", done ? "border-emerald-400/60 bg-emerald-400/15" : current ? "border-gold-400/60 bg-gold-400/15" : "border-white/15")}>
                        {done ? <Check className="h-3 w-3" /> : current ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
                      </span>
                      {s}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
