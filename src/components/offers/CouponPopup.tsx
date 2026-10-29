"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Check, Copy, Sparkles, Tag, X } from "lucide-react";
import { COUPONS, COUPON_STORAGE_KEY, findCoupon } from "@/lib/coupons";

/** Shown once per browser session; the code is also saved for the paywall. */
const SEEN_KEY = "hr-coupon-popup-seen";
const DELAY_MS = 10_000;

const SKIP_PREFIXES = ["/admin", "/dashboard", "/payment", "/login", "/register"];

export default function CouponPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);
  const coupon = findCoupon("SAVE50") ?? COUPONS.SAVE50;

  const skip =
    !coupon ||
    (pathname ? SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix)) : false) ||
    pathname?.startsWith("/reading");

  useEffect(() => {
    if (skip || typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY)) return;

    let timer = 0;
    let retry = 0;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    };

    const onHomePopupClosed = () => {
      window.clearTimeout(timer);
      window.clearTimeout(retry);
      retry = window.setTimeout(show, 2500);
    };

    // The homepage already opens its own "hast rekha" popup, so wait for that
    // one to be dismissed instead of stacking two dialogs.
    const homePopupPending = pathname === "/" && !sessionStorage.getItem("hr-popup-dismissed");
    window.addEventListener("hr:home-popup-closed", onHomePopupClosed);
    if (!homePopupPending) timer = window.setTimeout(show, DELAY_MS);

    return () => {
      window.removeEventListener("hr:home-popup-closed", onHomePopupClosed);
      window.clearTimeout(timer);
      window.clearTimeout(retry);
    };
  }, [pathname, skip]);

  function close() {
    setOpen(false);
  }

  async function copyCode() {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
    } catch {}
  }

  if (!open || !coupon) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold-400/50 bg-gradient-to-br from-[#2a1206]/95 via-cosmic-900/95 to-[#120a24]/95 p-7 text-center shadow-2xl shadow-gold-400/20">
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-40" />
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
          aria-label="बंद करें"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-200">
            <Sparkles className="h-3.5 w-3.5" /> आज का ऑफर
          </span>

          <p className="font-display text-5xl leading-none text-gold-200 drop-shadow-[0_0_20px_rgba(245,194,66,0.35)]">
            50% OFF
          </p>
          <p className="text-sm leading-relaxed text-slate-200">
            आज किसी भी प्लान पर <b className="text-gold-200">50% छूट</b>।
            <br />
            प्रो रिपोर्ट, प्रो + पुस्तक और मेंबरशिप — सभी पर।
          </p>

          <button
            type="button"
            onClick={copyCode}
            className="mt-1 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-gold-400/60 bg-gold-400/10 px-4 py-3 transition hover:bg-gold-400/15"
          >
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gold-300" />
              <span className="font-mono text-xl font-bold tracking-[0.2em] text-gold-100">{coupon.code}</span>
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-gold-200">
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              {copied ? "कॉपी हो गया" : "कॉपी"}
            </span>
          </button>

          <Link
            href="/pricing"
            onClick={() => {
              try {
                window.localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
              } catch {}
              close();
            }}
            className="btn-gold mt-1 w-full rounded-full px-6 py-3 text-sm font-semibold"
          >
            प्लान देखें और छूट लें
          </Link>

          <button
            type="button"
            onClick={close}
            className="text-xs text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline"
          >
            अभी नहीं
          </button>
        </div>
      </div>
    </div>
  );
}
