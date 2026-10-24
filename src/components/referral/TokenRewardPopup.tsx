"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Crown, Gift, Sparkles, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { ULTRA_PRICE_INR, ULTRA_TOKEN_COST, tokenProgress } from "@/lib/token-rules";

interface Reward {
  id: string;
  tokens: number;
  balance: number;
  createdAt: string;
}

const SPARKS = [
  { left: "8%", top: "18%", delay: 0, size: 18 },
  { left: "18%", top: "8%", delay: 0.35, size: 12 },
  { left: "31%", top: "22%", delay: 0.7, size: 20 },
  { left: "44%", top: "9%", delay: 0.15, size: 10 },
  { left: "57%", top: "20%", delay: 0.9, size: 16 },
  { left: "69%", top: "7%", delay: 0.5, size: 14 },
  { left: "82%", top: "17%", delay: 0.2, size: 22 },
  { left: "91%", top: "30%", delay: 0.75, size: 11 },
  { left: "12%", top: "42%", delay: 1.1, size: 10 },
  { left: "88%", top: "47%", delay: 0.4, size: 15 },
  { left: "22%", top: "68%", delay: 0.6, size: 11 },
  { left: "77%", top: "72%", delay: 1.25, size: 13 },
];

/**
 * Gift/sparkles popup for an unacknowledged referral reward. The reward is
 * created server-side when the referred account is created; this component
 * shows it on the referrer's next dashboard visit and acknowledges it so it
 * never appears twice.
 */
export default function TokenRewardPopup() {
  const { L, cl } = useLang();
  const reduceMotion = useReducedMotion();
  const [reward, setReward] = useState<Reward | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const checking = useRef(false);

  const load = useCallback(() => {
    if (checking.current) return;
    checking.current = true;
    fetch("/api/tokens/rewards/pending", { cache: "no-store" })
      .then(async (res) =>
        res.ok ? ((await res.json().catch(() => ({}))) as { reward?: Reward | null }) : null,
      )
      .then((data) => {
        if (data?.reward) {
          setReward(data.reward);
          setOpen(true);
        }
      })
      .catch(() => {
        /* the next focus/visit retries */
      })
      .finally(() => {
        checking.current = false;
      });
  }, []);

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void dismiss();
    };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function dismiss() {
    if (!reward || busy) {
      setOpen(false);
      return;
    }
    setBusy(true);
    setOpen(false);
    try {
      await fetch("/api/tokens/rewards/ack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reward.id }),
      });
    } catch {
      /* it will be shown again next visit, which is safer than losing it */
    } finally {
      setBusy(false);
      window.setTimeout(() => setReward(null), 350);
    }
  }

  const progress = reward ? tokenProgress(reward.balance) : null;

  return (
    <AnimatePresence>
      {open && reward && progress && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => void dismiss()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="token-reward-title"
            aria-describedby="token-reward-desc"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-2 border-gold-400/50 bg-gradient-to-br from-cosmic-900 via-mystic-800 to-cosmic-950 p-6 text-center shadow-2xl sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {SPARKS.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute text-gold-300"
                  style={{ left: s.left, top: s.top }}
                  initial={{ opacity: 0, y: 12, scale: 0.4, rotate: 0 }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.65, scale: 0.9 }
                      : { opacity: [0, 1, 0], y: [12, -14, -32], scale: [0.4, 1, 0.5], rotate: [0, 35, 80] }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 2.8, delay: s.delay, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut" }
                  }
                >
                  <Sparkles style={{ width: s.size, height: s.size }} />
                </motion.span>
              ))}
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={() => void dismiss()}
              className="absolute right-3 top-3 z-10 rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label={L({ en: "Close reward popup", hi: "रिवॉर्ड पॉपअप बंद करें" })}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <motion.div
                initial={reduceMotion ? false : { rotate: -8, scale: 0.8 }}
                animate={reduceMotion ? undefined : { rotate: [0, -5, 5, 0], scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-300/60 bg-gradient-to-br from-gold-400/30 to-mystic-600/30 text-gold-200 shadow-[0_0_40px_rgba(245,194,66,0.35)]"
              >
                <Gift className="h-9 w-9" />
              </motion.div>

              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-300">
                ✦ {L({ en: "Referral reward", hi: "रेफरल रिवॉर्ड" })}
              </p>
              <h2 id="token-reward-title" className="mt-2 font-display text-3xl text-white sm:text-4xl">
                {L({
                  en: `${reward.tokens} tokens credited!`,
                  hi: `${reward.tokens} टोकन क्रेडिट हो गए!`,
                })}
              </h2>
              <p id="token-reward-desc" className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-300">
                {L({
                  en: "Your referral created an account. The reward is now in your token wallet.",
                  hi: "आपके रेफरल से एक अकाउंट बना। रिवॉर्ड अब आपके टोकन वॉलेट में जुड़ गया है।",
                })}
              </p>

              <div className="mt-5 rounded-2xl border border-gold-400/25 bg-black/25 px-4 py-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{L({ en: "New balance", hi: "नया बैलेंस" })}</span>
                  <span className="font-display text-2xl text-gold-200">{reward.balance}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-200"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                  {progress.ready
                    ? L({
                        en: `You have enough tokens to unlock Ultra Pro (₹${ULTRA_PRICE_INR}).`,
                        hi: `आपके पास Ultra Pro (₹${ULTRA_PRICE_INR}) अनलॉक करने के लिए पर्याप्त टोकन हैं।`,
                      })
                    : L({
                        en: `${progress.remaining} more tokens to ${ULTRA_TOKEN_COST}. Tokens are only for Ultra Pro, never for the ₹51 Pro report.`,
                        hi: `${ULTRA_TOKEN_COST} तक ${progress.remaining} टोकन और चाहिए। टोकन सिर्फ Ultra Pro के लिए हैं, ₹51 की Pro रिपोर्ट के लिए नहीं।`,
                      })}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={progress.ready ? "/dashboard/readings" : "/dashboard"}
                  onClick={() => void dismiss()}
                  className="btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  {progress.ready ? (
                    <>
                      <Crown className="h-4 w-4" /> {L({ en: "Unlock Ultra Pro", hi: "Ultra Pro अनलॉक करें" })}
                    </>
                  ) : (
                    <>
                      {L({ en: "View my wallet", hi: "मेरा वॉलेट देखें" })} <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => void dismiss()}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  {L({ en: "Later", hi: "बाद में" })}
                </button>
              </div>
              <p className="mt-3 text-[10px] text-slate-500">
                {new Date(reward.createdAt).toLocaleDateString(cl === "hi" ? "hi-IN" : "en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
