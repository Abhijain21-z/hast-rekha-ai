"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, HelpCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { pick } from "@/lib/i18n";
import { PRICING_FAQ_UI, PRICING_FAQS, PRICING_GUIDE_LINKS } from "@/content/pricing-faq";

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

/**
 * FAQ + internal links for /pricing.
 *
 * Targets the questions someone asks right before deciding to pay, and mirrors
 * the same text into FAQPage structured data. The ?lang=en URL variant pins the
 * whole app language, so the visible FAQ always matches the JSON-LD.
 */
export default function PricingFaq({ pinnedLang }: { pinnedLang?: "hi" | "en" }) {
  const { L, lang, setLang, cl } = useLang();
  const c: "hi" | "en" = pinnedLang ?? (cl === "hi" ? "hi" : "en");

  useEffect(() => {
    if (pinnedLang && lang !== pinnedLang) setLang(pinnedLang);
  }, [pinnedLang, lang, setLang]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-gold-300">
          {L(PRICING_FAQ_UI.breadcrumbHome)}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-300">{L(PRICING_FAQ_UI.breadcrumbPricing)}</span>
      </nav>

      <section id="faq" className="mt-8 scroll-mt-24">
        <h2 className="font-display text-2xl text-gold-200 sm:text-3xl">{L(PRICING_FAQ_UI.faqTitle)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{L(PRICING_FAQ_UI.faqSub)}</p>

        <div className="mt-6 space-y-4">
          {PRICING_FAQS.map((f, i) => (
            <motion.div key={f.q.en} {...fade} transition={{ duration: 0.4, delay: (i % 3) * 0.05 }} className="glass rounded-2xl p-5">
              <h3 className="flex items-start gap-2 text-sm font-semibold text-gold-200">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                {pick(c, f.q)}
              </h3>
              <p className="mt-2 pl-6 text-sm leading-relaxed text-slate-300">{pick(c, f.a)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-gold-200 sm:text-3xl">{L(PRICING_FAQ_UI.guidesTitle)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{L(PRICING_FAQ_UI.guidesSub)}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PRICING_GUIDE_LINKS.map((g) => (
            <Link key={g.href} href={g.href} className="glass group flex items-center justify-between gap-3 rounded-2xl p-4 transition hover:border-gold-400/50">
              <span className="text-sm text-slate-200 group-hover:text-gold-200">{L(g.label)}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
