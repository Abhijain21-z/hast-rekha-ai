"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";

/**
 * Replace the generic share icon in the header with a referral entry point.
 * Signed-in readers land on their wallet; guests land on signup, where the
 * referral cookie/query is applied automatically.
 */
export default function ReferEarnButton({
  signedIn,
  compact,
}: {
  signedIn: boolean;
  compact?: boolean;
}) {
  const { L } = useLang();
  const label = L({ en: "Refer & Earn", hi: "रेफर करें" });

  return (
    <Link
      href={signedIn ? "/dashboard#wallet" : "/register"}
      title={L({
        en: "Refer & Earn — 50 coins for you and 50 for your friend",
        hi: "रेफर करें — आपको 50 कॉइन और आपके दोस्त को 50 कॉइन",
      })}
      className="flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1.5 text-xs font-semibold text-gold-100 transition hover:border-gold-400/60 hover:bg-gold-400/15"
    >
      <Gift className="h-3.5 w-3.5 text-gold-300" />
      <span className={compact ? "sr-only" : "hidden lg:inline"}>{label}</span>
    </Link>
  );
}
