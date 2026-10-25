"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, Crown, Gift, MessageCircle, Share2, Sparkles, TrendingUp } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Card, cn } from "@/components/ui";
import { REFERRAL_TOKEN_REWARD, ULTRA_PRICE_INR, ULTRA_TOKEN_COST, tokenProgress } from "@/lib/token-rules";

interface LedgerRow {
  id: string;
  delta: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

/**
 * Dashboard wallet: balance, progress to the 350-token Ultra Pro unlock, the
 * shareable referral link, and a short statement. Pro (Rs 51) is deliberately
 * excluded from every token path.
 */
export default function ReferralCard({
  balance,
  referralCode,
  referralLink,
  referralCount,
  ledger,
}: {
  balance: number;
  referralCode: string | null;
  referralLink: string | null;
  referralCount: number;
  ledger: LedgerRow[];
}) {
  const { L, cl } = useLang();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const progress = useMemo(() => tokenProgress(balance), [balance]);

  async function copy() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast(L({ en: "Referral link copied.", hi: "रेफरल लिंक कॉपी हो गया।" }));
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast(L({ en: "Copy failed. Please try again.", hi: "कॉपी नहीं हुआ — दोबारा कोशिश करें।" }), "error");
    }
  }

  const shareText = L({
    en: "Get your free palm + kundli reading on Hast Rekha AI. Create your account and you get 50 free coins — I get 50 too.",
    hi: "Hast Rekha AI पर अपनी मुफ़्त हस्तरेखा + कुंडली रीडिंग लें। अकाउंट बनाइए और 50 मुफ़्त कॉइन पाइए — मुझे भी 50 मिलेंगे।",
  });

  const whatsapp = referralLink
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${referralLink}`)}`
    : null;

  async function nativeShare() {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Hast Rekha AI", text: shareText, url: referralLink });
        return;
      } catch {
        /* dismissed */
      }
    }
    void copy();
  }

  return (
    <Card strong className="relative overflow-hidden p-6 sm:p-7">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">
              <Gift className="h-4 w-4" /> {L({ en: "Token wallet", hi: "टोकन वॉलेट" })}
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="font-display text-4xl text-white">{balance}</p>
              <p className="pb-1 text-sm text-slate-400">{L({ en: "tokens", hi: "टोकन" })}</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {L({
                en: `50 welcome coins on signup (1 token = 1 coin). Every referral adds ${REFERRAL_TOKEN_REWARD} for you and gives your friend 50. Chat costs 10 coins per started minute; ${ULTRA_TOKEN_COST} tokens = one Ultra Pro report (₹${ULTRA_PRICE_INR}).`,
                hi: `साइनअप पर 50 वेलकम कॉइन (1 टोकन = 1 कॉइन)। हर रेफरल पर आपको ${REFERRAL_TOKEN_REWARD} और आपके दोस्त को 50 मिलते हैं। चैट पर हर शुरू हुए मिनट के 10 कॉइन; ${ULTRA_TOKEN_COST} टोकन = एक Ultra Pro रिपोर्ट (₹${ULTRA_PRICE_INR})।`,
              })}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/15 text-gold-200">
            <Sparkles className="h-6 w-6" />
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gold-200">
              {progress.ready
                ? L({ en: "Ultra Pro unlock ready", hi: "Ultra Pro अनलॉक तैयार" })
                : L({ en: `${progress.remaining} more tokens to Ultra Pro`, hi: `Ultra Pro तक ${progress.remaining} टोकन और` })}
            </span>
            <span className="text-slate-400">{progress.balance}/{progress.cost}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-200 transition-all duration-700"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            {L({
              en: `Tokens never pay for the ₹51 Pro report — Pro is always a real payment. Use tokens only for the ₹${ULTRA_PRICE_INR} Ultra Pro plan.`,
              hi: `टोकन से ₹51 की Pro रिपोर्ट नहीं मिलती — Pro हमेशा असली पेमेंट से है। टोकन सिर्फ ₹${ULTRA_PRICE_INR} के Ultra Pro प्लान के लिए हैं।`,
            })}
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2.5">
            <Share2 className="h-4 w-4 shrink-0 text-gold-300" />
            <input
              readOnly
              value={referralLink ?? L({ en: "Creating your link…", hi: "आपका लिंक बन रहा है…" })}
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-200 outline-none"
              aria-label={L({ en: "Your referral link", hi: "आपका रेफरल लिंक" })}
            />
            <button
              type="button"
              onClick={() => void copy()}
              disabled={!referralLink}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs font-medium text-gold-200 transition hover:bg-gold-400/20 disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? L({ en: "Copied", hi: "कॉपी" }) : L({ en: "Copy", hi: "कॉपी" })}
            </button>
          </div>
          <div className="flex gap-2">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3.5 py-2 text-xs font-medium text-emerald-100 transition hover:bg-emerald-400/20"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={() => void nativeShare()}
              disabled={!referralLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              <Share2 className="h-3.5 w-3.5" /> {L({ en: "Share", hi: "शेयर" })}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
            {L({ en: "Successful referrals", hi: "सफल रेफरल" })}: <b className="text-white">{referralCount}</b>
          </span>
          {referralCode && (
            <span className="rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1.5 text-gold-200">
              {L({ en: "Your code", hi: "आपका कोड" })}: <b>{referralCode}</b>
            </span>
          )}
          {progress.ready && (
            <Link href="/dashboard/readings" className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-1.5 font-semibold text-gold-100 hover:bg-gold-400/30">
              <Crown className="h-3.5 w-3.5" /> {L({ en: "Unlock Ultra Pro", hi: "Ultra Pro अनलॉक करें" })}
            </Link>
          )}
        </div>

        {ledger.length > 0 && (
          <div className="mt-5 border-t border-white/8 pt-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <TrendingUp className="h-3.5 w-3.5 text-gold-300" /> {L({ en: "Recent activity", hi: "हाल की गतिविधि" })}
            </p>
            <ul className="mt-2 space-y-1.5">
              {ledger.slice(0, 5).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="min-w-0 truncate text-slate-300">
                    {row.reason === "signup_bonus"
                      ? L({ en: "Welcome bonus", hi: "वेलकम बोनस" })
                      : row.reason === "referral_signup"
                        ? L({ en: "Referral reward", hi: "रेफरल रिवॉर्ड" })
                        : row.reason === "chat_time"
                          ? L({ en: "AI Panditji chat", hi: "AI पंडितजी चैट" })
                          : row.reason === "chat_refund"
                            ? L({ en: "Chat refund", hi: "चैट रिफंड" })
                            : row.reason === "ultra_redemption"
                              ? L({ en: "Ultra Pro unlock", hi: "Ultra Pro अनलॉक" })
                              : L({ en: "Token adjustment", hi: "टोकन समायोजन" })}
                    <span className="ml-2 text-slate-500">
                      {new Date(row.createdAt).toLocaleDateString(cl === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </span>
                  <span className={cn("shrink-0 font-semibold", row.delta > 0 ? "text-emerald-300" : "text-rose-300")}>
                    {row.delta > 0 ? "+" : ""}{row.delta}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
