"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CalendarRange,
  Coins,
  Compass,
  Heart,
  Sparkles,
  Sunrise,
} from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { rashiAt, type PredictionKey } from "@/lib/content";
import {
  RASHIFAL_PERIODS,
  formatRashifalDate,
  formatRashifalWeek,
  rashifalFor,
  type RashifalPeriod,
} from "@/lib/rashifal";

const UI = {
  eyebrow: { en: "Daily, tomorrow & weekly", hi: "आज, कल और इस हफ़्ते" },
  title: { en: "Your Rashifal", hi: "आपका राशिफल" },
  sub: {
    en: "A practical, sign-based guide for the day ahead and the week ahead.",
    hi: "आने वाले दिन और हफ़्ते के लिए आपकी राशि पर आधारित व्यावहारिक मार्गदर्शन।",
  },
  focus: { en: "Focus", hi: "फोकस" },
  remedy: { en: "Simple upay", hi: "आसान उपाय" },
  luckyDay: { en: "Lucky day", hi: "शुभ दिन" },
  full: { en: "Full rashifal", hi: "पूरा राशिफल" },
  yourSign: { en: "Your sign", hi: "आपकी राशि" },
};

const AREA_ICONS: Record<PredictionKey, typeof Briefcase> = {
  career: Briefcase,
  love: Heart,
  health: Activity,
  finance: Coins,
};

const AREA_ORDER: PredictionKey[] = ["career", "love", "health", "finance"];

interface Props {
  rashiIndex: number;
  fullName?: string;
  defaultPeriod?: RashifalPeriod;
  showHeading?: boolean;
  showFullLink?: boolean;
  compact?: boolean;
}

export default function RashifalPanel({
  rashiIndex,
  fullName,
  defaultPeriod = "today",
  showHeading = true,
  showFullLink = true,
  compact = false,
}: Props) {
  const { t, L, lang } = useLang();
  const rashi = rashiAt(rashiIndex);
  const [period, setPeriod] = useState<RashifalPeriod>(defaultPeriod);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const data = useMemo(() => rashifalFor(rashiIndex, period, now), [rashiIndex, period, now]);
  const dateText =
    period === "week" && data.weekStartKey && data.weekEndKey
      ? formatRashifalWeek(data.weekStartKey, data.weekEndKey, lang)
      : formatRashifalDate(data.dateKey, lang, { weekday: true, year: true });
  const firstName = fullName?.trim().split(/\s+/)[0];

  return (
    <section className={cn("relative", compact ? "mt-5" : "mt-10")}>
      {showHeading && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-400/90">
              <Sparkles className="h-3.5 w-3.5" /> {rashi.symbol} {L(UI.eyebrow)}
            </p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              {firstName ? `${firstName}, ` : ""}
              {L(UI.title)}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{L(UI.sub)}</p>
          </div>
          {showFullLink && (
            <Link
              href={`/rashifal?sign=${rashi.key}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/35 bg-gold-400/10 px-4 py-2 text-sm text-gold-200 transition hover:border-gold-400/60 hover:bg-gold-400/15"
            >
              {L(UI.full)} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      <div className="glass-strong overflow-hidden rounded-[2rem] border border-gold-400/20">
        <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-gold-400/10 via-mystic-600/10 to-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 font-display text-3xl text-gold-300">
              {rashi.symbol}
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
                {L(UI.yourSign)} · {L(rashi.short)}
              </p>
              <p className="text-sm font-medium text-white">{dateText}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 rounded-full border border-white/10 bg-black/20 p-1" role="tablist" aria-label={L(UI.title)}>
            {RASHIFAL_PERIODS.map((p) => {
              const active = period === p.key;
              const Icon = p.key === "today" ? Sunrise : p.key === "tomorrow" ? Sparkles : CalendarRange;
              return (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPeriod(p.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                    active ? "bg-gold-400 text-cosmic-950 shadow-sm" : "text-slate-300 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {L(p.label)}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={period}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="p-4 sm:p-6"
          >
            <p className="max-w-4xl text-base leading-relaxed text-slate-100 sm:text-lg">{L(data.message)}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                {t.dash.mood}: <span className="text-white">{L(data.mood)}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                {t.dash.luckyNumber}: <span className="text-gold-200">{data.luckyNumber}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                {t.dash.luckyColor}: <span className="text-white">{L(data.luckyColor)}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
                {L(UI.luckyDay)}: <span className="text-white">{L(data.luckyDay)}</span>
              </span>
            </div>

            <div className={cn("mt-5 grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
              {AREA_ORDER.map((area) => {
                const Icon = AREA_ICONS[area];
                const value = data.scores[area];
                return (
                  <div key={area} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <Icon className="h-3.5 w-3.5 text-gold-300" /> {t.result[area]}
                      </span>
                      <span className="font-display text-sm text-gold-200">{value}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-mystic-400 to-gold-300"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {!compact && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/90">
                    <Compass className="h-3.5 w-3.5" /> {L(UI.focus)}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-200">{L(data.focus)}</p>
                </div>
                <div className="rounded-2xl border border-gold-400/15 bg-gold-400/[0.06] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/90">
                    <Sparkles className="h-3.5 w-3.5" /> {L(UI.remedy)}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-200">{L(data.remedy)}</p>
                </div>
              </div>
            )}

            {showFullLink && !showHeading && (
              <Link
                href={`/rashifal?sign=${rashi.key}`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold-300 transition hover:text-gold-200"
              >
                {L(UI.full)} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
