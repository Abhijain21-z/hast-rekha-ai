"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, PenLine, Quote, Star, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Modal, cn } from "@/components/ui";
import ReviewForm, { type ReviewRow } from "./ReviewForm";

const IFACE_LABEL: Record<string, "ifGreat" | "ifGood" | "ifOkay" | "ifPoor"> = {
  great: "ifGreat",
  good: "ifGood",
  okay: "ifOkay",
  poor: "ifPoor",
};

export default function PublicReviews({ initial }: { initial: ReviewRow[] }) {
  const { t } = useLang();
  const [items, setItems] = useState<ReviewRow[]>(initial);
  const [writeOpen, setWriteOpen] = useState(false);

  // Server-rendered list first, then refresh from the API (so a review written
  // in another tab shows up without a hard reload).
  useEffect(() => {
    fetch("/api/reviews?all=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.reviews) setItems(d.reviews as ReviewRow[]);
      })
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    if (!items.length) return null;
    const avg = items.reduce((a, r) => a + (Number(r.rating) || 0), 0) / items.length;
    const answered = items.filter((r) => typeof r.agrees === "boolean");
    const yes = answered.filter((r) => r.agrees).length;
    return { avg: avg.toFixed(1), count: items.length, agreePct: answered.length ? Math.round((yes / answered.length) * 100) : null };
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">{t.reviews.allTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300/90">{t.reviews.allSub}</p>
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setWriteOpen(true)} icon={<PenLine className="h-4 w-4" />}>
            {t.reviews.write}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-gold-300 sm:text-3xl">{stats.avg}</p>
            <p className="mt-1 text-xs text-slate-400">{t.reviews.avgRating}</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-gold-300 sm:text-3xl">{stats.count}</p>
            <p className="mt-1 text-xs text-slate-400">{t.reviews.count}</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="font-display text-2xl text-emerald-200 sm:text-3xl">{stats.agreePct === null ? "—" : `${stats.agreePct}%`}</p>
            <p className="mt-1 text-xs text-slate-400">{t.reviews.agreeLabel}</p>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="glass mt-10 rounded-3xl p-10 text-center text-sm text-slate-400">{t.reviews.allEmpty}</p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((r, i) => (
            <article key={r.id ?? `${r.name}-${i}`} className="glass relative flex flex-col rounded-3xl p-6">
              <Quote className="absolute right-5 top-5 h-7 w-7 text-gold-400/20" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={cn("h-4 w-4", s < r.rating ? "fill-gold-400 text-gold-400" : "text-slate-600")} />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">“{r.text}”</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.interfaceRating && IFACE_LABEL[r.interfaceRating] && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                    {t.reviews[IFACE_LABEL[r.interfaceRating]]}
                  </span>
                )}
                {typeof r.agrees === "boolean" && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                      r.agrees ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200",
                    )}
                  >
                    {r.agrees ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
                    {r.agrees ? t.reviews.agreeYes : t.reviews.agreeNo}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-white/8 pt-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-mystic-600 to-cosmic-800 text-sm font-semibold text-white ring-2 ring-gold-400/40">
                  {r.name.slice(0, 1).toUpperCase()}
                </span>
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-300">
                  <Users className="h-3.5 w-3.5" /> {t.reviews.community}
                  <BadgeCheck className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title={t.reviews.write}>
        <ReviewForm
          onSaved={(review) => {
            setItems((all) => [review as ReviewRow, ...all]);
            setWriteOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
