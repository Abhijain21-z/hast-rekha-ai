"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Hand, Fingerprint, Star, AlertTriangle, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import type { PalmReport } from "@/lib/palm";
import { PALMISTRY } from "@/lib/content";
import { byLang } from "@/lib/i18n";
import PalmSvg, { PALM_LINES } from "@/components/palm/PalmSvg";
import { Card } from "@/components/ui";
import { Gauge, Meter } from "./ReportCharts";
import { ProReadMore, ProText } from "./ProTeaser";

interface Props {
  report: PalmReport;
  palmImage: string | null;
  palmHand: string | null;
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
}

export default function PalmAnalysis({ report, palmImage, palmHand, readingId, unlocked, onUnlocked }: Props) {
  const { t, L, lang, cl } = useLang();
  const [active, setActive] = useState<string | null>(null);
  const strengths: Record<string, number> = {};
  report.lines.forEach((l) => (strengths[l.def.key] = l.strength));
  report.mounts.forEach((m) => (strengths[m.def.key] = m.strength));

  return (
    <section id="sec-palm" className="scroll-mt-28">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.report.section} 5 · Hast Rekha</p>
        <h2 className="mt-2 font-display text-3xl text-white">{t.report.palmFull}</h2>
        <p className="mt-1 text-sm text-slate-400">{t.report.palmFullSub}</p>
      </div>

      {/* image + map + shape */}
      <div className="print-palm-overview grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {palmImage ? (
            <div className="overflow-hidden rounded-3xl border border-gold-400/30 gold-glow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={palmImage} alt="Palm" className="w-full object-cover" />
              <div className="flex items-center justify-between bg-cosmic-900/80 px-4 py-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5"><Hand className="h-3.5 w-3.5 text-gold-300" /> {t.result.dominant}</span>
                <span>{palmHand === "left" ? t.form.left : t.form.right}</span>
              </div>
            </div>
          ) : (
            <div className="glass flex h-full flex-col items-center justify-center rounded-3xl px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300"><Hand className="h-7 w-7" /></div>
              <p className="mt-4 text-sm text-slate-300">{t.result.noPalm}</p>
              <ul className="no-print mt-4 space-y-1 text-left text-xs text-slate-500">
                {byLang<string[]>(PALMISTRY.tips, cl).map((tip) => <li key={tip}>• {tip}</li>)}
              </ul>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-strong rounded-3xl p-3">
          <div className="print-palm-map relative aspect-[280/440] overflow-hidden rounded-[1.4rem] border border-gold-400/25">
            <Image src="/images/hand.png" alt="Palm map" fill sizes="320px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cosmic-950/45 via-transparent to-cosmic-950/15" />
            <PalmSvg overlay active={active} onSelect={setActive} strengths={strengths} className="absolute inset-0 h-full w-full" />
          </div>
          <p className="no-print mt-2 text-center text-xs text-slate-500">{t.palmSection.tap}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="print-palm-notes space-y-4">
          <Card strong className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.report.shape}</p>
            <p className="mt-2 font-display text-xl text-white">{L(report.shape.name)}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300"><ProText text={L(report.shape.text)} unlocked={unlocked} /></p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300"><Fingerprint className="h-4 w-4" /> {t.report.fingers}</p>
            {[report.fingers, report.knuckles, report.thumb].map((v) => (
              <div key={v.label.en} className="mt-3">
                <p className="text-sm font-semibold text-white">{L(v.label)}</p>
                <p className="text-xs leading-relaxed text-slate-400"><ProText text={L(v.text)} unlocked={unlocked} /></p>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>

      {/* lines */}
      <h3 className="mt-12 font-display text-2xl text-white">{t.report.lines}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {report.lines.map(({ def, variant, strength }, i) => {
          const color = PALM_LINES.find((l) => l.key === def.key)?.color ?? "#f5c242";
          return (
            <motion.div key={def.key} id={`line-${def.key}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 2) * 0.1 }} onMouseEnter={() => setActive(def.key)} className="glass rounded-3xl p-5 transition hover:border-gold-400/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-display text-lg text-white"><span className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} /> {L(def.name)}</p>
                  <p className="mt-1 text-xs text-slate-500">{L(def.location)}</p>
                </div>
                <span className="shrink-0 rounded-full border px-3 py-1 text-xs" style={{ borderColor: `${color}66`, color }}>{L(variant.label)}</span>
              </div>
              <div className="mt-3"><Meter value={strength} label={t.report.strength} color={color} /></div>
              <p className="mt-3 text-xs text-slate-400">{L(def.meaning)}</p>
              <ProReadMore readingId={readingId} unlocked={unlocked} onUnlocked={onUnlocked} text={L(variant.text)} className="mt-2 text-slate-100" />
            </motion.div>
          );
        })}
      </div>

      {/* mounts */}
      <h3 className="mt-12 font-display text-2xl text-white">{t.report.mounts}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.mounts.map(({ def, variant, strength }, i) => (
          <motion.div key={def.key} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }} onMouseEnter={() => setActive(def.key)} className="glass flex gap-4 rounded-3xl p-5">
            <Gauge value={strength} label={L(variant.label)} size={92} color="#c084fc" />
            <div className="min-w-0">
              <p className="font-display text-base text-white">{L(def.name)}</p>
              <p className="mt-1 text-xs text-slate-500">{L(def.meaning)}</p>
              <ProReadMore readingId={readingId} unlocked={unlocked} onUnlocked={onUnlocked} text={L(variant.text)} className="mt-2" textClassName="text-xs text-slate-200" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* advanced details */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl text-white"><Star className="h-5 w-5 text-gold-300" /> {L({ en: "Dominant mounts", hi: "प्रबल पर्वत" })}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {L({ en: "The three fullest mounts are the ones a palmist reads first.", hi: "सबसे भरे तीन पर्वत पहले पढ़े जाते हैं।" })}
          </p>
          <div className="mt-3 space-y-2">
            {report.details.dominantMounts.map(({ def, strength }, i) => (
              <motion.div key={def.key} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-display text-sm text-gold-200">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{L(def.name)}</p>
                  <p className="truncate text-[11px] text-slate-500">{L(def.meaning)}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-gold-200">{strength}</span>
              </motion.div>
            ))}
          </div>

          <h3 className="mt-8 font-display text-2xl text-white">{L({ en: "Line timing", hi: "रेखा-काल" })}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {L({ en: "Where each major line is read on the age scale.", hi: "हर प्रमुख रेखा आयु-क्रम में कहाँ पढ़ी जाती है।" })}
          </p>
          <div className="mt-3 space-y-2">
            {report.details.timing.map(({ def, start, end, peak, note }) => (
              <div key={def.key} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-white">{L(def.name)}</p>
                  <span className="shrink-0 font-mono text-[10px] text-gold-200">{start}–{end}</span>
                </div>
                <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 rounded-full bg-gradient-to-r from-gold-500/60 via-gold-300 to-gold-500/60" style={{ left: `${(start / 80) * 100}%`, width: `${((end - start) / 80) * 100}%` }} />
                  <span className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `calc(${(peak / 80) * 100}% - 5px)` }} />
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{L(note)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl text-white"><Sparkles className="h-5 w-5 text-gold-300" /> {L({ en: "Minor lines", hi: "गौण रेखाएँ" })}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {L({ en: "The finer marks that add detail to the ten main lines.", hi: "वे महीन चिह्न जो दस मुख्य रेखाओं में विवरण जोड़ते हैं।" })}
          </p>
          <div className="mt-3 space-y-2">
            {report.details.minorLines.map(({ def, variant, strength }, i) => (
              <motion.div key={def.key} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{L(def.name)}</p>
                  <span className="shrink-0 rounded-full border border-gold-400/30 bg-gold-400/10 px-2 py-0.5 text-[10px] text-gold-200">{L(variant.label)}</span>
                </div>
                <div className="mt-2"><Meter value={strength} label={t.report.strength} color="#f5c242" /></div>
                <ProReadMore readingId={readingId} unlocked={unlocked} onUnlocked={onUnlocked} text={L(variant.text)} className="mt-2" textClassName="text-xs text-slate-200" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* fingers, skin, nails */}
      <h3 className="mt-12 font-display text-2xl text-white">{L({ en: "Fingers, skin and nails", hi: "उँगलियाँ, त्वचा और नाखून" })}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.details.fingers.map(({ def, variant, strength }, i) => (
          <motion.div key={def.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }} className="glass rounded-3xl p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300"><Hand className="h-4 w-4" /> {L(def.name)}</p>
            <p className="mt-2 text-sm font-semibold text-white">{L(variant.label)}</p>
            <div className="mt-2"><Meter value={strength} label={t.report.strength} color="#c084fc" /></div>
            <ProReadMore readingId={readingId} unlocked={unlocked} onUnlocked={onUnlocked} text={L(variant.text)} className="mt-2" textClassName="text-xs text-slate-200" />
          </motion.div>
        ))}
        {report.details.skin && (
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{L({ en: "Skin texture", hi: "त्वचा" })}</p>
            <p className="mt-2 text-sm font-semibold text-white">{L(report.details.skin.label)}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400"><ProText text={L(report.details.skin.text)} unlocked={unlocked} /></p>
          </Card>
        )}
        {report.details.nails && (
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{L({ en: "Nails", hi: "नाखून" })}</p>
            <p className="mt-2 text-sm font-semibold text-white">{L(report.details.nails.label)}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400"><ProText text={L(report.details.nails.text)} unlocked={unlocked} /></p>
          </Card>
        )}
      </div>

      {/* signs */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl text-white"><Star className="h-5 w-5 text-gold-300" /> {t.report.signs}</h3>
          <div className="mt-4 space-y-3">
            {report.signs.map((s, i) => (
              <motion.div key={s.key} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-3 rounded-2xl border border-gold-400/25 bg-gold-400/5 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300"><Sparkles className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold text-gold-100">{L(s.name)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">{L(s.text)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl text-white"><AlertTriangle className="h-5 w-5 text-amber-300" /> {t.report.cautions}</h3>
          <div className="mt-4 space-y-3">
            {report.cautions.map((c, i) => (
              <motion.div key={c.key} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4">
                <p className="font-semibold text-amber-100">{L(c.name)}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">{L(c.text)}</p>
                <p className="mt-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200"><span className="font-semibold">{t.report.remedy}: </span>{L(c.remedy)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
