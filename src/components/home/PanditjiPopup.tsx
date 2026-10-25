"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import PanditjiAvatar from "@/components/chat/PanditjiAvatar";

/** Show the welcome offer again after a day, not on every page refresh. */
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "hr_free_analysis_popup_at";
/** The owner asked for the prompt six seconds after landing. */
const OPEN_DELAY_MS = 6_000;

const UI = {
  eyebrow: { en: "AI Jyotishi", hi: "AI ज्योतिषी" },
  title: { en: "Hastrekha Panditji", hi: "हस्तरेखा पंडितजी" },
  sub: {
    en: "Panditji se chat karne ke liye click karein",
    hi: "Panditji se chat karne ke liye click karein",
  },
  question: {
    en: "Would you like a complete free analysis of your palmistry and kundli?",
    hi: "क्या आप अपनी हस्तरेखा और कुंडली का संपूर्ण निःशुल्क विश्लेषण प्राप्त करना चाहते हैं?",
  },
  body: {
    en: "Your Moon sign, Nakshatra, Lagna and palm lines — explained in Hindi or English, with no payment and no card.",
    hi: "आपकी चंद्र राशि, नक्षत्र, लग्न और हस्तरेखाएँ — हिंदी या English में, बिना भुगतान और बिना कार्ड।",
  },
  yes: { en: "Yes, start free analysis", hi: "हाँ, मुफ़्त विश्लेषण शुरू करें" },
  later: { en: "Not now", hi: "अभी नहीं" },
  chat: { en: "Or chat with Panditji", hi: "या पंडितजी से चैट करें" },
  free: { en: "100% free · no card", hi: "100% मुफ़्त · कोई कार्ड नहीं" },
  close: { en: "Close free analysis popup", hi: "मुफ़्त विश्लेषण पॉपअप बंद करें" },
};

function recentlyDismissed() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const at = Number(raw);
    return Number.isFinite(at) && Date.now() - at < COOLDOWN_MS;
  } catch {
    // Private mode / storage disabled: show once per page load rather than never.
    return false;
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* the popup simply may reappear on the next visit */
  }
}

/**
 * Six-second welcome popup: asks whether the visitor wants a free palm +
 * kundli analysis, and sends "Yes" straight into the reading flow.
 *
 * It is a small bottom-corner card, not a blocking modal, so the hero stays
 * usable. "No" and "close" suppress it for a day.
 */
export default function PanditjiPopup() {
  const { L } = useLang();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    rememberDismissal();
  }, []);

  useEffect(() => {
    if (recentlyDismissed()) return;
    timerRef.current = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, dismiss]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[95] flex justify-center p-3 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:justify-end sm:p-0"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
        >
          <div
            role="dialog"
            aria-labelledby="panditji-popup-title"
            aria-describedby="panditji-popup-desc"
            className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-gold-400/40 bg-gradient-to-br from-cosmic-900 via-mystic-800/95 to-cosmic-950 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:w-[22rem]"
          >
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold-400/15 blur-3xl" />
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />

            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              className="absolute right-2.5 top-2.5 z-10 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label={L(UI.close)}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-1 rounded-full bg-gold-400/25 blur-lg" />
                <PanditjiAvatar size={72} className="relative" />
              </div>
              <div className="min-w-0 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300/90">
                  ✦ {L(UI.eyebrow)}
                </p>
                <h2 id="panditji-popup-title" className="font-display text-xl leading-tight text-white">
                  {L(UI.title)}
                </h2>
                <p className="mt-1 text-[13px] font-medium leading-snug text-gold-200">{L(UI.sub)}</p>
              </div>
            </div>

            <p className="relative mt-3 text-sm font-semibold leading-snug text-white">
              {L(UI.question)}
            </p>
            <p id="panditji-popup-desc" className="relative mt-1.5 text-xs leading-relaxed text-slate-300">
              {L(UI.body)}
            </p>

            <div className="relative mt-4 flex flex-col gap-2">
              <Link
                href="/reading"
                onClick={dismiss}
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <Sparkles className="h-4 w-4" /> {L(UI.yes)} <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 rounded-full border border-white/15 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {L(UI.later)}
                </button>
                <Link
                  href="/chat"
                  onClick={dismiss}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> {L(UI.chat)}
                </Link>
              </div>
            </div>

            <p className="relative mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-emerald-200/90">
              <Sparkles className="h-3 w-3" /> {L(UI.free)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
