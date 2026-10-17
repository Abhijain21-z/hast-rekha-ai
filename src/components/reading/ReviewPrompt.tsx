"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Modal } from "@/components/ui";
import ReviewForm from "@/components/reviews/ReviewForm";

/**
 * How long the visitor reads the prediction before we quietly ask for a review.
 * `NEXT_PUBLIC_REVIEW_PROMPT_MS` exists so the delay can be shortened while
 * testing the flow; production leaves it unset and waits five minutes.
 */
const DELAY_MS = Number(process.env.NEXT_PUBLIC_REVIEW_PROMPT_MS ?? "") > 0 ? Number(process.env.NEXT_PUBLIC_REVIEW_PROMPT_MS) : 5 * 60 * 1000;
const askKey = (readingId: string) => `hr_review_asked_${readingId}`;

/**
 * The review popup that opens by itself five minutes after a prediction is on
 * screen. It fires at most once per reading (the flag is written as soon as it
 * opens), so nobody gets nagged, and it never blocks the report — closing it is
 * always one click away.
 */
export default function ReviewPrompt({ readingId, defaultName }: { readingId?: string; defaultName?: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!readingId) return;
    try {
      if (window.localStorage.getItem(askKey(readingId))) return;
    } catch {
      // Private mode / storage disabled: fall through and show it once per visit.
    }
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(askKey(readingId), "1");
      } catch {}
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [readingId]);

  if (!readingId) return null;

  return (
    <Modal open={open} onClose={() => setOpen(false)} title={t.reviews.postTitle}>
      <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
        <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
        {t.reviews.popupSub}
      </p>
      <div className="mt-5">
        {done ? (
          <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{t.reviews.saved}</p>
        ) : (
          <ReviewForm
            defaultName={defaultName}
            onSaved={() => {
              setDone(true);
              window.setTimeout(() => setOpen(false), 1600);
            }}
          />
        )}
      </div>
    </Modal>
  );
}
