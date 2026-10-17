"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Check, Crown, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, Badge } from "@/components/ui";
import { BOOK_PERKS, PREMIUM_PERKS } from "@/lib/premium";

export default function Pricing({ heading = true }: { heading?: boolean }) {
  const { t, L } = useLang();
  // Ultra Pro is everything in Pro plus the Dhandayak book, so the list is
  // composed instead of duplicated in the translation files.
  const ultraPerks = [...PREMIUM_PERKS, ...BOOK_PERKS];

  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {heading && <SectionHeading eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Free */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="glass flex flex-col rounded-3xl p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl text-white">{t.pricing.free}</p>
              <p><span className="font-display text-4xl leading-none text-white">{t.pricing.freePrice}</span> <span className="text-xs text-slate-400">{t.pricing.freeSub}</span></p>
            </div>
            <ul className="mt-6 flex-1 space-y-3.5">
              {t.pricing.freeList.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check className="h-3 w-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm text-slate-100 transition hover:border-gold-400/50 hover:text-gold-200">
              <Sparkles className="h-4 w-4" /> {t.pricing.chooseFree}
            </Link>
            {/* Spacer mirrors the paid cards' payment note so every CTA shares a baseline */}
            <p className="mt-3 text-center text-[12px] text-transparent" aria-hidden>&nbsp;</p>
          </motion.div>

          {/* Premium (Pro) */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-gold-400/60 bg-gradient-to-br from-gold-400/15 via-cosmic-800/80 to-mystic-700/25 p-7 sm:p-8 gold-glow">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <Badge className="absolute right-5 top-5 px-3.5 py-1.5 text-xs"><Crown className="h-3 w-3" /> {t.pricing.popular}</Badge>
            <div className="relative flex items-center justify-between">
              <p className="font-display text-2xl text-gold-200">{t.pricing.prem}</p>
              <p><span className="gold-text font-display text-4xl font-bold leading-none">{t.pricing.premPrice}</span> <span className="text-xs text-slate-300">{t.pricing.premSub}</span></p>
            </div>
            <ul className="relative mt-6 flex-1 space-y-3.5">
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
            <p className="relative mt-3 text-center text-[12px] text-slate-300">{t.pricing.payNote}</p>
          </motion.div>

          {/* Ultra Pro — Pro plus the Dhandayak book */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-mystic-400/55 bg-gradient-to-br from-mystic-600/25 via-cosmic-800/85 to-gold-400/10 p-7 sm:p-8">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative flex items-center justify-between gap-3">
              <p className="font-display text-2xl text-mystic-300">{t.pricing.ultra}</p>
              <Badge className="px-3 py-1 text-xs"><BookOpen className="h-3 w-3" /> {t.pricing.ultraBadge}</Badge>
            </div>
            <p className="relative mt-3">
              <span className="gold-text font-display text-4xl font-bold leading-none">{t.pricing.ultraPrice}</span>{" "}
              <span className="text-xs text-slate-300">{t.pricing.ultraSub}</span>
            </p>
            <ul className="relative mt-6 flex-1 space-y-3.5">
              {ultraPerks.map((f) => (
                <li key={f.en} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mystic-400/25 text-mystic-300"><Check className="h-3 w-3" /></span>
                  {L(f)}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="btn-gold relative mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm">
              <Crown className="h-4 w-4" /> {t.pricing.chooseUltra}
            </Link>
            <p className="relative mt-3 text-center text-[12px] text-slate-300">{t.pricing.ultraNote}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
