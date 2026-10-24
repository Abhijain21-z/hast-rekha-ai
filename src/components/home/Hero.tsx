"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Gift, MessageCircle, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import Navagraha from "./Navagraha";

export default function Hero() {
  const { t, L } = useLang();
  const { scrollY } = useScroll();
  // Gentle parallax on the mandala only — the welcome text must stay crisp while scrolling.
  const yScene = useTransform(scrollY, [0, 600], [0, -60]);
  const scaleScene = useTransform(scrollY, [0, 600], [1, 0.9]);

  const stats = [
    { v: "12", l: t.hero.stat1 },
    { v: "27", l: t.hero.stat2 },
    { v: "2", l: t.hero.stat3 },
    { v: "0", l: t.hero.stat4 },
  ];

  // Keyword-bearing entry points so a first-time visitor (and a crawler) can
  // reach the deep guides straight from the hero.
  const guides = [
    { href: "/hast-rekha-palmistry", label: L({ en: "Hast Rekha Palmistry guide", hi: "हस्तरेखा पामिस्ट्री गाइड" }) },
    { href: "/life-line", label: L({ en: "Life Line", hi: "जीवन रेखा" }) },
    { href: "/palm-signs", label: L({ en: "Palm Signs", hi: "हाथ के शुभ चिह्न" }) },
    { href: "/learn-palmistry", label: L({ en: "Learn Palmistry", hi: "हस्तरेखा पढ़ना सीखें" }) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="mx-auto grid min-h-[calc(100vh-106px)] max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pt-0">
        <motion.div style={{ y: yScene, scale: scaleScene }} className="relative order-1 px-4 pt-4 sm:px-8 lg:order-2 lg:px-2">
          <div className="absolute inset-[12%] rounded-full bg-mystic-600/30 blur-[90px]" />
          <div className="absolute inset-[30%] rounded-full bg-gold-400/15 blur-[60px]" />
          <Navagraha />
        </motion.div>

        <motion.div className="relative z-10 order-2 lg:order-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-wrap items-center gap-2.5">
            {/* The first thing a visitor reads: the reading is free. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-[0_0_28px_-8px] shadow-emerald-400/60">
              <Gift className="h-4 w-4 text-emerald-300" /> {t.hero.freeBadge}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium text-gold-300">
              <Sparkles className="h-3.5 w-3.5" /> {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-3xl font-bold leading-[1.2] text-white sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            <span className="block">{t.hero.title1}</span>
            <span className="gold-text block animate-shimmer">{t.hero.title2}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {t.hero.sub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/reading" className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base">
              {t.hero.cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/rashi" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-base text-slate-100 transition hover:border-gold-400/50 hover:text-gold-300">
              {t.hero.cta2}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Link
              href="/rashifal"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold-300 transition hover:text-gold-200"
            >
              <Sparkles className="h-4 w-4" />
              {L({ en: "Aaj Ka Rashifal — today, tomorrow & this week", hi: "आज का राशिफल — आज, कल और इस हफ़्ते" })}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition hover:text-emerald-100"
            >
              <MessageCircle className="h-4 w-4" />
              {L({ en: "Ask the AI Jyotishi", hi: "AI ज्योतिषी से पूछें" })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 sm:text-sm"
          >
            <span className="text-slate-500">{L({ en: "New here? Start with:", hi: "नए हैं? पहले पढ़ें:" })}</span>
            {guides.map((g, i) => (
              <span key={g.href} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-slate-600">·</span>}
                <Link href={g.href} className="text-gold-300 underline-offset-4 hover:underline">
                  {g.label}
                </Link>
              </span>
            ))}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-10 grid grid-cols-4 gap-3 sm:max-w-md">
            {stats.map((s) => (
              <div key={s.l} className="glass rounded-2xl px-3 py-3 text-center">
                <p className="font-display text-2xl font-semibold text-gold-300">{s.v}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-slate-400">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="pointer-events-none absolute inset-x-0 bottom-5 hidden flex-col items-center gap-1 text-xs text-slate-500 lg:flex">
        <span>{t.hero.scroll}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
