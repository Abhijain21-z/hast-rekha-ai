"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, Sparkles, Sunrise } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { rashiAt } from "@/lib/content";
import {
  RASHIFAL_PERIODS,
  formatRashifalDate,
  formatRashifalWeek,
  rashifalFor,
  type RashifalPeriod,
} from "@/lib/rashifal";

const UI = {
  eyebrow: { en: "Aaj · Kal · Is Hafte", hi: "आज · कल · इस हफ़्ते" },
  title: { en: "Your Rashifal, three ways", hi: "आपका राशिफल, तीन नज़रों में" },
  sub: {
    en: "Personalised from the birth details you entered — your Moon sign, not a generic sun-sign feed.",
    hi: "आपके दर्ज जन्म विवरण से — आपकी चंद्र राशि के आधार पर, सामान्य सूर्य-राशि वाले राशिफल से अलग।",
  },
  yourSign: { en: "Your Moon sign", hi: "आपकी चंद्र राशि" },
  full: { en: "Open full rashifal", hi: "पूरा राशिफल खोलें" },
  details: { en: "Detailed view below", hi: "नीचे विस्तृत रूप देखें" },
  mood: { en: "Mood", hi: "मन" },
  lucky: { en: "Lucky", hi: "शुभ" },
};

const ICONS: Record<RashifalPeriod, typeof Sunrise> = {
  today: Sunrise,
  tomorrow: Sparkles,
  week: CalendarRange,
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55 },
};

export default function RashifalTrinity({
  rashiIndex,
  fullName,
}: {
  rashiIndex: number;
  fullName?: string;
}) {
  const { L, lang } = useLang();
  const rashi = rashiAt(rashiIndex);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const periods = useMemo(
    () =>
      RASHIFAL_PERIODS.map((period) => {
        const data = rashifalFor(rashiIndex, period.key, now);
        const date =
          period.key === "week" && data.weekStartKey && data.weekEndKey
            ? formatRashifalWeek(data.weekStartKey, data.weekEndKey, lang)
            : formatRashifalDate(data.dateKey, lang, { weekday: true });
        return { ...period, data, date };
      }),
    [rashiIndex, now, lang],
  );

  const firstName = fullName?.trim().split(/\s+/)[0];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-400/90">
            <Sparkles className="h-3.5 w-3.5" /> {rashi.symbol} {L(UI.eyebrow)}
          </p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
            {firstName ? `${firstName}, ` : ""}
            {L(UI.title)}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{L(UI.sub)}</p>
          <p className="mt-2 text-xs text-gold-200/80">
            {L(UI.yourSign)}: {L(rashi.short)} · {L(rashi.name)}
          </p>
        </div>
        <Link
          href={`/rashifal?sign=${rashi.key}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-2 text-sm text-gold-200 transition hover:border-gold-400/60 hover:bg-gold-400/15"
        >
          {L(UI.full)} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {periods.map((period, index) => {
          const Icon = ICONS[period.key];
          return (
            <motion.article
              key={period.key}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.08 }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-3xl border p-5 sm:p-6",
                period.key === "week"
                  ? "border-gold-400/40 bg-gradient-to-br from-gold-400/15 via-cosmic-800/80 to-mystic-700/20"
                  : "border-white/10 bg-white/[0.035]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300/90">
                    <Icon className="h-3.5 w-3.5" /> {L(period.label)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{period.date}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gold-200">
                  {period.data.luckyNumber}
                </span>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-100 sm:text-base">
                {L(period.data.message)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                  {L(UI.mood)}: <span className="text-white">{L(period.data.mood)}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                  {L(UI.lucky)}: <span className="text-gold-200">{L(period.data.luckyColor)}</span>
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">{L(UI.details)}</p>
    </div>
  );
}
