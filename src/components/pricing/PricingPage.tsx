"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import Pricing from "@/components/home/Pricing";
import { COUPON_STORAGE_KEY, findCoupon } from "@/lib/coupons";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };

/**
 * The /pricing page: the same two plans the home page shows (so there is one
 * source of truth for the lists), plus a highlight for the part unmarried
 * readers most often ask about — the life-partner prediction inside Pro.
 */
export default function PricingPage() {
  const { t, L } = useLang();
  const [waCoupon, setWaCoupon] = useState<string | null>(null);

  // The approved WhatsApp follow-up template links here with
  // utm_source=whatsapp&utm_campaign=pro_followup. Persist SAVE50 so the
  // paywall applies it even after the visitor moves to the reading form.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("utm_source") !== "whatsapp") return;
    if (params.get("utm_campaign") !== "pro_followup") return;
    const coupon = findCoupon("SAVE50");
    if (!coupon) return;
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
    } catch {}
    // Defer the state update out of the effect body; localStorage is the
    // external system and React only renders the resulting banner.
    const timer = window.setTimeout(() => setWaCoupon(coupon.code), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.pricing.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">{t.pricing.h1}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300/90">{t.pricing.sub}</p>
      </section>

      {waCoupon && (
        <section className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-4 text-center">
            <p className="text-sm font-semibold text-emerald-100">
              {L({
                en: `WhatsApp offer: ${waCoupon} — 50% off`,
                hi: `व्हाट्सऐप ऑफ़र: ${waCoupon} — 50% छूट`,
              })}
            </p>
            <p className="mt-1 text-xs text-emerald-200/80">
              {L({
                en: "The discount is applied automatically at checkout.",
                hi: "छूट चेकआउट पर अपने आप लग जाएगी।",
              })}
            </p>
          </div>
        </section>
      )}

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
