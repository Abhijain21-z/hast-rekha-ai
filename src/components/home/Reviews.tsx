"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, ChevronLeft, ChevronRight, PenLine, Quote, Star, Users } from "lucide-react";
import testimonialsJson from "@/content/testimonials.json";
import { useLang } from "@/components/providers/LanguageProvider";
import { Avatar, Button, Modal, SectionHeading, cn } from "@/components/ui";
import ReviewForm, { type ReviewRow } from "@/components/reviews/ReviewForm";
import { formatReviewDateTime } from "@/lib/review-date";
import type { Bi } from "@/lib/i18n";

interface ReviewItem {
  name: string;
  location: Bi;
  rating: number;
  quote: Bi;
  user?: boolean;
  createdAt?: string;
  expiresAt?: string | null;
}

const SEED = testimonialsJson as { name: string; location: Bi; rating: number; quote: Bi }[];

export default function Reviews() {
  const { t, L, lang } = useLang();
  const [items, setItems] = useState<ReviewItem[]>(SEED);
  const [now, setNow] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const [paused, setPaused] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.reviews) return;
        const userReviews: ReviewItem[] = (
          d.reviews as { name: string; rating: number; text: string; createdAt?: string; expiresAt?: string | null }[]
        ).map((r) => ({
          name: r.name,
          rating: r.rating,
          user: true,
          location: { en: t.reviews.community, hi: t.reviews.community },
          quote: { en: r.text, hi: r.text },
          createdAt: r.createdAt,
          expiresAt: r.expiresAt,
        }));
        setItems([...userReviews, ...SEED]);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Negative reviews vanish after their one-hour public window.
  const liveItems = useMemo(
    () => items.filter((r) => !r.expiresAt || new Date(r.expiresAt).getTime() > now),
    [items, now],
  );

  const max = Math.max(0, liveItems.length - visible);
  // Clamp for display so a shrinking list (resize / new item) never shows an out-of-range slide.
  const idx = Math.min(index, max);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 4500);
    return () => clearInterval(id);
  }, [max, paused]);

  const go = (d: number) => setIndex((i) => Math.min(max, Math.max(0, i + d)));

  function onSaved(review: ReviewRow) {
    setItems((all) => [
      {
        name: review.name,
        rating: review.rating,
        user: true,
        location: { en: t.reviews.community, hi: t.reviews.community },
        quote: { en: review.text, hi: review.text },
        createdAt: review.createdAt,
        expiresAt: review.expiresAt,
      },
      ...all,
    ]);
    setIndex(0);
    setWriteOpen(false);
  }

  return (
    <section id="reviews" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="✦ Reviews" title={t.reviews.title} sub={t.reviews.sub} />
        <div className="-mt-4 mb-6 flex justify-center">
          <Button variant="outline" onClick={() => setWriteOpen(true)} icon={<PenLine className="h-4 w-4" />}>{t.reviews.write}</Button>
        </div>

        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="overflow-hidden">
            <motion.div className="flex" animate={{ x: `-${(idx * 100) / visible}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }}>
              {liveItems.map((r, i) => (
                <div key={`${r.name}-${i}`} className="w-full shrink-0 px-2.5 sm:w-1/2 lg:w-1/3">
                  <div className="glass relative flex h-full flex-col rounded-3xl p-7">
                    <Quote className="absolute right-6 top-6 h-8 w-8 text-gold-400/20" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={cn("h-4 w-4", s < r.rating ? "fill-gold-400 text-gold-400" : "text-slate-600")} />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-200">“{L(r.quote)}”</p>
                    <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                      <Avatar name={r.name} size={44} />
                      <div>
                        <p className="text-sm font-semibold text-white">{r.name}</p>
                        <p className="text-xs text-slate-400">{L(r.location)}</p>
                        {r.createdAt && (
                          <time dateTime={r.createdAt} className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                            <CalendarDays className="h-3 w-3" /> {formatReviewDateTime(r.createdAt, lang)}
                          </time>
                        )}
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-300">
                        {r.user ? <Users className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />} {r.user ? t.reviews.community : t.reviews.verified}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} disabled={idx === 0} className="rounded-full border border-white/10 p-2.5 text-slate-200 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex max-w-[50vw] gap-2 overflow-hidden">
              {Array.from({ length: max + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={cn("h-2 shrink-0 rounded-full transition-all", i === idx ? "w-7 bg-gold-400" : "w-2 bg-white/20 hover:bg-white/40")} aria-label={`Go to ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => go(1)} disabled={idx === max} className="rounded-full border border-white/10 p-2.5 text-slate-200 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/reviews" className="text-sm text-gold-300 transition hover:text-gold-200 hover:underline">
              {t.reviews.seeAll} →
            </Link>
          </div>
        </div>
      </div>

      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title={t.reviews.write}>
        <ReviewForm onSaved={onSaved} />
      </Modal>
    </section>
  );
}
