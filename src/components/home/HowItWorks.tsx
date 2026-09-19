"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { UserRound, Hand, Orbit, BookOpenCheck, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, cn } from "@/components/ui";

const ICONS: LucideIcon[] = [UserRound, Hand, Orbit, BookOpenCheck];

function StepCard({ index, title, desc, onActive }: { index: number; title: string; desc: string; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const Icon = ICONS[index];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className={cn("glass relative rounded-3xl p-6 transition-all duration-500 sm:p-8", inView && "gold-border gold-glow")}
    >
      <div className="flex items-start gap-5">
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-colors", inView ? "border-gold-400/60 bg-gold-400/15 text-gold-300" : "border-white/10 bg-white/5 text-slate-300")}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/80">Step {index + 1}</p>
          <h3 className="mt-1 font-display text-xl text-white sm:text-2xl">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { t } = useLang();
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="✦ Process" title={t.how.title} sub={t.how.sub} />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass-strong relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-gold-400/20 animate-spin-slow" />
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-mystic-500/30 animate-spin-slower" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/80">{t.how.title}</p>
              <motion.p key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-display text-6xl font-bold gold-text md:text-7xl">
                0{active + 1}
              </motion.p>
              <motion.h3 key={`t-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 font-display text-2xl text-white">
                {t.how.steps[active].title}
              </motion.h3>
              <div className="mt-8 flex gap-2">
                {t.how.steps.map((_, i) => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", i <= active ? "bg-gold-400" : "bg-white/10")} />
                ))}
              </div>
              <ul className="mt-8 space-y-3">
                {t.how.steps.map((s, i) => (
                  <li key={i} className={cn("flex items-center gap-3 text-sm transition-colors", i === active ? "text-gold-300" : "text-slate-500")}>
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[11px]", i === active ? "border-gold-400 bg-gold-400/20" : "border-white/15")}>{i + 1}</span>
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="relative space-y-6 lg:space-y-10">
            <div className="absolute bottom-6 left-[43px] top-6 hidden w-px bg-gradient-to-b from-gold-400/0 via-gold-400/40 to-gold-400/0 sm:block" />
            {t.how.steps.map((s, i) => (
              <StepCard key={i} index={i} title={s.title} desc={s.desc} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
