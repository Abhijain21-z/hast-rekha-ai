"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import Pricing from "@/components/home/Pricing";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };

/**
 * The /pricing page: the same two plans the home page shows (so there is one
 * source of truth for the lists), plus a highlight for the part unmarried
 * readers most often ask about — the life-partner prediction inside Pro.
 */
export default function PricingPage() {
  const { t } = useLang();
  return (
    <div className="relative">
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.pricing.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">{t.pricing.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300/90">{t.pricing.sub}</p>
      </section>

      <Pricing heading={false} />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          {...reveal}
          className="rounded-[2rem] border-2 border-mystic-400/45 bg-cosmic-950/75 bg-gradient-to-br from-mystic-600/20 via-cosmic-800/60 to-gold-400/10 p-6 backdrop-blur-md sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mystic-400">{t.partner.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl text-white">
            <HeartHandshake className="mr-2 inline h-6 w-6 text-mystic-400" />
            {t.partner.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-100">{t.partner.teaser}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.partner.sub}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
              <Sparkles className="h-4 w-4" /> {t.nav.getReading}
            </Link>
            <span className="text-xs text-slate-400">{t.pricing.payNote}</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
