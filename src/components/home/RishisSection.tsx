"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Flame, ScrollText, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, cn } from "@/components/ui";
import rishisJson from "@/content/rishis.json";
import type { Bi } from "@/lib/i18n";

const R = rishisJson as {
  eyebrow: Bi; title: Bi; sub: Bi;
  agastya: { name: Bi; role: Bi; paras: Bi[] };
  saptarishi: { name: Bi; role: Bi; work: Bi; paras: Bi[] }[];
  closing: Bi;
};

export default function RishisSection() {
  const { L } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="rishis" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={L(R.eyebrow)} title={L(R.title)} sub={L(R.sub)} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }} className="glass-strong relative overflow-hidden rounded-[2rem] p-7 sm:p-10">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="relative flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-gold-400/15 text-gold-300 gold-glow"><Flame className="h-6 w-6" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{L(R.agastya.role)}</p>
              <h3 className="mt-1 font-display text-3xl text-white sm:text-4xl">{L(R.agastya.name)}</h3>
            </div>
          </div>
          <div className="relative mt-6 grid gap-4 lg:grid-cols-2">
            {R.agastya.paras.map((p, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-sm leading-relaxed text-slate-200 sm:text-base sm:leading-7">
                {L(p)}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {R.saptarishi.map((s, i) => {
            const isOpen = open === s.name.en;
            return (
              <motion.div key={s.name.en} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 4) * 0.08 }} whileHover={{ y: -5 }} className={cn("glass flex flex-col rounded-3xl p-5 transition", isOpen ? "border-gold-400/50" : "hover:border-gold-400/40")}>
                <button onClick={() => setOpen(isOpen ? null : s.name.en)} className="flex-1 text-left" aria-expanded={isOpen}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mystic-600/20 text-mystic-400"><ScrollText className="h-4 w-4" /></span>
                  <p className="mt-3 font-display text-xl text-white">{L(s.name)}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400/80">{L(s.role)}</p>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-400">{L(s.work)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-300">
                    {isOpen ? (
                      <>{L({ en: "Show less", hi: "कम देखें" })} <ChevronDown className="h-3.5 w-3.5 rotate-180 transition" /></>
                    ) : (
                      <>{L({ en: "Read full detail", hi: "पूरी जानकारी पढ़ें" })} <ChevronDown className="h-3.5 w-3.5 transition" /></>
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                      <div className="mt-4 space-y-3 border-t border-gold-400/20 pt-4">
                        {s.paras.map((p, j) => (
                          <p key={j} className="text-xs leading-relaxed text-slate-300">{L(p)}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex items-center justify-center rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-mystic-700/15 p-5 text-center">
            <p className="text-sm italic leading-relaxed text-gold-100"><Sparkles className="mx-auto mb-2 h-5 w-5 text-gold-300" />{L(R.closing)}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
