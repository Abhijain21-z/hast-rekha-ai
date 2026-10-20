"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock, Moon, ScrollText, Sparkles, Star } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui";
import { PREMIUM_PRICE } from "@/lib/premium";
import { buildMantraReport } from "@/lib/mantra";
import type { ReadingDTO } from "@/lib/dto";
import { ProPaywallModal } from "./ProPaywall";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55 },
};

function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/**
 * The free prediction ends with a locked "gupt mantra" card. The actual mantra
 * is never put in the DOM until Pro is unlocked, so it cannot be copied from
 * the page source. Clicking the card opens the same ₹51 Cashfree paywall.
 */
export default function MantraSection({
  reading,
  unlocked,
  onUnlocked,
}: {
  reading: ReadingDTO;
  unlocked: boolean;
  onUnlocked: () => void;
}) {
  const { t, L } = useLang();
  const [payOpen, setPayOpen] = useState(false);
  const m = useMemo(() => buildMantraReport({ fullName: reading.fullName, result: reading.result }), [reading.fullName, reading.result]);

  return (
    <section id="sec-mantra" className="mt-14 scroll-mt-28">
      {!unlocked ? (
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/40 bg-gradient-to-br from-gold-400/12 via-cosmic-800/70 to-mystic-700/20 p-6 sm:p-8">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.mantra.eyebrow}</p>
            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl text-white sm:text-3xl">
                  <Lock className="mr-2 inline h-6 w-6 text-gold-300" />
                  {t.mantra.lockedTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {fill(t.mantra.lockedSub, { rashi: L(m.rashiName), nakshatra: L(m.nakshatraName) })}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-gold-400/30 bg-cosmic-950/50 p-4 text-center">
                <p className="font-display text-3xl gold-text">₹{PREMIUM_PRICE}</p>
                <Button size="lg" className="mt-3 w-full" onClick={() => setPayOpen(true)} icon={<Lock className="h-4 w-4" />}>
                  {fill(t.mantra.unlock, { p: PREMIUM_PRICE })}
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <Moon className="h-3.5 w-3.5" /> {t.mantra.beejTitle}
                </p>
                <div className="mt-3 space-y-2" aria-hidden>
                  <div className="h-3.5 w-11/12 rounded-full bg-gold-400/20 blur-[2px]" />
                  <div className="h-3.5 w-3/4 rounded-full bg-gold-400/15 blur-[2px]" />
                  <div className="h-3.5 w-1/2 rounded-full bg-gold-400/10 blur-[2px]" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <Flame className="h-3.5 w-3.5" /> {t.mantra.prayogTitle}
                </p>
                <div className="mt-3 space-y-2" aria-hidden>
                  <div className="h-3.5 w-5/6 rounded-full bg-gold-400/20 blur-[2px]" />
                  <div className="h-3.5 w-2/3 rounded-full bg-gold-400/15 blur-[2px]" />
                  <div className="h-3.5 w-3/5 rounded-full bg-gold-400/10 blur-[2px]" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">{t.mantra.lockedNote}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/55 bg-gradient-to-br from-gold-400/12 via-cosmic-800/75 to-mystic-700/25 p-6 sm:p-8 gold-glow">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-35" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.mantra.eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              <Sparkles className="mr-2 inline h-6 w-6 text-gold-300" />
              {t.mantra.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">{t.mantra.sub}</p>
            <p className="mt-2 text-xs text-gold-200/80">
              {fill(t.mantra.unlockedNote, { name: reading.fullName, rashi: L(m.rashiName), nakshatra: L(m.nakshatraName) })}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Moon, label: t.mantra.rashi, value: L(m.rashiName) },
                { icon: Star, label: t.mantra.lord, value: L(m.rashiLord) },
                { icon: Sparkles, label: t.mantra.nakshatra, value: `${L(m.nakshatraName)} · ${m.pada}` },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <c.icon className="h-3.5 w-3.5 text-gold-300" /> {c.label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-white">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-gold-400/35 bg-gold-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-200">
                    <Moon className="h-4 w-4" /> {t.mantra.beejTitle}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-relaxed text-gold-100">{m.beej}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{L(m.beejMeaning)}</p>
                </div>

                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    <Flame className="h-4 w-4" /> {t.mantra.dhanTitle}
                  </p>
                  <p className="mt-3 font-display text-2xl leading-relaxed text-emerald-100">{m.dhanBeej}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.seedChips.map((s) => (
                      <span key={s} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{L(m.dhanMeaning)}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.mantra.sankalpTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{L(m.sankalp)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.mantra.vidhiTitle}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { label: t.mantra.startDay, value: L(m.startDay) },
                    { label: t.mantra.direction, value: L(m.direction) },
                    { label: t.mantra.colour, value: L(m.colour) },
                    { label: t.mantra.count, value: L(m.count) },
                    { label: t.mantra.offering, value: L(m.offering) },
                    { label: t.mantra.daan, value: L(m.daan) },
                  ].map((v) => (
                    <div key={v.label} className="rounded-xl bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">{v.label}</p>
                      <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-100">{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gold-400/25 bg-cosmic-950/40 p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-200">
                <ScrollText className="h-4 w-4" /> {t.mantra.prayogTitle}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {fill(t.mantra.prayogSub, { day: L(m.startDay), days: m.practiceDays })}
              </p>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {m.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-display text-xs text-gold-200">{i + 1}</span>
                    <p className="text-xs leading-relaxed text-slate-100">{L(step)}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-4 text-xs italic leading-relaxed text-slate-500">{L(m.disclaimer)}</p>
          </div>
        </motion.div>
      )}

      <ProPaywallModal
        key={payOpen ? "mantra-open" : "mantra-closed"}
        open={payOpen}
        onClose={() => setPayOpen(false)}
        readingId={reading.id}
        defaultPlan="pro"
        onUnlocked={() => {
          setPayOpen(false);
          onUnlocked();
        }}
      />
    </section>
  );
}
