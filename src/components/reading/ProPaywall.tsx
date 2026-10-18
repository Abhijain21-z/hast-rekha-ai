"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Crown, Download, ExternalLink, HeartHandshake, Lock, Printer, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Modal, cn } from "@/components/ui";
import { PREMIUM_PERKS, BOOK_PERKS, PREMIUM_PRICE, UPI_ID, upiDeepLink } from "@/lib/premium";
import { PDF_PRICE_ANCHOR, PRO_PAY_MODE, ULTRA_PRICE } from "@/lib/flags";

/** Fill `{placeholders}` in a translated template. */
function tpl(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/** The report prints through the print stylesheet — the browser's "Save as PDF". */
function printReport() {
  window.setTimeout(() => window.print(), 350);
}

/** The two plans the paywall offers: ₹51 Pro, ₹351 Ultra Pro (adds the book). */
export type ProPlan = "pro" | "ultra";

/**
 * The single ₹51 / ₹351 paywall. Every download/print button and the premium
 * upsell open this same offer, so the price anchor and perks stay consistent.
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
}: {
  open: boolean;
  onClose: () => void;
  readingId: string;
  onUnlocked: () => void;
  /** Pre-selects a plan, e.g. when the visitor came from the ₹351 Ultra card. */
  defaultPlan?: ProPlan;
}) {
  const { t, L } = useLang();
  const { toast } = useToast();
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState<ProPlan>(defaultPlan);

  const price = plan === "ultra" ? ULTRA_PRICE : PREMIUM_PRICE;
  const perks = plan === "ultra" ? [...PREMIUM_PERKS, ...BOOK_PERKS] : PREMIUM_PERKS;
  const deepLink = useMemo(() => upiDeepLink(readingId, price), [readingId, price]);
  // Pro unlocks on the buyer's confirmation (no UTR). Ultra still asks for the
  // UPI reference so the book link can be issued safely.
  const needsUtr = plan === "ultra";

  const saved = PDF_PRICE_ANCHOR - PREMIUM_PRICE;
  const percentOff = Math.round((1 - PREMIUM_PRICE / PDF_PRICE_ANCHOR) * 100);

  useEffect(() => {
    if (!open || PRO_PAY_MODE !== "upi") return;
    QRCode.toDataURL(deepLink, { width: 420, margin: 1, color: { dark: "#1a1030", light: "#fbeab8" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [open, deepLink]);

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

  return (
    <Modal open={open} onClose={onClose} title={t.pro.title} wide>
      <p className="text-sm leading-relaxed text-slate-300">{t.pro.sub}</p>

      {/* Plan switch — ₹51 Pro report, or ₹351 Ultra Pro which adds the book. */}
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-300">{t.pro.planTitle}</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {(["pro", "ultra"] as const).map((key) => {
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
                <span className="font-display text-lg text-white">
                  {key === "pro" ? `${t.pricing.prem} · ₹${PREMIUM_PRICE}` : `${t.pricing.ultra} · ₹${ULTRA_PRICE}`}
                </span>
                {active ? <Check className="h-4 w-4 shrink-0 text-gold-300" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-white/25" />}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-300">{key === "pro" ? t.pro.planPro : t.pro.planUltra}</span>
            </button>
          );
        })}
      </div>

      {plan === "pro" ? (
        /* Price anchor: struck-through report price next to the ₹51 offer. */
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{t.pro.was}</p>
            <p className="font-display text-2xl text-slate-400 line-through decoration-rose-400/80 decoration-2">₹{PDF_PRICE_ANCHOR}</p>
          </div>
          <div>
            <p className="font-display text-4xl gold-text">₹{PREMIUM_PRICE}</p>
            <p className="text-xs text-slate-400">{t.pro.once}</p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">
              {tpl(t.pro.offPct, { p: percentOff })}
            </span>
            <span className="text-xs text-emerald-300">{tpl(t.pro.saveAmt, { a: saved })}</span>
          </div>
        </div>
      ) : (
        /* Ultra Pro has no struck-through anchor — it is simply the plan with the book. */
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{t.pricing.ultra}</p>
            <p className="font-display text-4xl gold-text">₹{ULTRA_PRICE}</p>
            <p className="text-xs text-slate-400">{t.pro.once}</p>
          </div>
          <span className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">{t.pro.ultraTag}</span>
        </div>
      )}

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

      <div className="mt-5 border-t border-white/10 pt-5">
        {PRO_PAY_MODE === "upi" ? (
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
                  <ExternalLink className="h-4 w-4" /> {t.premium.openUpi}
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
              {err && <p className="mt-1.5 text-xs text-rose-300">{err}</p>}
              <Button className="mt-4 w-full" loading={busy} onClick={unlock} icon={<Crown className="h-4 w-4" />}>
                {busy ? t.premium.verifying : tpl(t.premium.confirmPay, { p: price })}
              </Button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => toast(t.pro.soon)} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
              <Crown className="h-4 w-4" /> {tpl(t.pro.pay, { p: price })}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">{t.pro.soonNote}</p>
          </>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <button onClick={onClose} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-300 hover:border-white/30">
          {t.pro.close}
        </button>
      </div>
    </Modal>
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
