"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Copy, Sparkles, Moon, Sun, Star, ArrowRight, Info, Check, History, BarChart3, TrendingUp, Orbit, ScrollText, Hand, ListChecks } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Badge, Card, cn } from "@/components/ui";
import { nakshatraAt, rashiAt, PANCHANG, tithiName } from "@/lib/content";
import { formatDegree } from "@/lib/astrology";
import { formatDate, formatTime12, tzLabel, type ReadingDTO } from "@/lib/dto";
import { buildPalmReport, AREAS } from "@/lib/palm";
import { Gauge, LifeGraph, RadarChart, Tilt } from "./ReportCharts";
import PastSection from "./PastSection";
import DetailedSections from "./DetailedSections";
import PalmAnalysis from "./PalmAnalysis";
import PremiumSection from "./PremiumSection";
import { DonateReminder, PrintGate } from "./DonateReminder";
import UpayBookPromo from "@/components/upay/UpayBookPromo";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };
const AREA_COLORS = ["#fbbf24", "#fb7185", "#34d399", "#f5c242", "#60a5fa", "#c084fc", "#22d3ee", "#f97316"];

export default function ReadingResult({ reading, guest, backHref }: { reading: ReadingDTO; guest?: boolean; backHref?: string }) {
  const { t, L, lang, cl } = useLang();
  const r = reading.result;
  const rashi = rashiAt(r.moonRashi);
  const nak = nakshatraAt(r.nakshatra);
  const lagna = rashiAt(r.lagna);
  const sunV = rashiAt(r.sunSignVedic);
  const sunW = rashiAt(r.sunSignWestern);
  const report = useMemo(
    () => buildPalmReport({ fullName: reading.fullName, birthDate: reading.birthDate, birthTime: reading.birthTime, palmImage: reading.palmImage, result: r }),
    [reading.fullName, reading.birthDate, reading.birthTime, reading.palmImage, r],
  );
  const [copied, setCopied] = useState(false);
  const [tech, setTech] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const nav = [
    { id: "sec-past", label: t.report.past.split(" — ")[0], icon: History },
    { id: "sec-scores", label: t.report.scores, icon: BarChart3 },
    { id: "sec-graph", label: t.report.graph, icon: TrendingUp },
    { id: "sec-rashi", label: t.result.moonSign, icon: Orbit },
    { id: "sec-detailed", label: t.report.detailed, icon: ScrollText },
    { id: "sec-palm", label: t.report.palmFull, icon: Hand },
    { id: "sec-suggest", label: t.report.suggestions, icon: ListChecks },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.result.title}</p>
            <p className="mt-3 text-sm text-slate-400">{t.result.preparedFor}</p>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">{reading.fullName}</h1>
            <p className="mt-3 text-sm text-slate-300">
              {t.result.born} <span className="text-white">{formatDate(reading.birthDate, cl)}</span> · {t.result.at}{" "}
              <span className="text-white">{reading.timeUnknown ? "12:00 PM (~)" : formatTime12(reading.birthTime)}</span> · {t.result.in}{" "}
              <span className="text-white">{reading.placeName}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Lahiri · {r.ayanamsa.toFixed(2)}°</Badge>
              <Badge>{tzLabel(reading.tzOffset)}</Badge>
              <Badge>{reading.latitude.toFixed(2)}, {reading.longitude.toFixed(2)}</Badge>
              <Badge>{L(report.shape.name)}</Badge>
            </div>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:border-gold-400/50">
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />} {copied ? t.result.copied : t.result.share}
            </button>
            <PrintGate readingName={reading.fullName} />
            <Link href={backHref ?? "/reading"} className="btn-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
              {backHref ? t.result.backDash : t.result.newReading} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {guest && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="no-print mt-4 flex flex-col items-start gap-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4 text-sm text-gold-100 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> {t.result.guestSave}</span>
          <Link href={`/register?next=/reading/${reading.id}`} className="btn-gold rounded-full px-4 py-2 text-xs">{t.auth.register}</Link>
        </motion.div>
      )}

      {/* Big three */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: t.result.moonSign, glyph: rashi.symbol, name: L(rashi.name), sub: `${formatDegree(r.moonDegree)} · ${t.result.lord}: ${L(rashi.lord)}`, extra: `${t.result.element}: ${L(rashi.element)}`, icon: Moon, delay: 0 },
          { label: t.result.nakshatra, glyph: "✦", name: L(nak.name), sub: `${t.result.pada} ${r.pada} · ${t.result.lord}: ${L(nak.lord)}`, extra: `${t.result.deity}: ${L(nak.deity)} · ${t.result.symbol}: ${L(nak.symbol)}`, icon: Star, delay: 0.1 },
          { label: t.result.lagna, glyph: lagna.symbol, name: L(lagna.name), sub: `${formatDegree(r.lagnaDegree)} · ${t.result.lord}: ${L(lagna.lord)}`, extra: `${t.result.element}: ${L(lagna.element)}`, icon: Sun, delay: 0.2 },
        ].map((c) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 30, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15 + c.delay, duration: 0.6 }} style={{ transformPerspective: 900 }}>
            <Tilt>
              <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
                <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-mystic-600/20 blur-2xl" />
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><c.icon className="h-3.5 w-3.5 text-gold-300" /> {c.label}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="font-display text-6xl leading-none text-gold-300 drop-shadow-[0_0_16px_rgba(245,194,66,0.55)]">{c.glyph}</span>
                  <div>
                    <p className="font-display text-2xl text-white">{c.name}</p>
                    <p className="mt-1 text-xs text-slate-300">{c.sub}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">{c.extra}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {/* Panchang */}
      <motion.div {...reveal} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          [t.result.sunVedic, `${sunV.symbol} ${L(sunV.short)}`],
          [t.result.sunWestern, `${sunW.symbol} ${L(sunW.short)}`],
          [t.result.tithi, tithiName(r.tithi, cl), L(PANCHANG.paksha[r.paksha])],
          [t.result.yoga, PANCHANG.yogas[cl][r.yoga]],
          [t.result.weekday, PANCHANG.weekdays[cl][r.weekday]],
          [t.result.moonPhase, `${Math.round(r.moonPhase * 100)}%`],
        ].map(([k, v, s]) => (
          <div key={k} className="glass rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">{k}</p>
            <p className="mt-1 text-sm font-medium text-white">{v}</p>
            {s && <p className="text-xs text-slate-400">{s}</p>}
          </div>
        ))}
      </motion.div>

      {/* Section navigator */}
      <div className="no-print sticky top-[110px] z-30 mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="glass-strong flex w-max min-w-full items-center gap-1 rounded-full p-1.5 sm:w-full">
          <span className="hidden shrink-0 px-3 text-xs uppercase tracking-wider text-slate-400 lg:inline">{t.report.nav}</span>
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-slate-200 transition hover:bg-gold-400/15 hover:text-gold-200">
              <n.icon className="h-3.5 w-3.5 text-gold-300" /> {n.label}
            </a>
          ))}
        </div>
      </div>

      {/* 1. Past */}
      <div className="mt-10"><PastSection items={report.past} /></div>

      {/* 2. Scores */}
      <section id="sec-scores" className="mt-14 scroll-mt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.report.section} 2</p>
        <h2 className="mt-2 font-display text-3xl text-white">{t.report.scores}</h2>
        <p className="mt-1 text-sm text-slate-400">{t.report.scoresSub}</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div {...reveal} className="glass-strong rounded-3xl p-4">
            <RadarChart data={AREAS.map((a) => ({ label: t.report.areas[a], value: report.scores[a] }))} />
          </motion.div>
          <motion.div {...reveal} className="glass grid grid-cols-2 gap-4 rounded-3xl p-6 sm:grid-cols-4">
            {AREAS.map((a, i) => (
              <Gauge key={a} value={report.scores[a]} label={t.report.areas[a]} color={AREA_COLORS[i]} size={96} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Life graph */}
      <section id="sec-graph" className="mt-14 scroll-mt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.report.section} 3</p>
        <h2 className="mt-2 font-display text-3xl text-white">{t.report.graph}</h2>
        <p className="mt-1 text-sm text-slate-400">{t.report.graphSub}</p>
        <motion.div {...reveal} className="glass-strong mt-6 rounded-3xl p-4 sm:p-6">
          <LifeGraph points={report.graph} luckyAges={report.timing.luckyAges} turning={report.timing.turning.map((tp) => ({ age: tp.age, label: L(tp.label) }))} currentAge={report.age} birthYear={report.birthYear} nowLabel={t.report.now} ageLabel={t.report.age} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">{t.report.luckyYears}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.timing.luckyAges.map((a) => (
                  <span key={a} className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-sm text-gold-100">★ {report.birthYear + a} <span className="text-xs text-slate-400">({a})</span></span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">{t.report.turning}</p>
              <div className="mt-2 space-y-1.5">
                {report.timing.turning.map((tp) => (
                  <p key={tp.age} className="text-sm text-slate-200"><span className="text-mystic-400">◆</span> {report.birthYear + tp.age}–{report.birthYear + tp.age + 1} · {L(tp.label)} <span className="text-xs text-slate-500">({tp.age}–{tp.age + 1})</span></p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Rashi insights */}
      <section id="sec-rashi" className="mt-14 scroll-mt-28">
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div {...reveal}>
            <Card className="h-full p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.result.traits}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {rashi.traits[cl].map((tr) => (
                  <span key={tr} className="rounded-full border border-gold-400/25 bg-gold-400/10 px-3.5 py-1.5 text-sm text-gold-100">{tr}</span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-400">{t.result.quality}: {L(rashi.quality)} · {t.result.element}: {L(rashi.element)} · {t.result.lord}: {L(rashi.lord)}</p>
            </Card>
          </motion.div>
          <motion.div {...reveal}>
            <Card className="h-full p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.result.nakInsight}</p>
              <p className="mt-3 font-display text-xl text-white">{L(nak.name)} · {t.result.pada} {r.pada}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{L(nak.trait)}</p>
              <p className="mt-3 text-xs text-slate-400">{t.result.degree}: {formatDegree(r.nakshatraDegree)} / 13°20′</p>
            </Card>
          </motion.div>
          <motion.div {...reveal}>
            <Card strong className="h-full p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.result.lucky}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  [t.result.color, L(rashi.lucky.color)],
                  [t.result.number, String(rashi.lucky.number)],
                  [t.result.day, L(rashi.lucky.day)],
                  [t.result.gem, L(rashi.lucky.gem)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{k}</p>
                    <p className="mt-0.5 text-sm text-white">{v}</p>
                  </div>
                ))}
                <div className="col-span-2 rounded-xl bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t.result.mantra}</p>
                  <p className="mt-0.5 text-sm text-gold-200">{rashi.lucky.mantra}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 4. Detailed sections */}
      <div className="mt-14"><DetailedSections report={report} rashi={rashi} /></div>

      {/* 5. Palm analysis */}
      <div className="mt-14"><PalmAnalysis report={report} palmImage={reading.palmImage} palmHand={reading.palmHand} /></div>

      {/* 6. Suggestions */}
      <section id="sec-suggest" className="mt-14 scroll-mt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.report.section} 6</p>
        <h2 className="mt-2 font-display text-3xl text-white">{t.report.suggestions}</h2>
        <motion.div {...reveal} className="glass-strong mt-6 rounded-3xl p-6 sm:p-8">
          <ol className="grid gap-3 md:grid-cols-2">
            {report.suggestions.map((s, i) => (
              <motion.li key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-display text-sm text-gold-300">{i + 1}</span>
                <p className="text-sm leading-relaxed text-slate-100">{L(s)}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
        <UpayBookPromo />
      </section>

      {/* 7. Premium 5-year report */}
      <div className="mt-14"><PremiumSection reading={reading} /></div>

      {/* Technical */}
      <div className="mt-10">
        <button onClick={() => setTech((v) => !v)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-gold-300">
          <Info className="h-3.5 w-3.5" /> {t.result.technical} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", tech && "rotate-180")} />
        </button>
        <AnimatePresence>
          {tech && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-black/30 p-4 font-mono text-xs text-slate-300 sm:grid-cols-4">
                <span>JD: {r.julianDay}</span>
                <span>Ayanamsa: {r.ayanamsa}°</span>
                <span>GAST: {r.siderealTime}°</span>
                <span>Obliquity: {r.obliquity}°</span>
                <span>☉ trop: {r.tropical.sun}°</span>
                <span>☽ trop: {r.tropical.moon}°</span>
                <span>Asc trop: {r.tropical.ascendant}°</span>
                <span>Engine: {r.engine}</span>
                <span>☉ sid: {r.sidereal.sun}°</span>
                <span>☽ sid: {r.sidereal.moon}°</span>
                <span>Asc sid: {r.sidereal.ascendant}°</span>
                <span>Palm seed: {report.seed.toString(16)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-center text-xs italic text-slate-500">{t.result.disclaimer}</p>

      <DonateReminder enabled />
    </div>
  );
}
