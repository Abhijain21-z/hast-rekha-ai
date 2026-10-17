"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import ReviewForm from "@/components/reviews/ReviewForm";

/**
 * The review ask that appears at the end of a prediction: 4 quick questions
 * (interface, agreement, text, stars) whose answers feed the home-page carousel
 * and the Public Reviews page.
 */
export default function ReadingReview({ defaultName }: { defaultName?: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);

  return (
    <section id="review" className="no-print mt-14 scroll-mt-24">
      <div className="glass-strong rounded-3xl border border-gold-400/25 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-400/15">
            <HeartHandshake className="h-5 w-5 text-gold-300" />
          </span>
          <div>
            <h2 className="font-display text-xl text-white sm:text-2xl">{t.reviews.postTitle}</h2>
            <p className="mt-1 text-sm text-slate-300">{t.reviews.postSub}</p>
          </div>
        </div>
        <div className="mt-6">
          {done ? (
            <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{t.reviews.saved}</p>
          ) : (
            <ReviewForm defaultName={defaultName} onSaved={() => setDone(true)} />
          )}
        </div>
      </div>
    </section>
  );
}
