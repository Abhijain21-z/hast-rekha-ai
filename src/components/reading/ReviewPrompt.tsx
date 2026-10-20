"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Modal } from "@/components/ui";
import ReviewForm from "@/components/reviews/ReviewForm";

/**
 * The review popup. It waits until the visitor has actually finished the
 * prediction: the ask opens only after the page has been scrolled to the end,
 * so it never cuts a reading short. Fires at most once per reading (the flag
 * is written as soon as it opens), and closing is always one click away.
 */
export const reviewAskedKey = (readingId: string) => `hr_review_asked_${readingId}`;
/** Distance (px) from the page end that counts as "finished reading". */
const END_GAP = 360;
/** Small pause after reaching the end, so the last section is actually read. */
const SETTLE_MS = 2500;

/** Any open app modal (all Modal overlays share this z-layer) delays the ask. */
function anyModalOpen() {
  return !!document.querySelector('[class*="z-[9"]');
}

export default function ReviewPrompt({ readingId, defaultName }: { readingId?: string; defaultName?: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!readingId) return;
    const id: string = readingId;
    try {
      if (window.localStorage.getItem(reviewAskedKey(id))) return;
    } catch {
      // Private mode / storage disabled: fall through and show it once per visit.
    }
    let fired = false;
    let settle: number | undefined;
    let tick: number | undefined;

    function ask() {
      if (fired || anyModalOpen()) return;
      // Never interrupt someone who is typing (e.g. the inline review form).
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      fired = true;
      if (settle !== undefined) window.clearTimeout(settle);
      if (tick !== undefined) window.clearInterval(tick);
      try {
        window.localStorage.setItem(reviewAskedKey(id), "1");
      } catch {}
      setOpen(true);
    }

    function onScroll() {
      if (fired || settle !== undefined) return;
      const doc = document.documentElement;
      const atEnd = window.innerHeight + window.scrollY >= doc.scrollHeight - END_GAP;
      if (!atEnd) return;
      // Reached the end of the report — ask shortly after, once nothing else is open.
      settle = window.setTimeout(ask, SETTLE_MS);
      tick = window.setInterval(ask, 2500);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (settle !== undefined) window.clearTimeout(settle);
      if (tick !== undefined) window.clearInterval(tick);
    };
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
