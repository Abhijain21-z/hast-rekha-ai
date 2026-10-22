"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles, Sun } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, cn } from "@/components/ui";
import { RASHIS } from "@/lib/content";
import RashifalPanel from "./RashifalPanel";

const COPY = {
  eyebrow: { en: "✨ Today's Rashifal", hi: "✨ आज का राशिफल" },
  title: { en: "Today, Tomorrow & This Week's Rashifal", hi: "आज, कल और इस हफ़्ते का राशिफल" },
  sub: {
    en: "Choose your sign and read today's, tomorrow's and this week's rashifal in Hindi and English — completely free.",
    hi: "अपनी राशि चुनें और आज, कल और इस हफ़्ते का राशिफल हिंदी और अंग्रेज़ी में पढ़ें — बिल्कुल फ्री।",
  },
  choose: { en: "Choose your sign", hi: "अपनी राशि चुनें" },
  today: { en: "Today's rashifal", hi: "आज का राशिफल" },
  todayText: {
    en: "Mood, career, love, health and finance signals for the day, together.",
    hi: "दिन भर के मूड, करियर, प्रेम, स्वास्थ्य और धन के संकेत एक साथ।",
  },
  tomorrow: { en: "Tomorrow's rashifal", hi: "कल का राशिफल" },
  tomorrowText: {
    en: "Understand tomorrow's important moments and plan your day ahead.",
    hi: "कल के ज़रूरी पल पहले से समझकर अपना दिन प्लान करें।",
  },
  week: { en: "This week's rashifal", hi: "इस हफ़्ते का राशिफल" },
  weekText: {
    en: "Weekly focus, a simple upay and lucky factors — all in one place.",
    hi: "हफ़्ते का फोकस, आसान उपाय और शुभ संकेत — एक ही जगह।",
  },
  readingTitle: { en: "A personal prediction with your kundli", hi: "अपनी कुंडली के साथ पर्सनल प्रेडिक्शन" },
  readingText: {
    en: "A rashifal is a general guide for your sign. A personal Hast Rekha AI reading, built from your birth date, time and place, explains your kundli, nakshatra, lagna and 12 life areas in detail.",
    hi: "राशिफल आपकी राशि का सामान्य मार्गदर्शन है। जन्म तिथि, समय और स्थान के हिसाब से बनी पर्सनल Hast Rekha AI रीडिंग आपकी कुंडली, नक्षत्र, लग्न और 12 जीवन-क्षेत्रों के बारे में विस्तार से बताती है।",
  },
  readingCta: { en: "Get your free personal reading", hi: "फ्री पर्सनल रीडिंग लें" },
  rashiCta: { en: "Explore all 12 rashis", hi: "12 राशियों के बारे में जानें" },
};

export default function RashifalExplorer({ initialIndex = 0 }: { initialIndex?: number }) {
  const { L } = useLang();
  const c = Object.fromEntries(Object.entries(COPY).map(([key, value]) => [key, L(value)])) as Record<keyof typeof COPY, string>;
  const [selected, setSelected] = useState(initialIndex);

  function chooseSign(index: number) {
    setSelected(index);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sign", RASHIS[index].key);
      window.history.replaceState(null, "", url);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="sr-only">Aaj Ka Rashifal, Kal Ka Rashifal Aur Is Hafte Ka Rashifal</h1>
      <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />

      <div className="mt-10">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{c.choose}</p>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {RASHIS.map((r, i) => (
            <motion.button
              key={r.key}
              type="button"
              onClick={() => chooseSign(i)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "glass group rounded-2xl border px-2 py-3.5 text-center transition sm:px-3",
                selected === i
                  ? "border-gold-400/60 bg-gold-400/12 shadow-[0_0_24px_rgba(245,194,66,0.12)]"
                  : "border-white/8 hover:border-gold-400/40",
              )}
              aria-pressed={selected === i}
            >
              <span className="block text-3xl text-gold-300 transition-transform group-hover:scale-110">{r.symbol}</span>
              <span className="mt-1.5 block text-sm font-medium text-white">{L(r.short)}</span>
              <span className="mt-0.5 block text-[10px] text-slate-500">{r.dates}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <RashifalPanel rashiIndex={selected} showHeading={false} showFullLink={false} />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Sun, title: c.today, text: c.todayText },
          { icon: Sparkles, title: c.tomorrow, text: c.tomorrowText },
          { icon: CalendarDays, title: c.week, text: c.weekText },
        ].map((item) => (
          <div key={item.title} className="glass rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-gold-200">
              <item.icon className="h-4 w-4" /> {item.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="glass-strong mt-10 overflow-hidden rounded-[2rem] border border-gold-400/20 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">✨ Personal prediction</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">{c.readingTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.readingText}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
            <Link href="/reading" className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm">
              {c.readingCta} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rashi"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:border-gold-400/40 hover:text-white"
            >
              {c.rashiCta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
