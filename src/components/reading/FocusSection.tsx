"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { focusOption } from "@/lib/focus";
import type { PalmReport } from "@/lib/palm";
import { Meter } from "./ReportCharts";
import { ProReadMore, ProText } from "./ProTeaser";

/**
 * The reader told us the one problem that brought them here. This card is the
 * first prediction on the page: its score, the palm reading for that area, and
 * the practical next step. Everything else follows below.
 */
export default function FocusSection({
  focus,
  report,
  readingId,
  unlocked,
  onUnlocked,
}: {
  focus: string | null;
  report: PalmReport;
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
}) {
  const { t, L } = useLang();
  const option = focusOption(focus);
  if (!option) return null;

  const area = option.area;
  const matching = report.sections.filter((section) => section.def.area === area);
  const primary = matching[0] ?? null;
  const score = report.scores[area];
  const last = primary?.paragraphs[primary.paragraphs.length - 1];

  return (
    <section id="sec-focus" className="mt-8 scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/50 bg-gradient-to-br from-gold-400/15 via-cosmic-800/75 to-mystic-700/25 p-6 sm:p-8 gold-glow"
      >
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
            <Target className="h-4 w-4" /> {L({ en: "Your main concern first", hi: "पहले आपकी मुख्य समस्या" })}
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">{L(option.label)}</h2>
              <p className="mt-1 text-sm text-slate-300">
                {L({
                  en: "Read from your palm and cross-checked with your birth chart. The rest of your reading follows below.",
                  hi: "आपकी हथेली से पढ़ा गया और जन्म कुंडली से मिलाया गया। बाकी रीडिंग नीचे है।",
                })}
              </p>
            </div>
            <div className="w-full max-w-xs shrink-0 rounded-2xl border border-white/10 bg-black/20 p-4">
              <Meter value={score} label={t.report.areas[area]} />
            </div>
          </div>

          {primary && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-slate-100 sm:text-[15px]">
                <ProText text={L(primary.paragraphs[0])} unlocked={unlocked} />
              </p>
              {last && primary.paragraphs.length > 1 && (
                <ProReadMore
                  readingId={readingId}
                  unlocked={unlocked}
                  onUnlocked={onUnlocked}
                  text={L(last)}
                  className="mt-4"
                />
              )}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-gold-100">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              {L({
                en: "Your full report also covers career, money, love, health, family, travel and spirituality — with remedies.",
                hi: "आपकी पूरी रिपोर्ट में करियर, धन, प्रेम, स्वास्थ्य, परिवार, यात्रा और आध्यात्म भी शामिल हैं — उपायों के साथ।",
              })}
            </p>
            <Link
              href="#sec-detailed"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2.5 text-sm font-medium text-gold-100 transition hover:border-gold-400/70 hover:bg-gold-400/20"
            >
              {L({ en: "Read all predictions", hi: "सभी भविष्यवाणियाँ पढ़ें" })} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
