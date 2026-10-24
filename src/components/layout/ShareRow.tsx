"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/components/ui";

/**
 * Explicit share row for high-intent pages. Every outbound link carries a UTM
 * tag so Vercel Analytics can attribute the visit to the channel that sent it.
 */
export default function ShareRow({
  path,
  text,
  className,
}: {
  /** Site-relative path, optionally with a query string (e.g. /rashifal?sign=mesha). */
  path: string;
  /** Pre-filled message; the URL is appended by the share target. */
  text: string;
  className?: string;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Always share the canonical www URL, never the current host. This avoids
  // apex-to-www redirect hops and keeps server/client markup identical.
  const base = `${SITE_URL}${path}`;
  const tagged = (source: string, medium = "social") => {
    const url = new URL(base, SITE_URL);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", "share");
    return url.toString();
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text}\n${tagged("whatsapp")}`)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(tagged("telegram"))}&text=${encodeURIComponent(text)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(tagged("x"))}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tagged("facebook"))}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(tagged("copy", "referral"));
      setCopied(true);
      toast("Link copied — share it with someone who needs it.");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast("Copy failed. Please copy the address bar link.", "error");
    }
  }

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-100";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Share this page">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/80">
        <Share2 className="h-3.5 w-3.5" /> Share
      </span>
      <a className={pill} href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
        <MessageCircle className="h-3.5 w-3.5 text-emerald-300" /> WhatsApp
      </a>
      <a className={pill} href={telegram} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
        <Send className="h-3.5 w-3.5 text-sky-300" /> Telegram
      </a>
      <a className={pill} href={x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <span className="text-[11px] font-bold text-slate-100">X</span> Post
      </a>
      <a className={pill} href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <span className="text-[11px] font-bold text-blue-300">f</span> Facebook
      </a>
      <button type="button" onClick={() => void copy()} className={pill} aria-label="Copy link">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5 text-gold-300" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
