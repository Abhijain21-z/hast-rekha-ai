import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RashiExplorer from "@/components/rashi/RashiExplorer";
import { RASHIS } from "@/lib/content";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = {
  title: "12 राशियाँ (Rashis) — स्वभाव, प्रेम, करियर | Hast Rekha AI",
  description:
    "12 राशियों (rashis) का पूरा विश्लेषण — मेष से मीन तक स्वभाव, प्रेम, करियर, धन और स्वास्थ्य, साथ में राशि मिलान (compatibility) और दैनिक राशिफल — हिंदी और English में।",
  alternates: { canonical: "/rashi" },
  openGraph: {
    title: "12 राशियाँ (Rashis) — Hast Rekha AI",
    description: "मेष से मीन तक हर राशि का स्वभाव, प्रेम, करियर और दैनिक राशिफल — हिंदी और English में।",
    url: "/rashi",
  },
  twitter: {
    card: "summary_large_image",
    title: "12 राशियाँ (Rashis) — Hast Rekha AI",
    description: "मेष से मीन तक हर राशि का स्वभाव, प्रेम, करियर और राशिफल।",
  },
};

export default function RashiPage() {
  return (
    <>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>}>
        <RashiExplorer />
      </Suspense>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="border-t border-white/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">Rashi Guides</p>
          <h2 className="mt-2 font-display text-3xl text-white">हर राशि की विस्तृत गाइड</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            मेष से मीन तक — किसी एक राशि का स्वभाव, करियर, प्रेम, धन, स्वास्थ्य, शुभ रत्न और राशि मिलान विस्तार से पढ़ें।
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RASHIS.map((r) => (
              <Link key={r.key} href={`/rashi/${r.key}`} className="glass group flex items-center gap-3 rounded-2xl p-4 transition hover:border-gold-400/40">
                <span className="text-2xl text-gold-300">{r.symbol}</span>
                <span className="min-w-0">
                  <span className="block font-display text-base text-white">{r.short.hi} <span className="text-xs text-slate-400">({r.short.en})</span></span>
                  <span className="block text-xs text-slate-500">{r.dates}</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold-300 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
