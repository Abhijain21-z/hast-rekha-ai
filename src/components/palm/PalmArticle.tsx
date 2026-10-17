"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Camera, ChevronRight, HelpCircle, Info, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { pick, type Bi } from "@/lib/i18n";
import { PALM_UI } from "@/content/palm/ui";
import type { PalmPage } from "@/content/palm/types";
import PalmDiagram, { LINE_LABELS, LINE_ORDER } from "./PalmDiagram";

export interface RelatedLink {
  slug: string;
  label: Bi;
}

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

/** Rough word count for the reading-time line. */
function wordCount(page: PalmPage, lang: "hi" | "en") {
  const t = (v: Bi) => v[lang] ?? "";
  const parts = [...page.intro, ...page.sections.flatMap((s) => [s.h, ...s.p, ...(s.list ?? []).flatMap((i) => [i.title, i.text])]), ...page.faqs.flatMap((f) => [f.q, f.a])];
  return parts.map(t).join(" ").split(/\s+/).filter(Boolean).length;
}

export default function PalmArticle({
  page,
  related,
  legend,
  updated,
  pinnedLang,
}: {
  page: PalmPage;
  /** Pillar first, then the page's related guides. */
  related: RelatedLink[];
  /** Line guides shown under the "all lines" diagram (pillar page only). */
  legend?: RelatedLink[];
  updated: string;
  /** Set from ?lang= so the whole page follows the URL the crawler was given. */
  pinnedLang?: "hi" | "en";
}) {
  const { L, lang, setLang, cl } = useLang();
  const c: "hi" | "en" = pinnedLang ?? (cl === "hi" ? "hi" : "en");

  // ?lang=en in the URL should switch the whole page, not just the article.
  useEffect(() => {
    if (pinnedLang && lang !== pinnedLang) setLang(pinnedLang);
  }, [pinnedLang, lang, setLang]);

  const words = wordCount(page, c);
  const minutes = Math.max(2, Math.round(words / 180));

  return (
    <article className="relative mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs — also mirrored in BreadcrumbList structured data. */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-gold-300">
          {L(PALM_UI.breadcrumbHome)}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        {page.kind === "pillar" ? (
          <span className="text-slate-300">{L(PALM_UI.breadcrumbGuides)}</span>
        ) : (
          <>
            <Link href="/hast-rekha-palmistry" className="hover:text-gold-300">
              {L(PALM_UI.breadcrumbGuides)}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-slate-300">{pick(c, page.crumb)}</span>
          </>
        )}
      </nav>

      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/80">✦ {pick(c, page.focus)}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">{pick(c, page.h1)}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            {L(PALM_UI.updated)} {updated}
          </span>
          <span aria-hidden>·</span>
          <span>
            {minutes} {L(PALM_UI.readingTime)}
          </span>
          <span aria-hidden>·</span>
          <span>{L(PALM_UI.index)}</span>
        </p>
      </motion.header>

      {/* Lead answer: the focus keyword lives in the first sentence a reader sees. */}
      <div className="glass mt-8 rounded-3xl border-l-2 border-gold-400/60 p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
          <Sparkles className="h-3.5 w-3.5" /> {L(PALM_UI.tldr)}
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-100">{pick(c, page.intro[0])}</p>
      </div>

      {page.intro.slice(1).map((p, i) => (
        <p key={i} className="mt-5 text-sm leading-relaxed text-slate-300">
          {pick(c, p)}
        </p>
      ))}

      {page.diagram && (
        <motion.figure {...fade} transition={{ duration: 0.5 }} className="glass mt-10 rounded-3xl p-6">
          <figcaption className="text-center text-xs font-semibold uppercase tracking-wider text-gold-300">{L(PALM_UI.diagramTitle)}</figcaption>
          <div className="mt-4">
            <PalmDiagram line={page.diagram.line} alt={page.diagram.alt} numbers={page.diagram.line === "all"} />
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">{pick(c, page.diagram.caption)}</p>
          {legend && legend.length > 0 && (
            <>
              <p className="mt-4 text-center text-xs text-slate-400">{L(PALM_UI.legendAll)}</p>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {legend.map((l, i) => (
                  <li key={l.slug} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-[11px] font-semibold text-gold-300">{i + 1}</span>
                    <Link href={`/${l.slug}`} className="hover:text-gold-300">
                      {L(l.label)}
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}
        </motion.figure>
      )}

      {page.sections.map((s, i) => (
        <motion.section key={s.h.en} {...fade} transition={{ duration: 0.45, delay: 0.04 }} className="mt-10">
          <h2 className="font-display text-xl text-gold-200 sm:text-2xl">{pick(c, s.h)}</h2>
          {s.p.map((p, j) => (
            <p key={j} className="mt-4 text-sm leading-relaxed text-slate-300">
              {pick(c, p)}
            </p>
          ))}
          {s.list && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {s.list.map((item) => (
                <div key={item.title.en} className="glass rounded-2xl p-4">
                  <p className="text-sm font-semibold text-gold-200">{pick(c, item.title)}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{pick(c, item.text)}</p>
                </div>
              ))}
            </div>
          )}
          {i === 1 && <Divider />}
        </motion.section>
      ))}

      <div className="section-divider my-12" />

      {/* FAQ — plain answers on the page, mirroring the FAQPage schema. */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="font-display text-xl text-gold-200 sm:text-2xl">{L(PALM_UI.faqTitle)}</h2>
        <p className="mt-2 text-sm text-slate-400">{L(PALM_UI.faqSub)}</p>
        <div className="mt-6 space-y-4">
          {page.faqs.map((f, i) => (
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

      {/* CTA */}
      <motion.section {...fade} transition={{ duration: 0.5 }} className="mt-12 rounded-[2rem] border border-gold-400/40 bg-gradient-to-br from-gold-400/12 via-cosmic-800/70 to-mystic-600/25 p-6 text-center sm:p-8">
        <h2 className="font-display text-xl text-white sm:text-2xl">{L(PALM_UI.ctaTitle)}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-200">{L(PALM_UI.ctaSub)}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
            <Camera className="h-4 w-4" /> {L(PALM_UI.cta)}
          </Link>
          <Link href="/reading" className="inline-flex items-center gap-1.5 text-sm text-gold-200 hover:text-gold-200">
            {L(PALM_UI.ctaNoPhoto)} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.section>

      {/* Internal links: pillar + three related guides with descriptive anchors. */}
      <section className="mt-12">
        <h2 className="font-display text-xl text-gold-200 sm:text-2xl">{L(PALM_UI.relatedTitle)}</h2>
        <p className="mt-2 text-sm text-slate-400">{L(PALM_UI.relatedSub)}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {related.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`} className="glass group flex items-center justify-between gap-3 rounded-2xl p-4 transition hover:border-gold-400/50">
              <span className="text-sm text-slate-200 group-hover:text-gold-200">{L(r.label)}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-gold-300 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Standing disclaimer on every prediction page. */}
      <p className="mt-10 flex items-start gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/8 px-4 py-3 text-xs leading-relaxed text-amber-100/90">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
        {L(PALM_UI.disclaimer)}
      </p>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {LINE_ORDER.map((k) => LINE_LABELS[k][c]).join(" · ")}
      </p>
    </article>
  );
}

function Divider() {
  return <div className="section-divider my-10" />;
}
