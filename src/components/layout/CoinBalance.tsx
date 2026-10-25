"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";

/**
 * Live coin balance in the top-right corner.
 *
 * Signed-in readers see their real wallet; guests see the 50-coin signup offer.
 * Chat dispatches `hr:coins` after every billed minute, so the number moves
 * without a full page reload. Focus also refreshes it after a referral credit.
 */
export default function CoinBalance({
  signedIn,
  initialBalance,
  compact,
}: {
  signedIn: boolean;
  initialBalance: number | null;
  compact?: boolean;
}) {
  const { L } = useLang();
  const [balance, setBalance] = useState(initialBalance ?? 0);

  useEffect(() => {
    if (!signedIn) return;
    let alive = true;

    const refresh = async () => {
      try {
        const res = await fetch("/api/tokens/balance", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as { balance?: number } | null;
        if (alive && typeof data?.balance === "number") setBalance(data.balance);
      } catch {
        /* keep the last known balance */
      }
    };

    const onCoins = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      if (typeof detail?.balance === "number") setBalance(detail.balance);
    };

    window.addEventListener("hr:coins", onCoins);
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      window.removeEventListener("hr:coins", onCoins);
      window.removeEventListener("focus", refresh);
    };
  }, [signedIn]);

  if (!signedIn) {
    return (
      <Link
        href="/register"
        title={L({ en: "Create an account and get 50 free coins", hi: "अकाउंट बनाएँ और 50 फ्री कॉइन पाएँ" })}
        className="flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1.5 text-xs font-semibold text-gold-100 transition hover:border-gold-400/60 hover:bg-gold-400/15"
      >
        <Coins className="h-3.5 w-3.5 text-gold-300" />
        <span>50</span>
        <span className={cn("text-gold-200/80", compact ? "sr-only" : "hidden lg:inline")}>
          {L({ en: "free", hi: "फ्री" })}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard#wallet"
      title={L({ en: "Your coin wallet", hi: "आपका कॉइन वॉलेट" })}
      className="flex items-center gap-1.5 rounded-full border border-gold-400/35 bg-gold-400/12 px-2.5 py-1.5 text-xs font-semibold text-gold-100 transition hover:border-gold-400/70 hover:bg-gold-400/20"
    >
      <Coins className="h-3.5 w-3.5 text-gold-300" />
      <span>{balance}</span>
      <span className="sr-only">{L({ en: "coins", hi: "कॉइन" })}</span>
    </Link>
  );
}
