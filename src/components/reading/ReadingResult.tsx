"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Copy, Sparkles, Moon, Sun, Star, ArrowRight, Info, Check, History, BarChart3, TrendingUp, Orbit, ScrollText, Hand, ListChecks, CalendarDays } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Badge, Card, cn } from "@/components/ui";
import { nakshatraAt, rashiAt, PANCHANG, tithiName } from "@/lib/content";
import { byLang } from "@/lib/i18n";
import { formatDegree } from "@/lib/astrology";
import { formatDate, formatTime12, tzLabel, type ReadingDTO } from "@/lib/dto";
import { buildPalmReport, AREAS } from "@/lib/palm";
import { Gauge, LifeGraph, RadarChart, Tilt } from "./ReportCharts";
import PastSection from "./PastSection";
import DetailedSections from "./DetailedSections";
import PalmAnalysis from "./PalmAnalysis";
import MantraSection from "./MantraSection";
import PremiumSection from "./PremiumSection";
import { DonateReminder } from "./DonateReminder";
import ReadingReview from "./ReadingReview";
import ReviewPrompt from "./ReviewPrompt";
import ScrollPrompts from "./ScrollPrompts";
import RashifalPanel from "@/components/rashifal/RashifalPanel";
import { PdfDividerButton, ProGateButton } from "./ProPaywall";
import UpayBookPromo from "@/components/upay/UpayBookPromo";
import { BOOK_PROMO } from "@/lib/flags";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };
const AREA_COLORS = ["#fbbf24", "#fb7185", "#34d399", "#f5c242", "#60a5fa", "#c084fc", "#22d3ee", "#f97316"];

