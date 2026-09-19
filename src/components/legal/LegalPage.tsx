"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import type { Bi } from "@/lib/i18n";

export interface LegalDoc {
  title: Bi;
  updated?: Bi;
  intro: Bi;
  sections: { h: Bi; p: Bi[] }[];
}

export default function LegalPage({ doc, eyebrow }: { doc: LegalDoc; eyebrow?: string }) {
  const { L } = useLang();
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">
          <Scale className="h-4 w-4" /> {eyebrow ?? "Hast Rekha AI"}
        </p>
        <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">{L(doc.title)}</h1>
        {doc.updated && <p className="mt-2 text-xs text-slate-500">{L(doc.updated)}</p>}
        <p className="mt-5 text-base leading-relaxed text-slate-200">{L(doc.intro)}</p>
      </motion.div>

      <div className="mt-10 space-y-8">
        {doc.sections.map((s, i) => (
          <motion.section key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.05 }}>
            <h2 className="flex items-center gap-3 font-display text-xl text-white sm:text-2xl">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 font-display text-sm text-gold-300">{i + 1}</span>
              {L(s.h)}
            </h2>
            {s.p.map((p, j) => (
              <p key={j} className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7">{L(p)}</p>
            ))}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
