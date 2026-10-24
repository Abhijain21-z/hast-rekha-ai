"use client";

/**
 * Advanced Vedic chart panel.
 *
 * Pure presentation: every value arrives pre-computed in `readings.result.advanced`.
 * This file must never import the ephemeris or engine modules — it ships to the
 * browser, and VSOP87 belongs on the server only.
 */
import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Grid3X3,
  Hash,
  Star,
  TrendingUp,
} from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { rashiAt } from "@/lib/content";
import { formatDegree } from "@/lib/format-degree";
import type { AdvancedChart, DashaPeriod, Graha, VargaChart } from "@/lib/astro/types";

const GLYPH: Record<Graha, string> = {
  sun: "☉",
  moon: "☽",
  mars: "♂",
  mercury: "☿",
  jupiter: "♃",
  venus: "♀",
  saturn: "♄",
  rahu: "☊",
  ketu: "☋",
};

/** Force the text glyph instead of a colour emoji (matches the rest of the report). */
const glyph = (key: Graha) => `${GLYPH[key]}\uFE0E`;
const rashiSymbol = (sign: number) => `${rashiAt(sign).symbol.replace(/\uFE0F/g, "")}\uFE0E`;

const DASHA_LORD_COLOR: Record<Graha, string> = {
  sun: "text-orange-300",
  moon: "text-slate-200",
  mars: "text-rose-300",
  mercury: "text-emerald-300",
  jupiter: "text-amber-300",
  venus: "text-pink-300",
  saturn: "text-sky-300",
  rahu: "text-violet-300",
  ketu: "text-teal-300",
};

function scoreTone(score: number) {
  if (score >= 70) return "from-emerald-500 to-emerald-300";
  if (score >= 45) return "from-gold-500 to-gold-300";
  return "from-rose-500 to-rose-300";
}

function StrengthBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-white/10", className)}>
      <div className={cn("h-full rounded-full bg-gradient-to-r", scoreTone(value))} style={{ width: `${Math.min(100, Math.max(2, value))}%` }} />
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {kicker}</p>
      <h3 className="mt-1.5 font-display text-2xl text-white">{title}</h3>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

/** 12-sign mini chart for one varga. Houses run clockwise from the varga lagna. */
function VargaMiniChart({ varga }: { varga: VargaChart }) {
  const { L } = useLang();
  const bySign = useMemo(() => {
    const map = new Map<number, Graha[]>();
    for (const [key, sign] of Object.entries(varga.planets) as [Graha, number][]) {
      map.set(sign, [...(map.get(sign) ?? []), key]);
    }
    return map;
  }, [varga]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-white">{L(varga.name)}</p>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">{L(varga.name).split(" ").slice(-1)}</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }, (_, i) => {
          const sign = (varga.lagna + i) % 12;
          const rashi = rashiAt(sign);
          const planets = bySign.get(sign) ?? [];
          return (
            <div
              key={i}
              className={cn(
                "min-h-[52px] rounded-lg border px-1.5 py-1 text-center",
                i === 0 ? "border-gold-400/50 bg-gold-400/10" : "border-white/8 bg-white/[0.03]",
              )}
            >
              <p className="text-[10px] leading-none text-slate-400">
                {i + 1} · <span className="text-gold-300">{rashiSymbol(sign)}</span>
              </p>
              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-200">{L(rashi.short)}</p>
              <p className="mt-0.5 text-[13px] leading-none text-gold-200">
                {planets.length > 0 ? planets.map(glyph).join(" ") : "·"}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-2 truncate text-[10px] text-slate-500">
        {L({ en: "Lagna", hi: "लग्न" })}: {L(rashiAt(varga.lagna).name)} · {Object.keys(varga.planets).length} {L({ en: "grahas", hi: "ग्रह" })}
      </p>
    </div>
  );
}

function DashaRow({ period }: { period: DashaPeriod }) {
  const { L } = useLang();
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border px-3 py-2",
        period.current ? "border-gold-400/40 bg-gold-400/10" : "border-white/8 bg-white/[0.02]",
      )}
    >
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-base", DASHA_LORD_COLOR[period.lord])}>
        {glyph(period.lord)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {L(period.lordName)} <span className="text-xs font-normal text-slate-400">mahadasha</span>
          {period.current && <span className="ml-2 rounded-full bg-gold-400/20 px-2 py-0.5 text-[10px] font-semibold text-gold-200">{L({ en: "running", hi: "चालू" })}</span>}
        </p>
        <p className="text-[11px] text-slate-500">
          {period.start} → {period.end}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-300">{period.years.toFixed(2)}y</p>
        <p className="text-[10px] text-slate-500">{L({ en: "total", hi: "कुल" })}</p>
      </div>
    </div>
  );
}

