"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Crown, Download, ExternalLink, Gift, HeartHandshake, Lock, MessageCircle, Printer, QrCode, ShieldCheck, X } from "lucide-react";
import QRCode from "qrcode";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Modal, cn } from "@/components/ui";
import { PREMIUM_PERKS, BOOK_PERKS, UPI_ID, upiDeepLink } from "@/lib/premium";
import {
  BUNDLE_TEST,
  CASHFREE_ENABLED,
  CASHFREE_MODE,
  MANUAL_UPI_ENABLED,
  PDF_PRICE_ANCHOR,
  PRO_PAY_MODE,
  ULTRA_PRICE,
} from "@/lib/flags";
import { PLAN_PRICES, type ReportPlan } from "@/lib/plans";
import { COUPON_STORAGE_KEY, couponPrice, findCoupon, type Coupon } from "@/lib/coupons";
import type { Bi } from "@/lib/i18n";
import { getCashfree } from "@/lib/cashfree-client";
import { PaymentHelpModal } from "./PaymentHelp";

/** Fill `{placeholders}` in a translated template. */
function tpl(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/** The report prints through the print stylesheet — the browser's "Save as PDF". */
function printReport() {
  document.body.classList.add("hast-print");
  window.setTimeout(() => {
    window.print();
    window.setTimeout(() => document.body.classList.remove("hast-print"), 1500);
  }, 350);
}

/**
 * Report plans. The ₹351 Ultra Pro stays in the type for existing buyers and
 * for the flag-off path; new visitors see the ₹199 launch bundle instead.
 */
export type ProPlan = ReportPlan;

type CashfreeOrderResult = {
  ok: boolean;
  paymentSessionId?: string;
  orderId?: string;
  error?: string;
};

const DIWALI_PERK: Bi = {
  en: "Complete Diwali Puja PDF — vidhi, samagri, mantra & aarti",
  hi: "संपूर्ण दिवाली पूजा PDF — विधि, सामग्री, मंत्र व आरती",
};

const PLAN_INFO: Record<ProPlan, { title: Bi; sub: Bi }> = {
  pro: {
    title: { en: "Pro report", hi: "प्रो रिपोर्ट" },
    sub: {
      en: "5-year roadmap, complete PDF, partner report, upay, Diwali Puja PDF & 50 chat minutes",
      hi: "5-वर्षीय रोडमैप, पूरी PDF, जीवनसाथी रिपोर्ट, उपाय, दिवाली पूजा PDF और 50 चैट मिनट",
    },
  },
  diwali: {
    title: { en: "Pro + Diwali PDF", hi: "प्रो + दिवाली PDF" },
    sub: {
      en: "Everything in Pro plus the complete Diwali Puja PDF",
      hi: "प्रो की हर चीज़ और संपूर्ण दिवाली पूजा PDF",
    },
  },
  bundle: {
    title: { en: "Pro + Dhandayak book", hi: "प्रो + धनदायक पुस्तक" },
    sub: {
      en: "Everything in Pro plus the complete Dhandayak book",
      hi: "प्रो की हर चीज़ और पूरी धनदायक पुस्तक",
    },
  },
  ultra: {
    title: { en: "Ultra Pro", hi: "अल्ट्रा प्रो" },
    sub: {
      en: "Everything in Pro plus the complete Dhandayak book",
      hi: "प्रो की हर चीज़ और पूरी धनदायक पुस्तक",
    },
  },
};

/** Reuse a prefetched order for 10 minutes, then ask the server for a fresh one. */
const ORDER_TTL_MS = 10 * 60 * 1000;

/**
 * The single report paywall. Every download/print button and the premium
 * upsell open this same offer, so the price ladder and perks stay consistent.
 *
 * Callers pass the plan they want pre-selected together with a `key` that
 * changes whenever the modal re-opens, so each open starts on the plan the
 * visitor actually clicked (a fresh mount rather than state syncing).
 */
export function ProPaywallModal({
  open,
  onClose,
  readingId,
  onUnlocked,
  defaultPlan = "pro",
  alreadyPro = false,
}: {
  open: boolean;
  onClose: () => void;
  readingId: string;
  onUnlocked: () => void;
  /** Pre-selects a plan, e.g. when the visitor came from a specific card. */
  defaultPlan?: ProPlan;
  /** The reading already has Pro; only add-ons are offered. */
  alreadyPro?: boolean;
}) {
  const { t, L } = useLang();
  const { toast } = useToast();
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const planOptions = useMemo<ProPlan[]>(() => {
    const base: ProPlan[] = BUNDLE_TEST ? ["pro", "bundle"] : ["pro", "ultra"];
    return alreadyPro ? base.filter((key) => key !== "pro") : base;
  }, [alreadyPro]);

  const [plan, setPlan] = useState<ProPlan>(() =>
    planOptions.includes(defaultPlan) ? defaultPlan : planOptions[0],
  );
  const [cfBusy, setCfBusy] = useState(false);
  const [phone, setPhone] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = window.localStorage.getItem("hr-whatsapp");
    return saved && /^[6-9]\d{9}$/.test(saved) ? saved : "";
  });
  const [waOptIn, setWaOptIn] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponErr, setCouponErr] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpIssue, setHelpIssue] = useState<"checkout_closed" | "not_unlocked">("checkout_closed");
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const prefetchRef = useRef<{ key: string; at: number; promise: Promise<CashfreeOrderResult> } | null>(null);

  const listPrice = PLAN_PRICES[plan];
  const price = couponPrice(listPrice, coupon);
  const perks =
    plan === "bundle" || plan === "ultra"
      ? [...PREMIUM_PERKS, ...BOOK_PERKS, DIWALI_PERK]
      : [...PREMIUM_PERKS, DIWALI_PERK];
  const deepLink = useMemo(() => upiDeepLink(readingId, price), [readingId, price]);

  // The manual UPI panel confirms ₹51 Pro without a reference, so every other
  // plan needs a UTR to avoid a free unlock. (The panel is off while Cashfree
  // is live; this keeps the emergency fallback safe.)
  const needsUtr = plan !== "pro";
  const manualUpi = MANUAL_UPI_ENABLED && PRO_PAY_MODE === "upi";

  const anchor = alreadyPro ? null : coupon ? listPrice : plan === "pro" ? PDF_PRICE_ANCHOR : plan === "bundle" ? ULTRA_PRICE : null;
  const saved = anchor ? anchor - price : 0;
  const percentOff = coupon ? coupon.percentOff : anchor ? Math.round((1 - price / anchor) * 100) : 0;

  const cmpRows: { label: Bi; free: boolean; pro: boolean; bundle: boolean; diwali: boolean }[] = [
    {
      label: { en: "Full reading on screen — 12 life areas, kundli & palm analysis", hi: "स्क्रीन पर पूरी रीडिंग — 12 जीवन-क्षेत्र, कुंडली व हस्तरेखा विश्लेषण" },
      free: true,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Year-by-year predictions for the next 5 years", hi: "आने वाले 5 वर्षों की वर्ष-दर-वर्ष भविष्यवाणी" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Future life-partner prediction (if unmarried)", hi: "होने वाले जीवनसाथी की भविष्यवाणी (अविवाहित हैं तो)" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Personal upay, stotra & gemstone method", hi: "व्यक्तिगत उपाय, स्तोत्र व रत्न विधि" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Complete Pro PDF — print & download", hi: "पूरी प्रो PDF — प्रिंट व डाउनलोड" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "50 AI Panditji chat minutes", hi: "50 AI पंडितजी चैट मिनट" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Complete Diwali Puja PDF", hi: "संपूर्ण दिवाली पूजा PDF" },
      free: false,
      pro: true,
      bundle: true,
      diwali: true,
    },
    {
      label: { en: "Dhandayak (Gupt Khazana) book", hi: "धनदायक पुस्तक (गुप्त खजाना)" },
      free: false,
      pro: false,
      bundle: true,
      diwali: false,
    },
  ];

  useEffect(() => {
    if (!open || !manualUpi) return;
    QRCode.toDataURL(deepLink, { width: 420, margin: 1, color: { dark: "#1a1030", light: "#fbeab8" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [open, deepLink, manualUpi]);

  // A code saved by the offer popup, `?coupon=` in the URL, or a WhatsApp
  // follow-up click is applied here. The approved template's button carries
  // utm_source=whatsapp & utm_campaign=pro_followup, so that traffic gets
  // SAVE50 without changing the approved template.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("coupon");
    const fromWhatsApp =
      params.get("utm_source") === "whatsapp" &&
      params.get("utm_campaign") === "pro_followup";
    const found =
      findCoupon(fromUrl) ??
      (fromWhatsApp ? findCoupon("SAVE50") : null) ??
      findCoupon(window.localStorage.getItem(COUPON_STORAGE_KEY));
    if (!found) return;
    if (fromWhatsApp) {
      try {
        window.localStorage.setItem(COUPON_STORAGE_KEY, found.code);
      } catch {}
    }
    // Defer the state update out of the effect body: reading the URL and
    // localStorage is the external-system work; React only needs the result.
    const timer = window.setTimeout(() => {
      setCoupon(found);
      setCouponInput(found.code);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function applyCouponCode() {
    const found = findCoupon(couponInput);
    if (!found) {
      setCouponErr(
        L({ en: "This code is not valid or has expired.", hi: "यह कोड सही नहीं है या खत्म हो गया है।" }),
      );
      return;
    }
    setCouponErr("");
    setCoupon(found);
    setCouponInput(found.code);
    prefetchRef.current = null;
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, found.code);
    } catch {}
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponErr("");
    prefetchRef.current = null;
    try {
      window.localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  }

  // Warm up Cashfree's checkout script while the visitor is choosing a plan and
  // typing their number, so tapping Pay opens the gateway immediately.
  useEffect(() => {
    if (!open || !CASHFREE_ENABLED) return;
    getCashfree(CASHFREE_MODE).catch(() => {});
  }, [open]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  async function unlock() {
    setErr("");
    if (needsUtr && !/^\d{8,20}$/.test(utr.trim())) {
      setErr(t.premium.errUtr);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/readings/${readingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(needsUtr ? { premiumUtr: utr.trim(), plan } : { confirmPaid: true, plan: "pro" }),
    });
    setBusy(false);
    if (res.ok) {
      toast(t.pro.unlocked);
      onUnlocked();
      onClose();
    } else {
      setErr(res.status === 409 ? t.premium.errUsed : t.premium.errUnlock);
    }
  }

  function fetchOrder(planKey: ProPlan, phoneDigits: string, optIn: boolean, couponCode: string): Promise<CashfreeOrderResult> {
    return fetch("/api/payments/cashfree/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        readingId,
        plan: planKey,
        phone: phoneDigits,
        whatsappOptIn: optIn,
        coupon: couponCode || undefined,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { paymentSessionId?: string; orderId?: string; error?: string };
        return { ok: res.ok, ...data };
      })
      .catch(() => ({ ok: false }));
  }

  /** The key is plan + phone + consent + coupon, because each one changes the order row. */
  function orderKey(planKey: ProPlan, phoneDigits: string, optIn: boolean, couponCode: string) {
    return `${planKey}:${phoneDigits}:${optIn ? "wa" : "no-wa"}:${couponCode}`;
  }

  /**
   * Kick off order creation as soon as a valid 10-digit number is typed. The
   * click handler below awaits the same promise, so most visitors skip the
   * server round-trip entirely.
   */
  function prefetchOrder(planKey: ProPlan, phoneDigits: string, optIn: boolean, couponCode: string) {
    if (!CASHFREE_ENABLED || !/^[6-9]\d{9}$/.test(phoneDigits)) return;
    const key = orderKey(planKey, phoneDigits, optIn, couponCode);
    const cached = prefetchRef.current;
    if (cached?.key === key && Date.now() - cached.at < ORDER_TTL_MS) return;
    prefetchRef.current = { key, at: Date.now(), promise: fetchOrder(planKey, phoneDigits, optIn, couponCode) };
  }

  /**
   * Cashfree checkout. The server creates the order (price is resolved there),
   * the SDK opens the secure Cashfree UI, and the reading unlocks only after the
   * backend re-verifies the order as PAID. Closing the modal is not a failed
   * payment, but it is a drop-off, so we immediately offer direct WhatsApp help.
   */
  async function payWithCashfree() {
    setErr("");
    setHelpOpen(false);
    setLastOrderId(null);
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      setErr(t.pro.cfPhoneErr);
      return;
    }
    setCfBusy(true);
    const couponCode = coupon?.code ?? "";
    const key = orderKey(plan, phoneDigits, waOptIn, couponCode);
    try {
      const cached = prefetchRef.current;
      const request =
        cached?.key === key && Date.now() - cached.at < ORDER_TTL_MS
          ? cached.promise
          : fetchOrder(plan, phoneDigits, waOptIn, couponCode);
      prefetchRef.current = { key, at: Date.now(), promise: request };
      const data = await request;
      if (!data.ok || !data.paymentSessionId || !data.orderId) {
        if (prefetchRef.current?.key === key) prefetchRef.current = null;
        setErr(data.error || t.pro.cfError);
        setHelpIssue("checkout_closed");
        setHelpOpen(true);
        return;
      }
      setLastOrderId(data.orderId);
      const cashfree = await getCashfree(CASHFREE_MODE);
      const result = await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });

      if (result.error) {
        // A dismissed modal also lands here — not a failed payment, but a drop.
        toast(t.pro.cfNotDone);
        setHelpIssue("checkout_closed");
        setHelpOpen(true);
        return;
      }
      if (result.redirect) return; // Browser is heading to Cashfree; the return page verifies.
      if (result.paymentDetails) {
        const verified = (await fetch(`/api/payments/cashfree/verify?order_id=${encodeURIComponent(data.orderId)}`)
          .then((r) => r.json().catch(() => null))
          .catch(() => null)) as { status?: string } | null;
        if (verified?.status === "PAID") {
          setHelpOpen(false);
          toast(t.pro.unlocked);
          onUnlocked();
          onClose();
          return;
        }
        toast(t.pro.cfVerifying);
        setHelpIssue("not_unlocked");
        setHelpOpen(true);
      }
    } catch {
      setErr(t.pro.cfError);
      setHelpIssue("checkout_closed");
      setHelpOpen(true);
    } finally {
      setCfBusy(false);
    }
  }

  function planTitle(key: ProPlan) {
    if (alreadyPro && key === "bundle") return L({ en: "Dhandayak book", hi: "धनदायक पुस्तक" });
    return L(PLAN_INFO[key].title);
  }

  function planSub(key: ProPlan) {
    if (alreadyPro && key === "bundle")
      return L({ en: "Add the complete book to this Pro report", hi: "इस प्रो रिपोर्ट में पूरी पुस्तक जोड़ें" });
    return L(PLAN_INFO[key].sub);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={
          alreadyPro
            ? L({ en: "Add to your Pro report", hi: "अपनी प्रो रिपोर्ट में जोड़ें" })
            : t.pro.title
        }
        wide
      >
        <p className="text-sm leading-relaxed text-slate-300">
          {alreadyPro
            ? L({
                en: "Choose an optional add-on for this report. Nothing here is required.",
                hi: "इस रिपोर्ट के लिए वैकल्पिक ऐड-ऑन चुनें। इनमें से कुछ भी ज़रूरी नहीं।",
              })
            : t.pro.sub}
        </p>

        {alreadyPro && (
          <p className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-100">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            {L({
              en: "Pro is already unlocked on this report. These are optional add-ons — nothing here is required.",
              hi: "इस रिपोर्ट पर प्रो पहले से अनलॉक है। ये वैकल्पिक ऐड-ऑन हैं — इनमें से कुछ भी ज़रूरी नहीं।",
            })}
          </p>
        )}

        {/* Plan switch — the ₹51 Pro report (Diwali PDF included) and the book bundle. */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-300">{t.pro.planTitle}</p>
        <div className={cn("mt-2 grid gap-3", planOptions.length === 1 ? "sm:grid-cols-1" : planOptions.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
          {planOptions.map((key) => {
            const active = plan === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPlan(key)}
                aria-pressed={active}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  active ? "border-gold-400/70 bg-gold-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/25",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-base text-white">
                    {planTitle(key)} · ₹{PLAN_PRICES[key]}
                  </span>
                  {active ? <Check className="h-4 w-4 shrink-0 text-gold-300" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-white/25" />}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-300">{planSub(key)}</span>
              </button>
            );
          })}
        </div>

        {/* Coupon: validated on the server, so the discounted amount is never trusted from the client. */}
        <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.07] px-4 py-3">
          {coupon ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm text-emerald-100">
                <Check className="h-4 w-4 shrink-0 text-emerald-300" />
                <span>
                  <b>{coupon.code}</b> — {L(coupon.label)}{" "}
                  {L({ en: "applied", hi: "लागू हो गया" })}
                </span>
              </p>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-xs text-slate-300 underline underline-offset-4 hover:text-white"
              >
                {L({ en: "Remove", hi: "हटाएँ" })}
              </button>
            </div>
          ) : (
            <>
              <label htmlFor="hr-coupon" className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                {L({ en: "Have a coupon code?", hi: "कूपन कोड है?" })}
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="hr-coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCouponCode();
                    }
                  }}
                  placeholder="SAVE50"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-cosmic-900/70 px-3 py-2 text-sm uppercase tracking-wider text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyCouponCode}
                  className="shrink-0 rounded-xl border border-emerald-400/50 bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/25"
                >
                  {L({ en: "Apply", hi: "लागू करें" })}
                </button>
              </div>
            </>
          )}
          {couponErr && <p className="mt-2 text-xs text-rose-300">{couponErr}</p>}
        </div>

        {/* Price block: the ₹51 and ₹199 offers keep a struck-through anchor. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4">
          {anchor && (
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">{t.pro.was}</p>
              <p className="font-display text-2xl text-slate-400 line-through decoration-rose-400/80 decoration-2">₹{anchor}</p>
            </div>
          )}
          <div>
            <p className="font-display text-4xl gold-text">₹{price}</p>
            <p className="text-xs text-slate-400">
              {alreadyPro
                ? L({ en: "one-time · add-on", hi: "एक बार · ऐड-ऑन" })
                : t.pro.once}
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            {anchor ? (
              <>
                <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">
                  {tpl(t.pro.offPct, { p: percentOff })}
                </span>
                <span className="text-xs text-emerald-300">{tpl(t.pro.saveAmt, { a: saved })}</span>
              </>
            ) : (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                {alreadyPro
                  ? L({ en: "Add-on", hi: "ऐड-ऑन" })
                  : plan === "diwali"
                    ? L({ en: "Pro + PDF", hi: "प्रो + PDF" })
                    : t.pro.ultraTag}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          {CASHFREE_ENABLED && (
            <div>
              <div className="mb-3">
                <Label htmlFor="cf-phone">{t.pro.cfPhoneLabel}</Label>
                <Input
                  id="cf-phone"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(digits);
                    if (digits.length === 10) {
                      window.localStorage.setItem("hr-whatsapp", digits);
                      prefetchOrder(plan, digits, waOptIn, coupon?.code ?? "");
                    }
                  }}
                  placeholder={t.pro.cfPhonePh}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                />
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{t.pro.cfPhoneHint}</p>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-relaxed text-slate-300">
                  <input
                    type="checkbox"
                    checked={waOptIn}
                    onChange={(e) => setWaOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5c242]"
                  />
                  <span>
                    <span className="block font-medium text-slate-100">{t.pro.waOptIn}</span>
                    <span className="mt-0.5 block text-slate-500">{t.pro.waOptInNote}</span>
                  </span>
                </label>
              </div>
              <Button className="w-full" size="lg" loading={cfBusy} onClick={payWithCashfree} icon={<ShieldCheck className="h-4 w-4" />}>
                {cfBusy ? t.pro.cfStarting : tpl(t.pro.cfPay, { p: price })}
              </Button>
              <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">{t.pro.cfNote}</p>
              <button
                type="button"
                onClick={() => {
                  setHelpIssue("checkout_closed");
                  setHelpOpen(true);
                }}
                className="mx-auto mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-300 underline-offset-4 hover:text-emerald-200 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {t.paymentHelp.always}
              </button>
              {manualUpi && (
                <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-slate-500">
                  <span className="h-px flex-1 bg-white/10" />
                  {t.pro.cfOr}
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              )}
            </div>
          )}
          {err && <p className="mb-3 mt-3 text-center text-xs text-rose-300">{err}</p>}
          {manualUpi ? (
            <>
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="shrink-0 rounded-2xl bg-[#fbeab8] p-3 gold-glow">
                  {qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qr} alt="UPI QR" className="h-44 w-44 rounded-lg" />
                  ) : (
                    <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-[#fbeab8]">
                      <QrCode className="h-10 w-10 text-[#1a1030]" />
                    </div>
                  )}
                </div>
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between gap-2 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">{t.premium.upiId}</p>
                      <p className="font-mono text-base text-gold-100">{UPI_ID}</p>
                      <p className="text-xs text-slate-400">
                        {UPI_ID.split("@")[0]} · ₹{price}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyUpi} icon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}>
                      {copied ? t.premium.copied : t.premium.copy}
                    </Button>
                  </div>
                  <a href={deepLink} className="btn-gold flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
                    <ExternalLink className="h-4 w-4" /> {tpl(t.premium.openUpi, { p: price })}
                  </a>
                  <p className="text-center text-xs text-slate-500">GPay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                {needsUtr && (
                  <>
                    <Label>{t.premium.utrLabel}</Label>
                    <Input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder={t.premium.utrPh} inputMode="numeric" maxLength={20} />
                  </>
                )}
                <Button className="mt-4 w-full" loading={busy} onClick={unlock} icon={<Crown className="h-4 w-4" />}>
                  {busy ? t.premium.verifying : tpl(t.premium.confirmPay, { p: price })}
                </Button>
              </div>
            </>
          ) : !CASHFREE_ENABLED ? (
            <>
              <button onClick={() => toast(t.pro.soon)} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
                <Crown className="h-4 w-4" /> {tpl(t.pro.pay, { p: price })}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">{t.pro.soonNote}</p>
            </>
          ) : null}
        </div>

        {/* What each plan adds, side by side. Scrolls on narrow screens. */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {L({ en: "What each plan adds", hi: "हर प्लान में क्या अतिरिक्त मिलता है" })}
        </p>
        <div className="mt-2 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[540px] text-left">
            <thead>
              <tr className="bg-white/[0.05] text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-3 py-2.5 font-medium">{t.premium.cmpFeature}</th>
                <th className="px-2 py-2.5 text-center font-medium">{t.premium.cmpFree}</th>
                <th className="px-2 py-2.5 text-center font-medium text-gold-200">
                  {t.premium.cmpPro}
                  <span className="block text-[10px] font-normal normal-case tracking-normal text-slate-400">₹{PLAN_PRICES.pro}</span>
                </th>
                <th className="px-2 py-2.5 text-center font-medium text-gold-200">
                  + PDF
                  <span className="block text-[10px] font-normal normal-case tracking-normal text-slate-400">₹{PLAN_PRICES.diwali}</span>
                </th>
                <th className="px-2 py-2.5 text-center font-medium text-gold-200">
                  + Book
                  <span className="block text-[10px] font-normal normal-case tracking-normal text-slate-400">₹{PLAN_PRICES.bundle}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cmpRows.map((row) => (
                <tr key={row.label.en} className="border-t border-white/10 text-xs text-slate-200">
                  <td className="px-3 py-2.5 leading-relaxed">{L(row.label)}</td>
                  {[row.free, row.pro, row.diwali, row.bundle].map((has, i) => (
                    <td key={i} className="px-2 py-2.5 text-center align-middle">
                      {has ? <Check className="mx-auto h-4 w-4 text-gold-300" /> : <X className="mx-auto h-3.5 w-3.5 text-slate-500" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
          <Crown className="h-3.5 w-3.5" /> {t.pro.perksTitle}
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {perks.map((p) => (
            <li key={p.en} className="flex items-start gap-2 text-sm text-slate-100">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {L(p)}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-mystic-400/35 bg-mystic-600/15 px-4 py-3 text-sm leading-relaxed text-slate-100">
          <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-mystic-400" /> {t.partner.paywallLine}
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-3 text-xs leading-relaxed text-gold-100">
          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
          <span>
            {L({
              en: "Membership: 30 Pro reports in 30 days for ₹1,000, with 5 family profiles. A 30-day pass — it simply expires, nothing to cancel.",
              hi: "मेंबरशिप: ₹1,000 में 30 दिनों में 10 प्रो रिपोर्ट और 5 पारिवारिक प्रोफ़ाइल। 30-दिन का पास — समय पर ख़त्म, कुछ रद्द करने की ज़रूरत नहीं।",
            })}{" "}
            <a href="/membership" className="font-semibold underline underline-offset-4 hover:text-white">
              {L({ en: "See membership", hi: "मेंबरशिप देखें" })}
            </a>
          </span>
        </div>

        <div className="mt-5 flex justify-center">
          <button onClick={onClose} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-300 hover:border-white/30">
            {t.pro.close}
          </button>
        </div>
      </Modal>
      <PaymentHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        readingId={readingId}
        plan={plan}
        amount={price}
        orderId={lastOrderId}
        phone={phone.replace(/\D/g, "") || null}
        issue={helpIssue}
      />
    </>
  );
}

/**
 * A button that is either a paid report action (once unlocked) or the ₹51 gate.
 * Nothing prints for free: the label advertises the download, the lock does the gating.
 */
export function ProGateButton({
  readingId,
  unlocked,
  onUnlocked,
  label,
  icon = "download",
  className,
  defaultPlan = "pro",
}: {
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
  label: string;
  icon?: "download" | "print";
  className?: string;
  defaultPlan?: ProPlan;
}) {
  const [open, setOpen] = useState(false);
  const ActionIcon = icon === "print" ? Printer : Download;

  return (
    <>
      <button
        type="button"
        onClick={() => (unlocked ? printReport() : setOpen(true))}
        className={cn(
          "no-print inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-sm font-medium text-gold-200 transition hover:border-gold-400/70 hover:bg-gold-400/20",
          className,
        )}
      >
        {unlocked ? <ActionIcon className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
        {label}
      </button>
      <ProPaywallModal
        key={open ? `open-${defaultPlan}` : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        readingId={readingId}
        defaultPlan={defaultPlan}
        onUnlocked={() => {
          onUnlocked();
          setOpen(false);
          printReport();
        }}
      />
    </>
  );
}

/** Slim "Download Complete PDF" divider that sits in the gap between sections. */
export function PdfDividerButton({ readingId, unlocked, onUnlocked }: { readingId: string; unlocked: boolean; onUnlocked: () => void }) {
  const { t } = useLang();
  return (
    <div className="no-print my-10 flex items-center gap-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <ProGateButton readingId={readingId} unlocked={unlocked} onUnlocked={onUnlocked} label={t.pro.download} className="shrink-0" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </div>
  );
}
