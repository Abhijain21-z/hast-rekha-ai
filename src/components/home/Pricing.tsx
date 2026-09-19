"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, Badge } from "@/components/ui";

export default function Pricing() {
  const { t } = useLang();
  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="glass flex flex-col rounded-3xl p-7 sm:p-8">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl text-white">{t.pricing.free}</p>
              <p><span className="font-display text-4xl text-white">{t.pricing.freePrice}</span> <span className="text-xs text-slate-400">{t.pricing.freeSub}</span></p>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {t.pricing.freeList.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check className="h-3 w-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-slate-100 transition hover:border-gold-400/50 hover:text-gold-200">
              <Sparkles className="h-4 w-4" /> {t.pricing.chooseFree}
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-gold-400/60 bg-gradient-to-br from-gold-400/15 via-cosmic-800/80 to-mystic-700/25 p-7 sm:p-8 gold-glow">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <Badge className="absolute right-5 top-5"><Crown className="h-3 w-3" /> {t.pricing.popular}</Badge>
            <div className="relative flex items-baseline justify-between">
              <p className="font-display text-2xl text-gold-200">{t.pricing.prem}</p>
              <p><span className="gold-text font-display text-5xl font-bold">{t.pricing.premPrice}</span> <span className="text-xs text-slate-300">{t.pricing.premSub}</span></p>
            </div>
            <ul className="relative mt-6 flex-1 space-y-3">
              {t.pricing.premList.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gold-50">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/25 text-gold-200"><Check className="h-3 w-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="btn-gold relative mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm">
              <Crown className="h-4 w-4" /> {t.pricing.choosePrem}
            </Link>
            <p className="relative mt-3 text-center text-[11px] text-slate-300">{t.pricing.payNote}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
