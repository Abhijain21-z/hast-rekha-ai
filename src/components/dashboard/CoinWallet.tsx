"use client";

import Link from "next/link";
import { ArrowRight, Coins, MessageCircle, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Card, cn } from "@/components/ui";

interface LedgerRow {
  id: string;
  delta: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

const REASON_LABEL: Record<string, { en: string; hi: string }> = {
  signup_bonus: { en: "Welcome coins", hi: "स्वागत कॉइन" },
  chat_time: { en: "AI Panditji chat", hi: "AI पंडितजी चैट" },
  chat_refund: { en: "Chat refund", hi: "चैट रिफंड" },
  admin_adjustment: { en: "Adjustment", hi: "समायोजन" },
};

/**
 * The reader's coin wallet: live balance, how chat billing works, and the
 * last few ledger entries. Coins are only for AI chat — never for the ₹51
 * report, which is always paid in real money.
 */
export default function CoinWallet({ balance, ledger }: { balance: number; ledger: LedgerRow[] }) {
  const { L } = useLang();
  const minutes = Math.floor(balance / 10);

  return (
    <Card strong className="relative overflow-hidden p-6 sm:p-8">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              <Coins className="h-4 w-4" /> {L({ en: "Coin wallet", hi: "कॉइन वॉलेट" })}
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="font-display text-5xl leading-none text-gold-200">{balance}</span>
              <span className="pb-1 text-sm text-slate-300">
                {L({ en: "coins", hi: "कॉइन" })}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              {L({
                en: "Every account starts with 50 welcome coins. AI Panditji chat costs 10 coins per started minute — your balance covers about",
                hi: "हर अकाउंट में 50 स्वागत कॉइन मिलते हैं। AI पंडितजी चैट हर शुरू हुए मिनट पर 10 कॉइन लेती है — आपका बैलेंस लगभग",
              })}{" "}
              <b className="text-gold-200">
                {minutes} {L({ en: minutes === 1 ? "minute" : "minutes", hi: "मिनट" })}
              </b>
              . {L({ en: "Coins are never accepted for the ₹51 Pro report.", hi: "₹51 की प्रो रिपोर्ट के लिए कॉइन नहीं लिए जाते।" })}
            </p>
          </div>
          <Link
            href="/chat"
            className="btn-gold inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm sm:self-auto"
          >
            <MessageCircle className="h-4 w-4" /> {L({ en: "Open AI Panditji", hi: "AI पंडितजी खोलें" })}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
            <Sparkles className="h-3.5 w-3.5" /> {L({ en: "Recent coin activity", hi: "हाल की कॉइन गतिविधि" })}
          </p>
          {ledger.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">
              {L({ en: "No coin activity yet.", hi: "अभी कोई कॉइन गतिविधि नहीं।" })}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-white/8">
              {ledger.slice(0, 8).map((row) => {
                const label = REASON_LABEL[row.reason];
                return (
                  <li key={row.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="text-slate-300">
                      {label ? L(label) : row.reason}
                      <span className="ml-2 text-xs text-slate-500">
                        {new Date(row.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </span>
                    <span className={cn("font-semibold", row.delta >= 0 ? "text-emerald-300" : "text-rose-300")}>
                      {row.delta >= 0 ? "+" : ""}
                      {row.delta}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