export default function ReadingResult({ reading, guest, backHref }: { reading: ReadingDTO; guest?: boolean; backHref?: string }) {
  const { t, L, lang, cl } = useLang();
  const router = useRouter();
  const r = reading.result;
  const rashi = rashiAt(r.moonRashi);
  const nak = nakshatraAt(r.nakshatra);
  const lagna = rashiAt(r.lagna);
  const sunV = rashiAt(r.sunSignVedic);
  const sunW = rashiAt(r.sunSignWestern);
  // Force text presentation for zodiac glyphs. Windows otherwise renders ♓ as
  // a purple emoji tile with a black border, which looked wrong in the PDF.
  const glyphText = (s: string) => `${s.replace(/\uFE0F/g, "")}\uFE0E`;
  const report = useMemo(
    () => buildPalmReport({ fullName: reading.fullName, birthDate: reading.birthDate, birthTime: reading.birthTime, palmImage: reading.palmImage, result: r }),
    [reading.fullName, reading.birthDate, reading.birthTime, reading.palmImage, r],
  );
  const [copied, setCopied] = useState(false);
  const [tech, setTech] = useState(false);

  // A print-open link forces every reveal section visible before the browser
  // opens the print dialog. Without this, sections below the fold stay at
  // opacity 0 and the saved PDF comes out half-empty.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "1") return;
    document.body.classList.add("hast-print");
    const timer = window.setTimeout(() => window.print(), 1200);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("hast-print");
    };
  }, []);
  // ₹51 "Pro" unlock: gates the PDF download/print buttons and the 5-year roadmap.
  const [pro, setPro] = useState(reading.premium);
  // Refresh the server props after an unlock, so an Ultra purchase reveals the
  // book card and the scroll asks stop for good.
  const unlockPro = () => {
    setPro(true);
    router.refresh();
  };
  const GENDER_LABEL: Record<string, string> = { male: t.form.male, female: t.form.female, trans: t.form.trans };

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
    { id: "sec-rashifal", label: L({ en: "Rashifal", hi: "राशिफल" }), icon: CalendarDays },
    { id: "sec-detailed", label: t.report.detailed, icon: ScrollText },
    { id: "sec-palm", label: t.report.palmFull, icon: Hand },
    { id: "sec-suggest", label: t.report.suggestions, icon: ListChecks },
    { id: "sec-mantra", label: t.mantra.nav, icon: Sparkles },
  ];

  // The printed report opens with a proper cover. Only the details the reader
  // actually supplied (plus the derived birth chart) belong on it.
  const coverFacts: { label: string; value: string }[] = [
    { label: L({ en: "Date of birth", hi: "जन्म तिथि" }), value: formatDate(reading.birthDate, cl) },
    { label: L({ en: "Time of birth", hi: "जन्म समय" }), value: reading.timeUnknown ? "12:00 PM (~)" : formatTime12(reading.birthTime) },
    { label: L({ en: "Place of birth", hi: "जन्म स्थान" }), value: reading.placeName },
    { label: L({ en: "Coordinates", hi: "निर्देशांक" }), value: `${reading.latitude.toFixed(2)}, ${reading.longitude.toFixed(2)}` },
    { label: L({ en: "Time zone", hi: "समय क्षेत्र" }), value: tzLabel(reading.tzOffset) },
    { label: L({ en: "Moon sign", hi: "चंद्र राशि" }), value: `${L(rashi.name)} (${glyphText(rashi.symbol)})` },
    { label: L({ en: "Nakshatra", hi: "नक्षत्र" }), value: `${L(nak.name)} · ${t.result.pada} ${r.pada}` },
    { label: L({ en: "Ascendant", hi: "लग्न" }), value: L(lagna.name) },
  ];
  if (reading.gender) {
    coverFacts.push({ label: L({ en: "Gender", hi: "लिंग" }), value: GENDER_LABEL[reading.gender] ?? reading.gender });
  }
  if (reading.married !== null) {
    coverFacts.push({ label: L({ en: "Marital status", hi: "वैवाहिक स्थिति" }), value: reading.married ? t.form.marriedYes : t.form.marriedNo });
  }
  const coverSections = [
    ...nav.filter((n) => n.id !== "sec-rashifal").map((n) => n.label),
    t.premium.title || L({ en: "Five-year roadmap", hi: "पाँच वर्षीय रोडमैप" }),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="print-cover glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="screen-cover relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
              {reading.gender && <Badge>{GENDER_LABEL[reading.gender]}</Badge>}
              {reading.married !== null && <Badge>{reading.married ? t.form.marriedYes : t.form.marriedNo}</Badge>}
            </div>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:border-gold-400/50">
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />} {copied ? t.result.copied : t.result.share}
            </button>
            <ProGateButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} label={t.result.print} icon="print" />
            <Link href={backHref ?? "/reading"} className="btn-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
              {backHref ? t.result.backDash : t.result.newReading} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Print-only cover: clean A4 first page, with the details the reader
            supplied and a short contents list. Hidden on the website. */}
        <div className="print-only print-cover-sheet">
          <p className="print-cover-kicker">HAST REKHA AI · VEDIC ASTROLOGY</p>
          <p className="print-cover-label">{t.result.preparedFor}</p>
          <h1 className="print-cover-name">{reading.fullName}</h1>
          <p className="print-cover-title">✦ {t.result.title}</p>
          <div className="print-cover-rule" />
          <dl className="print-cover-details">
            {coverFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="print-cover-contents">
            <p className="print-cover-contents-title">{L({ en: "Inside this report", hi: "इस रिपोर्ट में" })}</p>
            <ol>
              {coverSections.map((label, i) => (
                <li key={`${label}-${i}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
          <p className="print-cover-note">
            {L({
              en: "Private & confidential · Prepared from the birth details and palm inputs supplied by the reader.",
              hi: "निजी और गोपनीय · पाठक द्वारा दी गई जन्म जानकारी और हस्तरेखा के आधार पर तैयार।",
            })}
          </p>
          <p className="print-cover-id">Report ID · {reading.id} &nbsp;|&nbsp; Generated · {formatDate(reading.createdAt.slice(0, 10), cl)}</p>
        </div>
      </motion.div>

      {guest && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="no-print mt-4 flex flex-col items-start gap-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4 text-sm text-gold-100 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> {t.result.guestSave}</span>
          <Link href={`/register?next=/reading/${reading.id}`} className="btn-gold rounded-full px-4 py-2 text-xs">{t.auth.register}</Link>
        </motion.div>
      )}

      {/* Big three */}
      <div className="print-only print-overview-heading">
        <p className="print-section-kicker">{L({ en: "Your birth chart", hi: "आपकी जन्म कुंडली" })}</p>
        <h2>{L({ en: "At a glance", hi: "एक नज़र में" })}</h2>
        <p className="print-section-intro">
          {L({
            en: "The three anchors of your reading: your Moon sign, birth Nakshatra, and Ascendant.",
            hi: "आपकी रीडिंग के तीन आधार: चंद्र राशि, जन्म नक्षत्र और लग्न।",
          })}
        </p>
      </div>
      <div className="print-overview mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: t.result.moonSign, glyph: glyphText(rashi.symbol), name: L(rashi.name), sub: `${formatDegree(r.moonDegree)} · ${t.result.lord}: ${L(rashi.lord)}`, extra: `${t.result.element}: ${L(rashi.element)}`, icon: Moon, delay: 0 },
          { label: t.result.nakshatra, glyph: "✦", name: L(nak.name), sub: `${t.result.pada} ${r.pada} · ${t.result.lord}: ${L(nak.lord)}`, extra: `${t.result.deity}: ${L(nak.deity)} · ${t.result.symbol}: ${L(nak.symbol)}`, icon: Star, delay: 0.1 },
          { label: t.result.lagna, glyph: glyphText(lagna.symbol), name: L(lagna.name), sub: `${formatDegree(r.lagnaDegree)} · ${t.result.lord}: ${L(lagna.lord)}`, extra: `${t.result.element}: ${L(lagna.element)}`, icon: Sun, delay: 0.2 },
        ].map((c) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 30, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15 + c.delay, duration: 0.6 }} style={{ transformPerspective: 900 }}>
            <Tilt>
              <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
                <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-mystic-600/20 blur-2xl" />
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><c.icon className="h-3.5 w-3.5 text-gold-300" /> {c.label}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="zodiac-glyph font-display text-6xl leading-none text-gold-300 drop-shadow-[0_0_16px_rgba(245,194,66,0.55)]">{c.glyph}</span>
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
      <motion.div {...reveal} className="print-overview-meta mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          [t.result.sunVedic, `${glyphText(sunV.symbol)} ${L(sunV.short)}`],
          [t.result.sunWestern, `${glyphText(sunW.symbol)} ${L(sunW.short)}`],
          [t.result.tithi, tithiName(r.tithi, cl), L(PANCHANG.paksha[r.paksha])],
          [t.result.yoga, byLang<string[]>(PANCHANG.yogas, cl)[r.yoga]],
          [t.result.weekday, byLang<string[]>(PANCHANG.weekdays, cl)[r.weekday]],
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
      <div className="print-section-start mt-10"><PastSection items={report.past} /></div>

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

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

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

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

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

      {/* Rashi insights */}
      <section id="sec-rashi" className="mt-14 scroll-mt-28">
        <div className="print-only print-section-heading">
          <p className="print-section-kicker">{L({ en: "Moon sign & nakshatra", hi: "चंद्र राशि और नक्षत्र" })}</p>
          <h2>{L(rashi.name)} · {L(nak.name)}</h2>
          <p className="print-section-intro">
            {L({
              en: "Your emotional signature, birth Nakshatra, and the traditional lucky factors for this Moon sign.",
              hi: "आपका भावनात्मक स्वभाव, जन्म नक्षत्र और इस चंद्र राशि के पारंपरिक शुभ कारक।",
            })}
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div {...reveal}>
            <Card className="h-full p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.result.traits}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {byLang<string[]>(rashi.traits, cl).map((tr) => (
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

      <section id="sec-rashifal" className="mt-14 scroll-mt-28">
        <RashifalPanel rashiIndex={r.moonRashi} fullName={reading.fullName} showFullLink />
      </section>

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

      {/* 4. Detailed sections */}
      <div className="print-section-start mt-14"><DetailedSections report={report} rashi={rashi} readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} /></div>

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

      {/* 5. Palm analysis */}
      <div className="print-section-start mt-14"><PalmAnalysis report={report} palmImage={reading.palmImage} palmHand={reading.palmHand} /></div>

      <PdfDividerButton readingId={reading.id} unlocked={pro} onUnlocked={unlockPro} />

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
        {BOOK_PROMO && <UpayBookPromo />}
      </section>

      {/* 7. Pro-only secret mantra + gupt prayog (hidden until unlocked) */}
      <MantraSection reading={reading} unlocked={pro} onUnlocked={unlockPro} />

      {/* 8. Premium 5-year report */}
      <div className="print-section-start mt-14"><PremiumSection reading={reading} unlocked={pro} onUnlocked={unlockPro} /></div>

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

      {/* 8. Review ask — feeds the home carousel and the Reviews page */}
      <ReadingReview defaultName={reading.fullName} readingId={reading.id} />

      {/* 9. Once the whole prediction has been read (page end), ask gently — never mid-read. */}
      <ReviewPrompt readingId={reading.id} defaultName={reading.fullName} />

      {/* 10. Scroll asks — the complete PDF after every 4th scroll, the book once after the 6th. */}
      <ScrollPrompts readingId={reading.id} unlocked={pro} ultra={reading.ultra} onUnlocked={unlockPro} />

      <DonateReminder enabled />
    </div>
  );
}