export default function AdvancedChartPanel({ chart, timeUnknown }: { chart: AdvancedChart; timeUnknown?: boolean }) {
  const { L } = useLang();
  const p = useMemo(() => new Map(chart.planets.map((x) => [x.key, x])), [chart.planets]);
  const planetName = (key: Graha) => (p.get(key) ? L(p.get(key)!.name) : key);

  const benefics = chart.yogas.filter((y) => y.type === "benefic");
  const challenging = chart.yogas.filter((y) => y.type === "challenging");
  const keyVargas = ["D1", "D9", "D10"].map((key) => chart.vargas.find((v) => v.key === key)).filter((v): v is VargaChart => !!v);

  const panchangItems: { label: string; value: string; sub?: string }[] = [
    { label: L({ en: "Tithi", hi: "तिथि" }), value: `${chart.panchang.tithi} · ${L(chart.panchang.tithiName)}`, sub: chart.panchang.paksha === "shukla" ? L({ en: "Shukla paksha", hi: "शुक्ल पक्ष" }) : L({ en: "Krishna paksha", hi: "कृष्ण पक्ष" }) },
    { label: L({ en: "Nakshatra", hi: "नक्षत्र" }), value: L(chart.panchang.nakshatraName), sub: `${L({ en: "No.", hi: "क्रम" })} ${chart.panchang.nakshatra + 1} / 27` },
    { label: L({ en: "Yoga", hi: "योग" }), value: L(chart.panchang.yogaName), sub: `${L({ en: "No.", hi: "क्रम" })} ${chart.panchang.yoga + 1} / 27` },
    { label: L({ en: "Karana", hi: "करण" }), value: L(chart.panchang.karanaName), sub: `${L({ en: "half-tithi", hi: "अर्ध-तिथि" })} ${chart.panchang.karana + 1} / 60` },
    { label: L({ en: "Vara", hi: "वार" }), value: L(chart.panchang.varaName) },
    { label: L({ en: "Hora", hi: "होरा" }), value: `${glyph(chart.panchang.hora)} ${L(chart.panchang.horaName)}`, sub: L({ en: "birth-hour lord", hi: "जन्म-घंटे का स्वामी" }) },
    { label: L({ en: "Sunrise", hi: "सूर्योदय" }), value: chart.panchang.sunrise ?? "—", sub: L({ en: "approx. ±3 min", hi: "लगभग ±3 मिनट" }) },
    { label: L({ en: "Sunset", hi: "सूर्यास्त" }), value: chart.panchang.sunset ?? "—" },
    { label: L({ en: "Lunar month", hi: "चांद्र मास" }), value: L(chart.panchang.lunarMonth) },
    { label: L({ en: "Vikram Samvat", hi: "विक्रम संवत" }), value: String(chart.panchang.samvat) },
    { label: L({ en: "Ritu", hi: "ऋतु" }), value: L(chart.panchang.ritu) },
    { label: L({ en: "Moon phase", hi: "चंद्र कला" }), value: `${Math.round(chart.panchang.moonPhase * 100)}%`, sub: chart.panchang.dayBirth ? L({ en: "day birth", hi: "दिन का जन्म" }) : L({ en: "night birth", hi: "रात का जन्म" }) },
  ];

  const loShuOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const loShuCount = (n: number) => chart.numerology.loShu.find((x) => x.number === n)?.count ?? 0;

  return (
    <section id="sec-kundli" className="mt-14 scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead
          kicker={L({ en: "Advanced kundli", hi: "विस्तृत कुंडली" })}
          title={L({ en: "The full calculation set", hi: "पूरी गणना" })}
          sub={L({
            en: "Nine grahas, twelve bhavas, sixteen vargas, Vimshottari dasha, yogas, today's gochara and numerology — computed locally with VSOP87B and Lahiri ayanamsa.",
            hi: "नौ ग्रह, बारह भाव, सोलह वर्ग, विंशोत्तरी दशा, योग, आज का गोचर और अंकशास्त्र — VSOP87B और लाहिरी अयनांश से स्थानीय गणना।",
          })}
        />
        <div className="flex shrink-0 flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 font-semibold text-gold-200">VSOP87B</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">Lahiri {chart.ayanamsa.toFixed(2)}°</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">v{chart.version}</span>
        </div>
      </div>

      {timeUnknown && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {L({
            en: "Birth time was marked unknown, so the ascendant, houses and dasha dates are approximate. The Moon sign and nakshatra remain reliable.",
            hi: "जन्म समय अज्ञात है, इसलिए लग्न, भाव और दशा तिथियाँ अनुमानित हैं। चंद्र राशि और नक्षत्र विश्वसनीय रहते हैं।",
          })}
        </p>
      )}

      {/* 1. Graha positions */}
      <div className="mt-6">
        <SectionHead kicker={L({ en: "Graha positions", hi: "ग्रह स्थिति" })} title={L({ en: "Nine grahas in the sidereal zodiac", hi: "निरयन राशि चक्र में नौ ग्रह" })} />
        <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-white/[0.06] text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-3 py-2.5">{L({ en: "Graha", hi: "ग्रह" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Rashi", hi: "राशि" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Degree", hi: "अंश" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Nakshatra", hi: "नक्षत्र" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Bhava", hi: "भाव" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Dignity", hi: "अवस्था" })}</th>
                <th className="px-3 py-2.5">{L({ en: "Strength", hi: "बल" })}</th>
              </tr>
            </thead>
            <tbody>
              {chart.planets.map((planet) => {
                const strength = chart.strengths.find((s) => s.key === planet.key)?.score ?? 50;
                return (
                  <tr key={planet.key} className="border-t border-white/6 align-top">
                    <td className="px-3 py-2.5">
                      <p className="flex items-center gap-2 font-medium text-white">
                        <span className="text-base text-gold-300">{glyph(planet.key)}</span> {L(planet.name)}
                      </p>
                      <p className="mt-0.5 flex flex-wrap gap-1 text-[9px]">
                        {planet.retrograde && planet.key !== "rahu" && planet.key !== "ketu" && <span className="rounded bg-sky-400/15 px-1.5 py-0.5 text-sky-200">{L({ en: "retro", hi: "वक्री" })}</span>}
                        {planet.combust && <span className="rounded bg-rose-400/15 px-1.5 py-0.5 text-rose-200">{L({ en: "combust", hi: "अस्त" })}</span>}
                        {planet.vargottama && <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-200">vargottama</span>}
                        {planet.gandanta && <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-amber-200">gandanta</span>}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 text-slate-200">
                      <span className="text-gold-300">{rashiSymbol(planet.sign)}</span> {L(rashiAt(planet.sign).short)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-300">{formatDegree(planet.degreeInSign)}</td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {L({ en: `Nak ${planet.nakshatra + 1}`, hi: `नक्ष ${planet.nakshatra + 1}` })}
                      <span className="ml-1 text-slate-500">· {L({ en: "pada", hi: "पाद" })} {planet.pada}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-200">{planet.house}</td>
                    <td className="px-3 py-2.5 text-slate-300">{L(planet.dignityLabel)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-right font-mono text-[11px] text-slate-300">{strength}</span>
                        <StrengthBar value={strength} className="w-16" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Bhavas */}
      <div className="mt-8">
        <SectionHead kicker={L({ en: "Twelve bhavas", hi: "बारह भाव" })} title={L({ en: "Whole-sign houses", hi: "राशि-आधारित भाव" })} sub={L({ en: "Each house is the sign that follows the lagna; strength blends occupants with the house lord.", hi: "हर भाव लग्न के बाद की राशि है; बल भाव में बैठे ग्रह और भावेश से बनता है।" })} />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {chart.houses.map((house) => (
            <div key={house.house} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {L({ en: "House", hi: "भाव" })} {house.house}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    <span className="text-gold-300">{rashiSymbol(house.sign)}</span> {L(house.signName)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {L({ en: "Lord", hi: "स्वामी" })}: <span className="text-slate-300">{planetName(house.lord)}</span>
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">{house.strength}</span>
              </div>
              <div className="mt-2 flex min-h-[18px] flex-wrap gap-1">
                {house.occupants.length > 0 ? (
                  house.occupants.map((key) => (
                    <span key={key} className="rounded bg-gold-400/10 px-1.5 py-0.5 text-[10px] text-gold-100">
                      {glyph(key)} {planetName(key)}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] italic text-slate-600">{L({ en: "empty", hi: "रिक्त" })}</span>
                )}
              </div>
              <StrengthBar value={house.strength} className="mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Panchang */}
      <div className="mt-8">
        <SectionHead kicker={L({ en: "Panchang", hi: "पंचांग" })} title={L({ en: "The five limbs of the birth day", hi: "जन्म दिन के पाँच अंग" })} />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {panchangItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="mt-0.5 text-sm font-medium text-white">{item.value}</p>
              {item.sub && <p className="text-[10px] text-slate-500">{item.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Dasha */}
      <div className="mt-8">
        <SectionHead
          kicker={L({ en: "Vimshottari dasha", hi: "विंशोत्तरी दशा" })}
          title={L({ en: "Your running planetary periods", hi: "आपकी चालू ग्रह-दशाएँ" })}
          sub={L({
            en: `Moon nakshatra ${chart.dasha.moonNakshatra + 1} gives ${planetName(chart.dasha.moonLord)} as the birth lord; ${chart.dasha.balanceAtBirth.years} years of that dasha remained at birth.`,
            hi: `चंद्र नक्षत्र ${chart.dasha.moonNakshatra + 1} से जन्म-स्वामी ${planetName(chart.dasha.moonLord)}; जन्म पर उस दशा के ${chart.dasha.balanceAtBirth.years} वर्ष शेष थे।`,
          })}
        />
        {chart.dasha.current && (
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              { level: L({ en: "Mahadasha", hi: "महादशा" }), period: chart.dasha.current.maha },
              { level: L({ en: "Antardasha", hi: "अंतर्दशा" }), period: chart.dasha.current.antar },
              { level: L({ en: "Pratyantardasha", hi: "प्रत्यंतर्दशा" }), period: chart.dasha.current.pratyantar },
            ].map(({ level, period }) => (
              <div key={level} className="rounded-2xl border border-gold-400/25 bg-gold-400/[0.07] p-3">
                <p className="text-[10px] uppercase tracking-wider text-gold-300">{level}</p>
                <p className={cn("mt-1 flex items-center gap-2 font-display text-lg", DASHA_LORD_COLOR[period.lord])}>
                  <span className="text-xl">{glyph(period.lord)}</span> {L(period.lordName)}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {period.start} → {period.end}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 space-y-1.5">
          {chart.dasha.mahadashas.map((period) => (
            <DashaRow key={`${period.lord}-${period.start}`} period={period} />
          ))}
        </div>
      </div>

      {/* 5. Yogas */}
      <div className="mt-8">
        <SectionHead
          kicker={L({ en: "Yogas & doshas", hi: "योग और दोष" })}
          title={L({ en: "Combinations actually present in this chart", hi: "इस कुंडली में बने संयोग" })}
          sub={L({
            en: `${benefics.length} supportive and ${challenging.length} testing combinations were found. Challenging yogas are shown with a practical remedy, never as a verdict.`,
            hi: `${benefics.length} शुभ और ${challenging.length} परीक्षा देने वाले संयोग मिले। कठिन योगों के साथ व्यावहारिक उपाय दिया है, कोई निर्णय नहीं।`,
          })}
        />
        {chart.yogas.length === 0 ? (
          <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-400">
            {L({ en: "No major classical yoga or dosha met its full conditions in this chart — a clean, uncomplicated placement.", hi: "इस कुंडली में कोई प्रमुख शास्त्रीय योग या दोष पूरी शर्तों के साथ नहीं बना — सरल और स्पष्ट स्थिति।" })}
          </p>
        ) : (
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {[...benefics, ...challenging].map((yoga) => {
              const good = yoga.type === "benefic";
              return (
                <div key={yoga.key} className={cn("rounded-2xl border p-3.5", good ? "border-emerald-300/20 bg-emerald-400/[0.05]" : "border-amber-300/20 bg-amber-400/[0.05]")}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      {good ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />}
                      {L(yoga.name)}
                    </p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", good ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200")}>{yoga.strength}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{L(yoga.description)}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {L({ en: "Houses", hi: "भाव" })}: {yoga.houses.join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Gochara */}
      <div className="mt-8">
        <SectionHead
          kicker={L({ en: "Gochara", hi: "गोचर" })}
          title={L({ en: `Today's transits · ${chart.transits.asOf}`, hi: `आज का गोचर · ${chart.transits.asOf}` })}
          sub={L({ en: "Counted from your natal Moon, using the classical favourable-house table.", hi: "आपके जन्म चंद्रमा से, शास्त्रीय शुभ-भाव तालिका के अनुसार।" })}
        />
        <div className={cn("mt-3 rounded-2xl border p-3", chart.transits.sadeSati.active ? "border-amber-300/30 bg-amber-400/[0.08]" : "border-white/10 bg-white/[0.03]")}>
          <p className="flex items-center gap-2 text-xs font-semibold text-white">
            <TrendingUp className={cn("h-4 w-4", chart.transits.sadeSati.active ? "text-amber-300" : "text-emerald-300")} />
            {chart.transits.sadeSati.active
              ? L({ en: `Sade Sati · ${chart.transits.sadeSati.phase} phase`, hi: `साढ़े साती · ${chart.transits.sadeSati.phase === "rising" ? "पहला" : chart.transits.sadeSati.phase === "peak" ? "मध्य" : "अंतिम"} चरण` })
              : L({ en: "Sade Sati is not active", hi: "साढ़े साती सक्रिय नहीं" })}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{L(chart.transits.sadeSati.note)}</p>
        </div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {chart.transits.planets.map((t) => (
            <div key={t.key} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-2.5 py-2">
              <span className="w-5 text-center text-base text-gold-300">{glyph(t.key)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">
                  {L(t.name)} · {L(t.signName)} <span className="text-slate-500">({L({ en: "house", hi: "भाव" })} {t.houseFromMoon} {L({ en: "from Moon", hi: "चंद्र से" })})</span>
                </p>
                {(t.key === "jupiter" || t.key === "saturn") && <p className="truncate text-[10px] text-slate-500">{L(t.note)}</p>}
              </div>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold", t.favorable ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200")}>
                {t.favorable ? L({ en: "supportive", hi: "शुभ" }) : L({ en: "testing", hi: "परीक्षा" })}
              </span>
            </div>
          ))}
        </div>
        {chart.transits.highlights.length > 0 && (
          <ul className="mt-2 space-y-1 rounded-xl border border-white/8 bg-white/[0.02] p-3 text-xs text-slate-300">
            {chart.transits.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <Star className="mt-0.5 h-3 w-3 shrink-0 text-gold-300" />
                <span>{L(h)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 7. Vargas */}
      <div className="mt-8">
        <SectionHead
          kicker={L({ en: "Shodashavarga", hi: "षोडशवर्ग" })}
          title={L({ en: "Sixteen divisional charts", hi: "सोलह वर्ग कुंडलियाँ" })}
          sub={L({ en: "D1 is the body, D9 the inner strength and marriage, D10 the career. The full table lists the varga ascendant for all sixteen.", hi: "D1 शरीर, D9 आंतरिक बल और विवाह, D10 करियर। पूरी तालिका सोलहों वर्गों का लग्न दिखाती है।" })}
        />
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {keyVargas.map((v) => (
            <VargaMiniChart key={v.key} varga={v} />
          ))}
        </div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {chart.vargas.map((v) => (
            <div key={v.key} className="rounded-xl border border-white/8 bg-white/[0.02] px-2.5 py-2">
              <p className="flex items-center justify-between text-xs font-medium text-white">
                <span>{L(v.name)}</span>
                <span className="text-gold-300">{rashiSymbol(v.lagna)}</span>
              </p>
              <p className="truncate text-[10px] text-slate-500">{L(v.purpose)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Numerology */}
      <div className="mt-8">
        <SectionHead
          kicker={L({ en: "Numerology", hi: "अंकशास्त्र" })}
          title={L({ en: "Numbers that colour the chart", hi: "कुंडली को रंग देने वाले अंक" })}
          sub={L({ en: "Mūlāṅka comes from the birth day, bhāgyāṅka from the full date, and nāmāṅka from the Chaldean name values.", hi: "मूलांक जन्म तिथि से, भाग्यांक पूरी तारीख से और नामांक कैल्डियन अक्षर-मान से निकलता है।" })}
        />
        <div className="mt-3 grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: L({ en: "Mulank", hi: "मूलांक" }), value: chart.numerology.mulank, sub: L(chart.numerology.mulankLord) },
              { label: L({ en: "Bhagyank", hi: "भाग्यांक" }), value: chart.numerology.bhagyank, sub: L(chart.numerology.bhagyankLord) },
              ...(chart.numerology.namank > 0
                ? [{ label: L({ en: "Namank", hi: "नामांक" }), value: chart.numerology.namank, sub: L({ en: "Chaldean", hi: "कैल्डियन" }) }]
                : []),
              { label: L({ en: "Lucky numbers", hi: "शुभ अंक" }), value: chart.numerology.luckyNumbers.join(" · "), sub: L({ en: "use on important dates", hi: "महत्वपूर्ण तिथियों पर" }) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-gold-300/80">{item.label}</p>
                <p className="font-display text-2xl text-white">{item.value}</p>
                <p className="truncate text-[10px] text-slate-400">{item.sub}</p>
              </div>
            ))}
            <div className="col-span-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 sm:col-span-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{L({ en: "Lucky colour · day", hi: "शुभ रंग · दिन" })}</p>
              <p className="mt-0.5 text-sm text-white">
                {chart.numerology.luckyColors.map((c) => L(c)).join(" · ")} <span className="text-slate-500">|</span>{" "}
                {chart.numerology.luckyDays.map((d) => L(d)).join(" · ")}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400"><Hash className="h-3.5 w-3.5 text-gold-300" /> {L({ en: "Lo Shu grid", hi: "लो शू ग्रिड" })}</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {loShuOrder.map((n) => {
                const count = loShuCount(n);
                return (
                  <div key={n} className={cn("flex h-11 flex-col items-center justify-center rounded-lg border", count > 0 ? "border-gold-400/30 bg-gold-400/10" : "border-white/8 bg-white/[0.02] opacity-50")}>
                    <span className={cn("font-display text-base", count > 0 ? "text-gold-100" : "text-slate-500")}>{n}</span>
                    <span className="text-[9px] text-slate-400">{count > 0 ? "●".repeat(Math.min(3, count)) : "—"}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">{L(chart.numerology.note)}</p>
          </div>
        </div>
      </div>

      {/* 9. Registry */}
      <details className="mt-6 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <summary className="flex cursor-pointer items-center gap-2 text-xs text-slate-400 hover:text-gold-300">
          <Grid3X3 className="h-3.5 w-3.5" />
          {L({ en: `Calculation registry · ${chart.calculations.length} methods`, hi: `गणना रजिस्ट्री · ${chart.calculations.length} विधियाँ` })}
        </summary>
        <div className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {chart.calculations.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-2 py-1 text-[10px]">
              <span className="truncate font-mono text-slate-300">{c.id}</span>
              <span className="shrink-0 rounded bg-white/5 px-1.5 py-0.5 text-slate-500">v{c.version}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
          <Compass className="h-3 w-3" /> {L({ en: "Every value above is reproducible from birth date, time, place and the Lahiri ayanamsa.", hi: "ऊपर का हर मान जन्म तिथि, समय, स्थान और लाहिरी अयनांश से दोबारा निकाला जा सकता है।" })}
        </p>
      </details>
    </section>
  );
}
