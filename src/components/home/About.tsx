"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eye, ShieldCheck, Languages, ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui";
import { RASHIS } from "@/lib/content";

const PILLAR_ICONS = [Eye, ShieldCheck, Languages];

export function RashiStrip() {
  const { L } = useLang();
  return (
    <section className="relative py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {RASHIS.map((r, i) => (
            <motion.div key={r.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <Link href={`/rashi?sign=${r.key}`} className="glass group flex flex-col items-center rounded-2xl px-2 py-3 transition hover:border-gold-400/50">
                <span className="text-2xl text-gold-300 transition-transform group-hover:scale-125">{r.symbol}</span>
                <span className="mt-1 text-xs text-slate-400 group-hover:text-white">{L(r.short)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section id="about" ref={ref} className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div style={{ y: yImg, rotate }} className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold-400/20 via-mystic-600/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-gold-400/30 gold-glow">
              <Image src="/images/cosmic-palm.svg" alt="Cosmic palm with zodiac wheel" width={800} height={800} className="h-auto w-full object-cover" priority={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/70 via-transparent to-transparent" />
            </div>
            <div className="glass-strong absolute -bottom-6 -right-4 hidden rounded-2xl px-5 py-4 sm:block">
              <p className="font-display text-2xl text-gold-300">100%</p>
              <p className="text-xs text-slate-400">Rule-based · No AI API</p>
            </div>
          </motion.div>

          <div>
            <SectionHeading align="left" eyebrow="✦ About" title={t.about.title} />
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="-mt-6 text-base leading-relaxed text-slate-300">
              {t.about.p1}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-base leading-relaxed text-slate-300">
              {t.about.p2}
            </motion.p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {t.about.pillars.map((p, i) => {
                const Icon = PILLAR_ICONS[i];
                return (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }} className="glass rounded-2xl p-5">
                    <Icon className="h-5 w-5 text-gold-300" />
                    <p className="mt-3 font-semibold text-white">{p.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            <Link href="/reading" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-300 hover:text-gold-200">
              {t.nav.getReading} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
