"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { RASHIS } from "@/lib/content";

const ZodiacScene = dynamic(() => import("./ZodiacScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse-glow rounded-full border border-gold-400/30 bg-mystic-700/20 blur-sm" />,
});

export default function ZodiacShowcase() {
  const { t, L } = useLang();
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-[15%] rounded-full bg-mystic-600/30 blur-[80px]" />
          <div className="absolute inset-0"><ZodiacScene /></div>
        </motion.div>
        <div>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Rashi Chakra</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="mt-3 font-display text-3xl text-white md:text-4xl">{t.zodiac3d.title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-slate-300">{t.zodiac3d.sub}</motion.p>
          <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {RASHIS.map((r, i) => (
              <motion.div key={r.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link href={`/rashi?sign=${r.key}`} className="glass group flex flex-col items-center rounded-2xl px-2 py-3 transition hover:border-gold-400/50">
                  <span className="text-2xl text-gold-300 transition-transform group-hover:scale-125">{r.symbol}</span>
                  <span className="mt-1 text-[11px] text-slate-400 group-hover:text-white">{L(r.short)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <Link href="/rashi" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-300 hover:text-gold-200">
            {t.hero.cta2} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
