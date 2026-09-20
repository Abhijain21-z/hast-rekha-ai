"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Heart, Activity, Coins, Sparkles, ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Modal, SectionHeading, Select, Label, Badge, cn } from "@/components/ui";
import { RASHIS, compatibility, dailyHoroscope, type PredictionKey } from "@/lib/content";

const PRED_ICONS = { career: Briefcase, love: Heart, health: Activity, finance: Coins };
const ELEMENT_COLORS: Record<string, string> = {
  Fire: "from-orange-500/30 to-rose-600/20 text-orange-200",
  Earth: "from-emerald-500/30 to-lime-600/20 text-emerald-200",
  Air: "from-sky-500/30 to-cyan-600/20 text-sky-200",
  Water: "from-blue-500/30 to-indigo-600/20 text-blue-200",
};

export default function RashiExplorer() {
  const { t, L, lang, cl } = useLang();
  const params = useSearchParams();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [a, setA] = useState(0);
  const [b, setB] = useState(6);

  useEffect(() => {
    const s = params.get("sign");
    if (s && RASHIS.some((r) => r.key === s)) setOpenKey(s);
  }, [params]);

  const open = RASHIS.find((r) => r.key === openKey);
  const openIndex = RASHIS.findIndex((r) => r.key === openKey);
  const daily = useMemo(() => (openIndex >= 0 ? dailyHoroscope(openIndex) : null), [openIndex]);
  const match = compatibility(a, b);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="✦ Rashi" title={t.rashiPage.title} sub={t.rashiPage.sub} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {RASHIS.map((r, i) => (
          <motion.button
            key={r.key}
            onClick={() => setOpenKey(r.key)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass group relative overflow-hidden rounded-3xl p-5 text-left transition hover:border-gold-400/50 sm:p-6"
          >
            <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl opacity-60", ELEMENT_COLORS[r.element.en])} />
            <span className="block font-display text-5xl text-gold-300 drop-shadow-[0_0_12px_rgba(245,194,66,0.5)] transition-transform group-hover:scale-110 sm:text-6xl">{r.symbol}</span>
            <p className="mt-4 font-display text-lg text-white">{L(r.short)}</p>
            <p className="text-xs text-slate-400">{lang === "hi" ? r.name.en.split(" ")[0] : r.name.hi.split(" ")[0]}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className={cn("rounded-full bg-gradient-to-r px-2.5 py-0.5 text-xs", ELEMENT_COLORS[r.element.en])}>{L(r.element)}</span>
              <span className="rounded-full bg-white/6 px-2.5 py-0.5 text-xs text-slate-300">{L(r.lord)}</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{r.dates}</p>
          </motion.button>
        ))}
      </div>

      {/* Compatibility */}
      <section id="compatibility" className="mt-24 scroll-mt-24">
        <SectionHeading eyebrow="✦ Compatibility" title={t.rashiPage.compat} sub={t.rashiPage.compatSub} />
        <div className="glass-strong mx-auto max-w-3xl rounded-3xl p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <Label>{t.rashiPage.you}</Label>
              <Select value={a} onChange={(e) => setA(Number(e.target.value))}>
                {RASHIS.map((r, i) => (
                  <option key={r.key} value={i}>{r.symbol} {L(r.name)}</option>
                ))}
              </Select>
            </div>
            <div className="hidden pb-3 text-2xl text-gold-300 sm:block">♡</div>
            <div>
              <Label>{t.rashiPage.partner}</Label>
              <Select value={b} onChange={(e) => setB(Number(e.target.value))}>
                {RASHIS.map((r, i) => (
                  <option key={r.key} value={i}>{r.symbol} {L(r.name)}</option>
                ))}
              </Select>
            </div>
          </div>

          <motion.div key={`${a}-${b}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - match.score / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#f5c242" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">{match.score}%</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">{t.rashiPage.score}</p>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-display text-2xl text-gold-300">
                {RASHIS[a].symbol} {L(RASHIS[a].short)} + {RASHIS[b].symbol} {L(RASHIS[b].short)}
              </p>
              <p className="mt-2 text-slate-300">{t.rashiPage.verdicts[match.band]}</p>
              <p className="mt-3 text-xs text-slate-500">
                {L(RASHIS[a].element)} × {L(RASHIS[b].element)} · {L(RASHIS[a].lord)} / {L(RASHIS[b].lord)}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detail modal */}
      <Modal open={!!open} onClose={() => setOpenKey(null)} wide>
        {open && (
          <div>
            <div className="flex flex-wrap items-center gap-5">
              <span className="font-display text-7xl text-gold-300 drop-shadow-[0_0_18px_rgba(245,194,66,0.6)]">{open.symbol}</span>
              <div>
                <h3 className="font-display text-3xl text-white">{L(open.name)}</h3>
                <p className="text-sm text-slate-400">{t.rashiPage.dates}: {open.dates}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>{t.result.element}: {L(open.element)}</Badge>
                  <Badge>{t.result.lord}: {L(open.lord)}</Badge>
                  <Badge>{t.result.quality}: {L(open.quality)}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {open.traits[cl].map((tr) => (
                <span key={tr} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">{tr}</span>
              ))}
            </div>

            {daily && (
              <div className="mt-6 rounded-2xl border border-gold-400/25 bg-gradient-to-r from-gold-400/10 to-mystic-600/10 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300"><Sparkles className="h-3.5 w-3.5" /> {t.dash.today}</p>
                <p className="mt-2 text-slate-100">{L(daily.message)}</p>
                <p className="mt-2 text-xs text-slate-400">{t.dash.mood}: {L(daily.mood)} · {t.dash.luckyNumber}: {daily.luckyNumber} · {t.dash.luckyColor}: {L(daily.luckyColor)}</p>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(Object.keys(PRED_ICONS) as PredictionKey[]).map((k) => {
                const Icon = PRED_ICONS[k];
                return (
                  <div key={k} className="glass rounded-2xl p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-gold-300"><Icon className="h-4 w-4" /> {t.result[k]}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{L(open.predictions[k])}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
              {[
                [t.result.color, L(open.lucky.color)],
                [t.result.number, String(open.lucky.number)],
                [t.result.day, L(open.lucky.day)],
                [t.result.gem, L(open.lucky.gem)],
                [t.result.mantra, open.lucky.mantra],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{k}</p>
                  <p className="mt-1 text-slate-100">{v}</p>
                </div>
              ))}
            </div>

            <Link href="/reading" className="btn-gold mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
              {t.nav.getReading} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
