"use client";

import { Share2 } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * Share the current page. Uses the native share sheet when the device has one,
 * falls back to copying the text, then to WhatsApp. Every path is guarded so a
 * blocked/unsupported API can never throw in the user's face.
 */
export default function ShareButton({ compact }: { compact?: boolean }) {
  const { t } = useLang();
  const { toast } = useToast();

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${t.top.shareText}\n${url}`;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: t.brand, text: t.top.shareText, url });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast(t.top.shareCopied);
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } catch {
      /* user cancelled the share sheet, or the API is unavailable — stay quiet */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      title={t.top.share}
      aria-label={t.top.share}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-gold-400/50"
    >
      <Share2 className="h-3.5 w-3.5 text-gold-300" />
      {!compact && <span className="hidden sm:inline">{t.top.share}</span>}
    </button>
  );
}
