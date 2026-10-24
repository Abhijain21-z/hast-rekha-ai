"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Briefcase, CalendarDays, Check, Crown, Flame, Gem, Gift, HeartHandshake, Lock, Orbit, ScrollText, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, cn } from "@/components/ui";
import { buildPremiumReport, PREMIUM_PERKS, PREMIUM_PRICE, UPI_ID } from "@/lib/premium";
import { MANUAL_UPI_ENABLED, PDF_PRICE_ANCHOR, PRO_PAY_MODE, ULTRA_PRICE } from "@/lib/flags";
import { buildPartnerReport, prefersDevanagari } from "@/lib/partner";
import type { ReadingDTO } from "@/lib/dto";
import { DIWALI_OFFER } from "@/lib/diwali-offer";
import { byLang } from "@/lib/i18n";
import BookCard from "./BookCard";
import DiwaliPujaCard from "./DiwaliPujaCard";
import { ProGateButton, ProPaywallModal, type ProPlan } from "./ProPaywall";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };

export default function PremiumSection({ reading, unlocked, onUnlocked }: { reading: ReadingDTO; unlocked: boolean; onUnlocked: () => void }) {
  const { t, L, cl } = useLang();
  // null = closed; which plan to pre-select when the paywall opens.
  const [payOpen, setPayOpen] = useState<ProPlan | null>(null);

  const report = useMemo(
    () => buildPremiumReport({ result: reading.result, seed: reading.result.julianDay * 1000 + reading.fullName.length, fullName: reading.fullName, birthYear: Number(reading.birthDate.slice(0, 4)) }),
    [reading.result, reading.fullName, reading.birthDate],
  );

  // Only readers who explicitly told us they are unmarried get the partner
  // prediction (null = unanswered, so we stay quiet rather than guess).
  const unmarried = reading.married === false || reading.result.married === false;
  const partner = useMemo(
    () => (unmarried ? buildPartnerReport({ result: reading.result, seed: reading.result.julianDay * 1000 + reading.fullName.length }) : null),
    [unmarried, reading.result, reading.fullName],
  );

  const rowIcons = [CalendarDays, AlertTriangle, Briefcase, Flame, ScrollText];

  return (
    <section id="sec-premium" className="mt-14 scroll-mt-28">
      {!unlocked ? (
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/50 bg-gradient-to-br from-gold-400/15 via-cosmic-800/60 to-mystic-700/20 p-6 sm:p-10 gold-glow">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.premium.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl"><Crown className="mr-2 inline h-7 w-7 text-gold-300" />{t.premium.upsellTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">{t.premium.upsellSub}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {PREMIUM_PERKS.map((p) => (
                  <li key={p.en} className="flex items-start gap-2 text-sm text-slate-100">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {L(p)}
                  </li>
                ))}
              </ul>
              {unmarried && (
                <p className="mt-4 flex items-start gap-2 rounded-2xl border border-mystic-400/35 bg-mystic-600/15 px-4 py-3 text-sm text-slate-100">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-mystic-400" /> {t.partner.teaser}
                </p>
              )}
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-gold-400/35 bg-gold-400/10 px-4 py-3">
                <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <div>
                  <p className="text-sm font-semibold text-gold-100">
                    {L(DIWALI_OFFER.badge)} · {L(DIWALI_OFFER.title)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-200">{L(DIWALI_OFFER.sub)}</p>
                </div>
              </div>
            </div>
            <div className="glass-strong flex flex-col items-center rounded-3xl p-7 text-center">
              <Lock className="h-8 w-8 text-gold-300" />
              <p className="mt-3 text-sm text-slate-400 line-through decoration-rose-400/70 decoration-2">₹{PDF_PRICE_ANCHOR}</p>
              <p className="font-display text-5xl gold-text">₹{PREMIUM_PRICE}</p>
              <p className="text-xs text-slate-400">{t.premium.once}</p>
              <Button size="lg" className="mt-5 w-full" onClick={() => setPayOpen("pro")} icon={<Crown className="h-5 w-5" />}>
                {t.premium.get}
              </Button>
              <button
                type="button"
                onClick={() => setPayOpen("ultra")}
                className="mt-3 w-full rounded-full border border-gold-400/40 px-4 py-2.5 text-xs font-medium text-gold-200 transition hover:border-gold-400/70 hover:bg-gold-400/10"
              >
                {t.pricing.ultra} · ₹{ULTRA_PRICE} · {t.pro.ultraTag}
              </button>
              {MANUAL_UPI_ENABLED && PRO_PAY_MODE === "upi" && (
                <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Sparkles className="h-3 w-3 text-gold-300" /> UPI · QR · {UPI_ID}</p>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/60 bg-gradient-to-br from-gold-400/15 via-cosmic-800/70 to-mystic-700/25 p-6 sm:p-10 gold-glow">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.premium.eyebrow} · 👑</p>
                  <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl"><Crown className="mr-2 inline h-7 w-7 text-gold-300" />{t.premium.title ?? ""}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-200">{t.premium.sub}</p>
                </div>
                <ProGateButton
                  readingId={reading.id}
                  unlocked
                  onUnlocked={onUnlocked}
                  label={t.premium.printFull}
                  icon="print"
                  className="self-start px-5 py-2.5"
                />
              </div>

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-5 rounded-2xl border border-gold-400/25 bg-gold-400/10 px-4 py-3 text-sm text-gold-100">
                <Gem className="mr-2 inline h-4 w-4" />{byLang<string>(report.fieldNote, cl)}
              </motion.p>

              <div className="mt-6 space-y-5">
                {report.years.map((y, i) => (
                  <motion.div key={y.calendarYear} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.05 }} className="glass overflow-hidden rounded-3xl">
                    <div className="flex flex-wrap items-center gap-3 border-b border-gold-400/20 bg-gradient-to-r from-gold-400/15 to-transparent px-5 py-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/20 font-display text-lg text-gold-200">{String(y.calendarYear).slice(2)}</span>
                      <div>
                        <p className="font-display text-xl text-white">{y.calendarYear} · {L(y.theme)}</p>
                        <p className="text-xs text-slate-400">{t.premium.age} {y.ageRange[0]}–{y.ageRange[1]}</p>
                      </div>
                      <span className="ml-auto hidden font-display text-4xl text-gold-400/30 sm:block">{i + 1}</span>
                    </div>
                    {y.dashaNote && (
                      <p className="flex items-start gap-2 border-b border-white/5 bg-white/[0.02] px-5 py-2.5 text-xs leading-relaxed text-slate-300">
                        <Orbit className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" /> {L(y.dashaNote)}
                      </p>
                    )}
                    <div className="grid gap-3 p-5 sm:grid-cols-2">
                      {[
                        { icon: rowIcons[0], label: t.premium.events, text: L(y.events), cls: "text-slate-100" },
                        { icon: rowIcons[1], label: t.premium.mistakes, text: L(y.mistakes), cls: "text-rose-200" },
                        { icon: rowIcons[3], label: t.premium.upay, text: L(y.upay), cls: "text-emerald-200" },
                        { icon: rowIcons[4], label: t.premium.stotra, text: L(y.stotra), cls: "text-gold-100" },
                      ].map((b) => (
                        <div key={b.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><b.icon className="h-3.5 w-3.5 text-gold-300" /> {b.label}</p>
                          <p className={cn("mt-2 text-sm leading-relaxed", b.cls)}>{b.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200"><Briefcase className="h-4 w-4" /> {t.premium.fieldWork}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{byLang<string>(report.fieldNote, cl)}</p>
                </div>
                <div className="rounded-2xl border border-gold-400/25 bg-gold-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-200"><Gem className="h-4 w-4" /> {t.premium.gem}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{byLang<string>(report.gemNote, cl)}</p>
                </div>
              </motion.div>

              {unmarried && partner && (
                <motion.div {...reveal} className="mt-6 rounded-[2rem] border-2 border-mystic-400/45 bg-cosmic-950/75 bg-gradient-to-br from-mystic-600/20 via-cosmic-800/60 to-gold-400/10 p-6 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mystic-400">✦ {t.partner.eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl text-white">
                    <HeartHandshake className="mr-2 inline h-6 w-6 text-mystic-400" />
                    {t.partner.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{t.partner.sub}</p>

                  <div className="mt-5 rounded-2xl border border-mystic-400/30 bg-mystic-600/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-mystic-400">{t.partner.name}</p>
                    <p className="mt-2 font-display text-2xl tracking-wide text-gold-300">
                      {(prefersDevanagari(cl) ? partner.syllablesDev : partner.syllablesRom).join(" · ")}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{L(partner.nameHint)}</p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: t.partner.when, text: partner.age },
                      { label: t.partner.nature, text: partner.nature },
                      { label: t.partner.looks, text: partner.looks },
                      { label: t.partner.wealth, text: partner.wealth },
                      { label: t.partner.career, text: partner.career },
                      { label: t.partner.direction, text: partner.direction },
                      { label: t.partner.meeting, text: partner.meeting },
                      { label: t.partner.recognition, text: partner.recognition },
                    ].map((b) => (
                      <div key={b.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-mystic-400">{b.label}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-100">{L(b.text)}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4 text-center text-sm leading-relaxed text-gold-100">
                    {L(partner.rashiNote)}
                  </p>
                  <p className="mt-3 text-center text-xs italic text-slate-400">{L(partner.note)}</p>
                </motion.div>
              )}

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 rounded-2xl bg-white/5 p-4 text-center text-sm italic text-slate-300">
                {L(report.closing)}
              </motion.p>

              {/* Every Pro reading carries the Diwali Puja PDF. */}
              <DiwaliPujaCard readingId={reading.id} />

              {/* Ultra Pro readings also carry the Dhandayak book. */}
              {reading.ultra && <BookCard readingId={reading.id} />}
            </div>
          </motion.div>
        </div>
      )}

      <ProPaywallModal
        key={payOpen ?? "closed"}
        open={payOpen !== null}
        onClose={() => setPayOpen(null)}
        readingId={reading.id}
        defaultPlan={payOpen ?? "pro"}
        onUnlocked={() => {
          setPayOpen(null);
          onUnlocked();
        }}
      />
    </section>
  );
}
