"use client";

/**
 * Tiny helpers for the "कुछ देखो, कुछ तीर" gate on the reading page.
 *
 * - `ProText` keeps the full free text visible.
 * - `ProReadMore` blurs the last one or two sentences of the real text and
 *   reveals that same text after Pro unlocks. No placeholder copy.
 *
 * The component is intentionally dumb and local: no global store, no network
 * calls, and it stays quiet once the report has been unlocked.
 */

import { useState, type ReactNode } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { ProPaywallModal, type ProPlan } from "./ProPaywall";

/**
 * Split a paragraph so most of it stays readable and only the last one or two
 * sentences become the blurred Pro teaser. Splitting by sentence keeps the
 * readable part complete instead of cutting a word in half.
 */
export function splitProTail(text: string): { head: string; tail: string } {
  const clean = text.trim();
  if (!clean) return { head: "", tail: "" };

  const parts =
    clean
      .match(/[^।.!?]+[।.!?]+["'”’)\]]?|[^।.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? [clean];

  if (parts.length < 2) {
    const words = clean.split(/\s+/);
    const cut = Math.max(1, Math.floor(words.length * 0.7));
    return { head: words.slice(0, cut).join(" "), tail: words.slice(cut).join(" ") };
  }

  const tailCount = parts.length >= 4 ? 2 : 1;
  return {
    head: parts.slice(0, -tailCount).join(" "),
    tail: parts.slice(-tailCount).join(" "),
  };
}

/**
 * Show the full free text without any inline highlight/blur. Free users keep
 * a complete reading, and only the Pro teaser at the end of a section is
 * blurred.
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
 * Real-content Pro gate. Pass the paragraph that should be unlocked as `text`;
 * free visitors see it with only the last one/two sentences blurred, and paid
 * visitors see the complete paragraph in the same place.
 */
export function ProReadMore({
  readingId,
  unlocked,
  onUnlocked,
  className,
  textClassName,
  text,
  children,
}: {
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
  className?: string;
  /** Typography for the paragraph itself. */
  textClassName?: string;
  /** Real locked paragraph. Only its tail is blurred for free visitors. */
  text?: string;
  /** Optional custom content when no plain-text paragraph is supplied. */
  children?: ReactNode;
}) {
  const { L } = useLang();
  const [plan, setPlan] = useState<ProPlan | null>(null);
  const hasMargin = className?.split(/\s+/).some((part) => part.startsWith("mt-"));
  const typography = textClassName ?? "text-sm text-slate-200 sm:text-[15px]";

  if (unlocked) {
    if (!text && !children) return null;
    return (
      <div className={cn("leading-relaxed", typography, !hasMargin && "mt-3", className)}>
        {text ? <p>{text}</p> : children}
      </div>
    );
  }

  const split = text ? splitProTail(text) : null;

  return (
    <div className={cn("no-print", !hasMargin && "mt-3", className)}>
      {split ? (
        <p className={cn("leading-relaxed", typography)}>
          {split.head}
          {split.head ? " " : ""}
          <span aria-hidden className="select-none blur-[4px]">
            {split.tail}
          </span>
        </p>
      ) : children ? (
        <div aria-hidden className={cn("line-clamp-2 select-none blur-[4px]", typography)}>
          {children}
        </div>
      ) : null}
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
