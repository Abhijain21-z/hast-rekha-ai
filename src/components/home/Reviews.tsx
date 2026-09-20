"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, BadgeCheck, PenLine, Users } from "lucide-react";
import testimonialsJson from "@/content/testimonials.json";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Avatar, Button, Input, Label, Modal, SectionHeading, Textarea, cn } from "@/components/ui";
import type { Bi } from "@/lib/i18n";

interface ReviewItem { name: string; location: Bi; rating: number; quote: Bi; user?: boolean }

const SEED = testimonialsJson as { name: string; location: Bi; rating: number; quote: Bi }[];

export default function Reviews() {
  const { t, L, lang } = useLang();
  const { toast } = useToast();
  const [items, setItems] = useState<ReviewItem[]>(SEED);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const [paused, setPaused] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.reviews) return;
        const userReviews: ReviewItem[] = (d.reviews as { name: string; rating: number; text: string }[]).map((r) => ({
          name: r.name,
          rating: r.rating,
          user: true,
          location: { en: t.reviews.community, hi: t.reviews.community },
          quote: { en: r.text, hi: r.text },
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

  const max = Math.max(0, items.length - visible);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 4500);
    return () => clearInterval(id);
  }, [max, paused]);
  useEffect(() => { if (index > max) setIndex(max); }, [max, index]);

  const go = (d: number) => setIndex((i) => Math.min(max, Math.max(0, i + d)));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (form.text.trim().length < 10) return setErr(t.reviews.errText);
    setBusy(true);
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, lang }) });
    setBusy(false);
    if (!res.ok) return setErr(t.common.error);
    const { review } = (await res.json()) as { review: { name: string; rating: number; text: string } };
    setItems((all) => [{ name: review.name, rating: review.rating, user: true, location: { en: t.reviews.community, hi: t.reviews.community }, quote: { en: review.text, hi: review.text } }, ...all]);
    setIndex(0);
    setWriteOpen(false);
    setForm({ name: "", rating: 5, text: "" });
    toast(t.reviews.saved);
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
            <motion.div className="flex" animate={{ x: `-${(index * 100) / visible}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }}>
              {items.map((r, i) => (
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
            <button onClick={() => go(-1)} disabled={index === 0} className="rounded-full border border-white/10 p-2.5 text-slate-200 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex max-w-[50vw] gap-2 overflow-hidden">
              {Array.from({ length: max + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={cn("h-2 shrink-0 rounded-full transition-all", i === index ? "w-7 bg-gold-400" : "w-2 bg-white/20 hover:bg-white/40")} aria-label={`Go to ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => go(1)} disabled={index === max} className="rounded-full border border-white/10 p-2.5 text-slate-200 transition hover:border-gold-400/50 hover:text-gold-300 disabled:opacity-30" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>

      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title={t.reviews.write}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>{t.reviews.yourName}</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Priya Sharma" maxLength={80} />
          </div>
          <div>
            <Label>{t.reviews.rating}</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button type="button" key={s} onClick={() => setForm({ ...form, rating: s })} aria-label={`${s} stars`}>
                  <Star className={cn("h-7 w-7 transition", s <= form.rating ? "fill-gold-400 text-gold-400" : "text-slate-600 hover:text-slate-400")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>{t.reviews.yourText}</Label>
            <Textarea required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} maxLength={1200} />
            {err && <p className="mt-1.5 text-xs text-rose-300">{err}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setWriteOpen(false)}>{t.dash.cancel}</Button>
            <Button type="submit" loading={busy}>{t.reviews.submit}</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
