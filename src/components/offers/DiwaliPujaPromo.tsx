"use client";

import Link from "next/link";
import { ArrowRight, Check, Gift, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { DIWALI_OFFER } from "@/lib/diwali-offer";

/**
 * Public, prominent Diwali bonus card for the home/pricing/Diwali pages.
 * The PDF URL is intentionally absent — it is only fetched on a Pro-unlocked
 * report, so this promo is a real perk rather than a public link.
 */
export default function DiwaliPujaPromo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { L } = useLang();

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-2 border-gold-400/45 bg-gradient-to-br from-gold-400/15 via-cosmic-800/80 to-mystic-700/25 gold-glow",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8",
        className,
      )}
    >
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="relative grid items-center gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            <Gift className="h-4 w-4" /> {L(DIWALI_OFFER.promoBadge)}
            <span className="text-gold-400/60">·</span>
            {L(DIWALI_OFFER.eyebrow)}
          </p>
          <h2
            className={cn(
              "mt-2 font-display text-white",
              compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
            )}
          >
            {L(DIWALI_OFFER.title)}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-100 sm:text-base">
            {L(DIWALI_OFFER.promoSub)}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {DIWALI_OFFER.bullets.map((bullet) => (
              <li key={bullet.en} className="flex items-start gap-2 text-sm text-gold-50">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {L(bullet)}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-strong rounded-3xl p-5 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-gold-300" />
          <p className="mt-2 font-display text-xl text-white">{L(DIWALI_OFFER.promoBadge)}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {L({ en: "One-time ₹99 · Pro report + PDF", hi: "एक बार ₹99 · प्रो रिपोर्ट + PDF" })}
          </p>
          <Link
            href="/reading"
            className="btn-gold mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm"
          >
            {L(DIWALI_OFFER.promoCta)} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing#pricing"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold-200/90 transition hover:text-gold-100"
          >
            {L(DIWALI_OFFER.ctaPricing)} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
