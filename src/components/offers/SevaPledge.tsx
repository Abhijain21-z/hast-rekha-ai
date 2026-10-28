"use client";

import { HeartHandshake, PawPrint, Sprout } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";

/**
 * Public seva pledge for the pricing section.
 *
 * The owner commits 20% of paid-plan revenue to animal welfare and tree
 * planting. Keep the wording tied to what the visitor pays, not to profit, so
 * the claim stays checkable; the free reading is explicitly unaffected.
 */
export default function SevaPledge({ className }: { className?: string }) {
  const { L } = useLang();

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 via-cosmic-950/95 to-gold-400/10 backdrop-blur-md p-6 sm:p-7",
        className,
      )}
      aria-label={L({ en: "Seva pledge", hi: "सेवा संकल्प" })}
    >
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300/90">
              {L({ en: "Seva pledge", hi: "सेवा संकल्प" })}
            </p>
            <h3 className="mt-1.5 font-display text-lg text-white sm:text-xl">
              {L({ en: "20% of every paid plan goes to seva", hi: "हर पेड प्लान का 20% सेवा में जाता है" })}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">
              {L({
                en: "A fifth of what you pay for Pro, the book bundle, the Diwali PDF or membership is set aside for animal welfare and greenery — feed for cows, monkeys and stray animals, and tree planting. It comes out of the plan price, so you pay nothing extra.",
                hi: "प्रो, पुस्तक बंडल, दिवाली PDF या मेंबरशिप में दिया गया 20% हिस्सा बेज़ुबान जानवरों की सेवा और हरियाली के लिए अलग रखा जाता है — गाय, बंदर और आवारा जानवरों का भोजन, और पेड़-पौधे लगाना। यह प्लान की कीमत में से जाता है, आपको अलग से कुछ नहीं देना है।",
              })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-100">
                <PawPrint className="h-3.5 w-3.5" />
                {L({ en: "Cow, monkey & stray animal feed", hi: "गाय, बंदर और आवारा जानवरों का भोजन" })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-100">
                <Sprout className="h-3.5 w-3.5" />
                {L({ en: "Tree planting", hi: "पेड़-पौधे लगाना" })}
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              {L({
                en: "Applies to paid plans only. The core reading stays free.",
                hi: "यह सिर्फ़ पेड प्लान पर लागू है। बुनियादी रीडिंग फ्री रहती है।",
              })}
            </p>
          </div>
        </div>
        <div className="shrink-0 self-start rounded-2xl border border-gold-400/30 bg-cosmic-950/60 px-5 py-4 text-center sm:self-center">
          <p className="gold-text font-display text-4xl font-bold leading-none">20%</p>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-gold-200/80">
            {L({ en: "for seva", hi: "सेवा के लिए" })}
          </p>
        </div>
      </div>
    </section>
  );
}
