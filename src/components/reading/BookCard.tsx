"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { BOOK_COPY } from "@/lib/premium";

/**
 * Ultra Pro extra: the Dhandayak (Gupt Khazana) book.
 *
 * The link is fetched from /api/readings/[id]/book, which only answers for an
 * Ultra-unlocked reading, so the URL never reaches anyone else's browser and
 * never sits in the JS bundle.
 */
export default function BookCard({ readingId }: { readingId: string }) {
  const { L } = useLang();
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "none" | "error">("loading");

  useEffect(() => {
    let alive = true;
    fetch(`/api/readings/${readingId}/book`)
      .then(async (res) => {
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
    <div className="no-print mt-6 rounded-[2rem] border-2 border-mystic-400/45 bg-cosmic-950/75 bg-gradient-to-br from-gold-400/12 via-cosmic-800/60 to-mystic-600/20 p-6 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">✦ Ultra Pro</p>
      <h3 className="mt-2 font-display text-2xl text-white">
        <BookOpen className="mr-2 inline h-6 w-6 text-gold-300" />
        {L(BOOK_COPY.title)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">{L(BOOK_COPY.sub)}</p>

      {state === "ready" && url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
          <ExternalLink className="h-4 w-4" /> {L(BOOK_COPY.cta)}
        </a>
      ) : state === "loading" ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-gold-300" /> {L(BOOK_COPY.opening)}
        </p>
      ) : (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-slate-200">
          {L(state === "error" ? BOOK_COPY.err : BOOK_COPY.soon)}
        </p>
      )}

      <p className="mt-3 text-xs italic text-slate-400">{L(BOOK_COPY.private)}</p>
    </div>
  );
}
