"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, Check, Crown, Gift, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, Badge } from "@/components/ui";
import { PREMIUM_PERKS } from "@/lib/premium";
import { BUNDLE_PRICE, BUNDLE_TEST, DIWALI_PRICE, MEMBERSHIP_PRICE, PDF_PRICE, ULTRA_PRICE } from "@/lib/flags";
import DiwaliPujaPromo from "@/components/offers/DiwaliPujaPromo";
import SevaPledge from "@/components/offers/SevaPledge";

export default function Pricing({ heading = true }: { heading?: boolean }) {
  const { t, L } = useLang();

  const bundlePerks = [
    ...PREMIUM_PERKS.slice(0, 5),
    { en: "The complete Dhandayak (Gupt Khazana) book", hi: "पूरी धनदायक (गुप्त खजाना) पुस्तक" },
    { en: "900+ library & book PDF access (included in bundle)", hi: "900+ पुस्तकालय और पुस्तक PDF एक्सेस (बंडल में शामिल)" },
    { en: "Book link stays private to this report", hi: "पुस्तक का लिंक सिर्फ़ इसी रिपोर्ट पर" },
  ];

  const membershipPerks = [
    { en: "30 Pro reports in a rolling 30 days", hi: "लगातार 30 दिनों में 30 प्रो रिपोर्ट" },
    { en: "5 saved family profiles (with consent)", hi: "5 सहेजी पारिवारिक प्रोफ़ाइल (सहमति के साथ)" },
    { en: "New reports unlock automatically", hi: "नई रिपोर्ट अपने आप अनलॉक" },
    { en: "30-day pass — expires on its own", hi: "30-दिन का पास — समय पर ख़त्म" },
    { en: "No auto-renewal, nothing to cancel", hi: "कोई ऑटो-रिन्यूअल नहीं, कुछ रद्द करने की ज़रूरत नहीं" },
  ];

  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {heading && <SectionHeading eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Free */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }} className="glass flex flex-col rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl text-white">{t.pricing.free}</p>
              <p><span className="font-display text-3xl leading-none text-white">{t.pricing.freePrice}</span> <span className="text-xs text-slate-400">{t.pricing.freeSub}</span></p>
            </div>
            <ul className="mt-5 flex-1 space-y-3">
              {t.pricing.freeList.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check className="h-3 w-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-slate-100 transition hover:border-gold-400/50 hover:text-gold-200">
              <Sparkles className="h-4 w-4" /> {t.pricing.chooseFree}
            </Link>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
              {L({ en: "No card, no login needed to start.", hi: "शुरू करने के लिए कार्ड या लॉगिन ज़रूरी नहीं।" })}
            </p>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.08 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-gold-400/60 bg-gradient-to-br from-gold-400/15 via-cosmic-800/80 to-mystic-700/25 p-6 gold-glow">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <Badge className="absolute right-4 top-4 px-3 py-1 text-[10px]"><Crown className="h-3 w-3" /> {t.pricing.popular}</Badge>
            <div className="relative flex items-center justify-between">
              <p className="font-display text-xl text-gold-200">{t.pricing.prem}</p>
              <p><span className="gold-text font-display text-3xl font-bold leading-none">₹{PDF_PRICE}</span> <span className="text-xs text-slate-300">{t.pricing.premSub}</span></p>
            </div>
            <ul className="relative mt-5 flex-1 space-y-3">
              {t.pricing.premList.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gold-50">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/25 text-gold-200"><Check className="h-3 w-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="btn-gold relative mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
              <Crown className="h-4 w-4" /> {t.pricing.choosePrem}
            </Link>
            <p className="relative mt-3 text-center text-[11px] leading-relaxed text-slate-300">{t.pricing.payNote}</p>
          </motion.div>

          {/* Pro + Diwali PDF — ₹99 add-on */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.12 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-rose-400/40 bg-gradient-to-br from-rose-400/10 via-cosmic-800/85 to-gold-400/10 p-6">
            <div className="relative flex items-center justify-between gap-2">
              <p className="font-display text-xl text-rose-200">{L({ en: "Pro + Diwali PDF", hi: "प्रो + दिवाली PDF" })}</p>
              <Badge className="px-2.5 py-1 text-[10px]"><Gift className="h-3 w-3" /> {L({ en: "PDF add-on", hi: "PDF ऐड-ऑन" })}</Badge>
            </div>
            <p className="relative mt-3">
              <span className="gold-text font-display text-3xl font-bold leading-none">₹{DIWALI_PRICE}</span>{" "}
              <span className="text-xs text-slate-300">{L({ en: "one-time · Pro + PDF", hi: "एक बार · प्रो + PDF" })}</span>
            </p>
            <ul className="relative mt-5 flex-1 space-y-3">
              {[...PREMIUM_PERKS.slice(0, 5), { en: "Complete Diwali Puja PDF", hi: "संपूर्ण दिवाली पूजा PDF" }].map((f) => (
                <li key={f.en} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-400/25 text-rose-300"><Check className="h-3 w-3" /></span>
                  {L(f)}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="btn-gold relative mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
              <Gift className="h-4 w-4" /> {L({ en: "Get Pro + Diwali PDF", hi: "प्रो + दिवाली PDF लें" })}
            </Link>
            <p className="relative mt-3 text-center text-[11px] leading-relaxed text-slate-300">{L({ en: "Everything in Pro plus the complete Diwali Puja PDF.", hi: "प्रो की हर चीज़ और संपूर्ण दिवाली पूजा PDF।" })}</p>
          </motion.div>

          {/* Bundle (test) or legacy Ultra Pro */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.16 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-mystic-400/55 bg-gradient-to-br from-mystic-600/25 via-cosmic-800/85 to-gold-400/10 p-6">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative flex items-center justify-between gap-2">
              <p className="font-display text-xl text-mystic-300">
                {BUNDLE_TEST ? L({ en: "Pro + Book", hi: "प्रो + पुस्तक" }) : t.pricing.ultra}
              </p>
              <Badge className="px-2.5 py-1 text-[10px]"><BookOpen className="h-3 w-3" /> {BUNDLE_TEST ? L({ en: "Launch", hi: "लॉन्च" }) : t.pricing.ultraBadge}</Badge>
            </div>
            <p className="relative mt-3">
              <span className="gold-text font-display text-3xl font-bold leading-none">₹{BUNDLE_TEST ? BUNDLE_PRICE : ULTRA_PRICE}</span>{" "}
              <span className="text-xs text-slate-300">{L({ en: "one-time · Pro report + book", hi: "एक बार · प्रो रिपोर्ट + पुस्तक" })}</span>
            </p>
            <ul className="relative mt-5 flex-1 space-y-3">
              {bundlePerks.map((f) => (
                <li key={f.en} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mystic-400/25 text-mystic-300"><Check className="h-3 w-3" /></span>
                  {L(f)}
                </li>
              ))}
            </ul>
            <Link href="/reading" className="btn-gold relative mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
              <BookOpen className="h-4 w-4" /> {L({ en: "Get Pro + book", hi: "प्रो + पुस्तक लें" })}
            </Link>
            <p className="relative mt-3 text-center text-[11px] leading-relaxed text-slate-300">
              {L({ en: "The book link appears on your report after payment.", hi: "भुगतान के बाद पुस्तक का लिंक आपकी रिपोर्ट पर दिखेगा।" })}
            </p>
          </motion.div>

          {/* Membership */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.24 }} className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-400/10 via-cosmic-800/85 to-mystic-700/20 p-6">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative flex items-center justify-between gap-2">
              <p className="font-display text-xl text-emerald-200">{L({ en: "Membership", hi: "मेंबरशिप" })}</p>
              <Badge className="px-2.5 py-1 text-[10px]"><CalendarDays className="h-3 w-3" /> {L({ en: "30 days", hi: "30 दिन" })}</Badge>
            </div>
            <p className="relative mt-3">
              <span className="gold-text font-display text-3xl font-bold leading-none">₹{MEMBERSHIP_PRICE}</span>{" "}
              <span className="text-xs text-slate-300">{L({ en: "one-time · 30-day pass", hi: "एक बार · 30-दिन पास" })}</span>
            </p>
            <ul className="relative mt-5 flex-1 space-y-3">
              {membershipPerks.map((f) => (
                <li key={f.en} className="flex items-start gap-2.5 text-sm text-slate-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200"><Check className="h-3 w-3" /></span>
                  {L(f)}
                </li>
              ))}
            </ul>
            <Link href="/membership" className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-emerald-100 transition hover:border-emerald-400/80 hover:bg-emerald-400/20">
              <CalendarDays className="h-4 w-4" /> {L({ en: "See membership", hi: "मेंबरशिप देखें" })}
            </Link>
            <p className="relative mt-3 text-center text-[11px] leading-relaxed text-slate-300">
              {L({ en: "Sign-in needed. Access ends automatically.", hi: "लॉगिन ज़रूरी। एक्सेस अपने आप ख़त्म होगा।" })}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-900/80 via-[#120a20]/90 to-mystic-900/70 p-6 shadow-2xl shadow-black/20">
          <h3 className="font-display text-xl text-gold-300 text-center mb-2">हर प्लान में क्या मिलता है — और क्या नहीं</h3>
          <p className="text-xs text-slate-400 text-center mb-6">✓ = शामिल | ✗ = नहीं मिलता</p>
          <div className="space-y-3">
            {[
              { label: "12 जीवन-क्षेत्र", free: true, pro: true, diwali: true, bundle: true, tag: "सभी" },
              { label: "5 साल की भविष्यवाणी", free: false, pro: true, diwali: true, bundle: true, tag: "प्रो+" },
              { label: "साथी की भविष्यवाणी", free: false, pro: true, diwali: true, bundle: true, tag: "प्रो+" },
              { label: "व्यक्तिगत उपाय", free: false, pro: true, diwali: true, bundle: true, tag: "प्रो+" },
              { label: "PDF डाउनलोड", free: false, pro: true, diwali: true, bundle: true, tag: "प्रो+" },
              { label: "दिवाली पूजा PDF", free: false, pro: false, diwali: true, bundle: false, tag: "PDF" },
              { label: "धनदायक पुस्तक + 900+ पुस्तक PDF", free: false, pro: false, diwali: false, bundle: true, tag: "बंडल" },
              { label: "200 AI टोकन (चैट)", free: false, pro: true, diwali: true, bundle: true, tag: "प्रो+" },
            ].map((row, i) => (
              <div key={row.label} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition ${i % 2 === 0 ? 'bg-white/[0.04] border-white/10' : 'bg-gold-400/[0.04] border-gold-400/15'}`}>
                <span className="font-medium text-slate-100">{row.label}</span>
                <div className="flex gap-2 flex-wrap">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${row.free ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-500/20 text-rose-300'}`}>
                    फ्री {row.free ? '✓' : '✗'}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${row.pro ? 'bg-gold-400/20 text-gold-200' : 'bg-rose-500/20 text-rose-300'}`}>
                    ₹51 {row.pro ? '✓' : '✗'}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${row.diwali ? 'bg-rose-400/20 text-rose-200' : 'bg-rose-500/20 text-rose-300'}`}>
                    ₹99 {row.diwali ? '✓' : '✗'}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${row.bundle ? 'bg-mystic-400/20 text-mystic-200' : 'bg-rose-500/20 text-rose-300'}`}>
                    ₹199 {row.bundle ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500 text-center">फ्री = निःशुल्क | ₹51 = प्रो | ₹99 = प्रो + दिवाली PDF | ₹199 = प्रो + पुस्तक (900+ लाइब्रेरी)</p>
        </div>

        <div className="mt-8">
          <SevaPledge />
        </div>

        <div className="mt-5">
          <DiwaliPujaPromo compact />
        </div>
      </div>
    </section>
  );
}
