"use client";

/**
 * Tiny helpers for the "कुछ देखो, कुछ तीर" gate on the reading page.
 *
 * - `ProText` keeps ~80% of any free paragraph readable and blurs the tail.
 * - `ProReadMore` opens the ₹51 Pro paywall (Cashfree) when clicked.
 *
 * The component is intentionally dumb and local: no global store, no network
 * calls, and it stays quiet once the report has been unlocked.
 */

import { useState } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { ProPaywallModal, type ProPlan } from "./ProPaywall";

/**
 * Show the full free text without any inline highlight/blur. Free users keep
 * a complete reading, and only a small teaser from the Pro plan is blurred.
 */
export function ProText({
  text,
  unlocked,
  className,
}: {
  text: string;
  unlocked: boolean;
  className?: string;
}) {
  // Intentionally keep the full text visible. Any inline redaction irritates
  // the reader and damages trust; the pro teaser lives in the read-more boom.
  void unlocked;
  return <span className={className}>{text}</span>;
}

/**
 * "और जानें" button that opens the Pro paywall on click. Rendered only while
 * the reading is still `locked` — once unlocked the protective blur/CTA is not
 * needed and shouldn't add extra noise.
 */
export function ProReadMore({
  readingId,
  unlocked,
  onUnlocked,
  className,
}: {
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
  className?: string;
}) {
  const { L } = useLang();
  const [plan, setPlan] = useState<ProPlan | null>(null);

  if (unlocked) return null;

  return (
    <div className={cn("no-print mt-5", className)}>
      <div
        aria-hidden
        className="select-none space-y-2 text-sm leading-relaxed text-slate-300 blur-[4px]"
      >
        <p>
          {L({
            en: "The remaining signs of your chart, exact timing and personal guidance are written ahead in detail.",
            hi: "आपकी कुंडली के बाकी संकेत, सटीक समय और व्यक्तिगत मार्गदर्शन यहां आगे विस्तार से लिखे गए हैं।",
          })}
        </p>
        <p>
          {L({
            en: "Detailed remedies, mantra guidance and your personal notes continue from here.",
            hi: "विस्तृत उपाय, मंत्र-विधि और आपकी व्यक्तिगत जानकारी यहां से आगे मिलती है।",
          })}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setPlan("pro")}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-cosmic-900/60 px-5 py-2.5 text-sm font-medium text-gold-100 transition hover:border-gold-400/70 hover:bg-gold-400/10"
      >
        <Lock className="h-4 w-4" />
        {L({ en: "Read the blurred text", hi: "पूरा पढ़ने के लिए यहां क्लिक करें" })}
        <ChevronRight className="h-4 w-4" />
      </button>

      <ProPaywallModal
        key={plan ?? "closed"}
        open={plan !== null}
        onClose={() => setPlan(null)}
        readingId={readingId}
        defaultPlan={plan ?? "pro"}
        onUnlocked={() => {
          setPlan(null);
          onUnlocked();
        }}
      />
    </div>
  );
}
