"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Gift, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { DIWALI_OFFER } from "@/lib/diwali-offer";

/**
 * Pro-only Diwali Puja PDF card.
 *
 * The actual Drive URL is fetched from /api/readings/[id]/diwali-puja, which
 * only answers for a Pro-unlocked reading. The URL never enters the JS bundle.
 */
export default function DiwaliPujaCard({ readingId, onBuy }: { readingId: string; onBuy?: () => void }) {
  const { L } = useLang();
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "none" | "error">("loading");

  useEffect(() => {
    let alive = true;
    fetch(`/api/readings/${readingId}/diwali-puja`)
      .then(async (res) => {
        // 403 means "not bought yet" — a normal state for a Pro report without
        // the ₹99 add-on, not a network error.
        if (res.status === 403) return { url: null };
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: { url?: string | null }) => {
        if (!alive) return;
        setUrl(data.url ?? null);
        setState(data.url ? "ready" : "none");
      })
      .catch(() => {
        if (alive) setState("error");
      });
    return () => {
      alive = false;
    };
  }, [readingId]);

  return (
    <section className="no-print relative mt-6 overflow-hidden rounded-[2rem] border-2 border-gold-400/55 bg-gradient-to-br from-gold-400/18 via-cosmic-800/75 to-mystic-700/25 p-6 sm:p-8 gold-glow">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="relative">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
          <Gift className="h-4 w-4" /> {L(DIWALI_OFFER.badge)} · {L(DIWALI_OFFER.eyebrow)}
        </p>
        <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">{L(DIWALI_OFFER.title)}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-100">{L(DIWALI_OFFER.sub)}</p>

        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {DIWALI_OFFER.bullets.map((bullet) => (
            <li key={bullet.en} className="flex items-start gap-2 text-sm text-gold-50">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {L(bullet)}
            </li>
          ))}
        </ul>

        {state === "ready" && url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
          >
            <ExternalLink className="h-4 w-4" /> {L(DIWALI_OFFER.download)}
          </a>
        ) : state === "loading" ? (
          <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-gold-300" /> {L(DIWALI_OFFER.opening)}
          </p>
        ) : state === "none" && onBuy ? (
          <div className="mt-5">
            <button type="button" onClick={onBuy} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
              <Gift className="h-4 w-4" /> {L(DIWALI_OFFER.cta)}
            </button>
            <p className="mt-2 text-xs text-slate-300">{L(DIWALI_OFFER.locked)}</p>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-slate-200">
            {L(state === "error" ? DIWALI_OFFER.error : DIWALI_OFFER.soon)}
          </p>
        )}

        <p className="mt-3 text-xs italic text-slate-400">{L(DIWALI_OFFER.private)}</p>
      </div>
    </section>
  );
}
