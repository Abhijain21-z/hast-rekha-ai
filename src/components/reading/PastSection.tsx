"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, Check, X, ShieldCheck } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import type { Bi } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { CountUp } from "./ReportCharts";

export default function PastSection({ items }: { items: Bi[] }) {
  const { t, L } = useLang();
  const [marks, setMarks] = useState<Record<number, boolean>>({});
  const answered = Object.keys(marks).length;
  const yes = Object.values(marks).filter(Boolean).length;
  const accuracy = answered ? Math.round((yes / answered) * 100) : 0;

  return (
    <section id="sec-past" className="scroll-mt-28">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90"><History className="h-4 w-4" /> ✦ {t.report.section} 1</p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">{t.report.past}</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{t.report.pastSub}</p>
            </div>
            {answered > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{t.report.accuracy}</p>
                  <p className="font-display text-2xl text-white"><CountUp key={accuracy} to={accuracy} suffix="%" duration={0.6} /> <span className="text-xs text-slate-400">· {yes}/{items.length} {t.report.matches}</span></p>
                </div>
              </motion.div>
            )}
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {items.map((p, i) => {
              const m = marks[i];
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: (i % 2) * 0.08 + Math.floor(i / 2) * 0.06, duration: 0.5 }}
                  className={cn("relative flex gap-3 rounded-2xl border p-4 transition-colors", m === true ? "border-emerald-400/40 bg-emerald-400/10" : m === false ? "border-white/10 bg-white/[0.02] opacity-70" : "border-gold-400/20 bg-white/[0.03]")}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-display text-xs text-gold-300">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-slate-100">{L(p)}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setMarks({ ...marks, [i]: true })} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition", m === true ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200" : "border-white/10 text-slate-400 hover:border-emerald-400/40 hover:text-emerald-200")}>
                        <Check className="h-3 w-3" /> {t.report.yes}
                      </button>
                      <button onClick={() => setMarks({ ...marks, [i]: false })} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition", m === false ? "border-rose-400/50 bg-rose-400/15 text-rose-200" : "border-white/10 text-slate-400 hover:border-rose-400/40 hover:text-rose-200")}>
                        <X className="h-3 w-3" /> {t.report.no}
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
          <p className="mt-5 text-center text-xs italic text-gold-200/80">{t.report.pastNote}</p>
        </div>
      </div>
    </section>
  );
}
