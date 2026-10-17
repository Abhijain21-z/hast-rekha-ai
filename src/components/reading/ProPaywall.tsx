"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Crown, Download, ExternalLink, HeartHandshake, Lock, Printer, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Modal, cn } from "@/components/ui";
import { PREMIUM_PERKS, PREMIUM_PRICE, UPI_ID, upiDeepLink } from "@/lib/premium";
import { PDF_PRICE_ANCHOR, PRO_PAY_MODE } from "@/lib/flags";

/** Fill `{placeholders}` in a translated template. */
function tpl(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/** The report prints through the print stylesheet — the browser's "Save as PDF". */
function printReport() {
  window.setTimeout(() => window.print(), 350);
}

/**
 * The single ₹51 "Pro" paywall. Every download/print button and the premium
 * upsell open this same offer, so the price anchor and perks stay consistent.
 */
export function ProPaywallModal({
  open,
  onClose,
  readingId,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  readingId: string;
  onUnlocked: () => void;
}) {
  const { t, L } = useLang();
  const { toast } = useToast();
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const deepLink = useMemo(() => upiDeepLink(readingId), [readingId]);

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
    if (!/^\d{8,20}$/.test(utr.trim())) {
      setErr(t.premium.errUtr);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/readings/${readingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ premiumUtr: utr.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      toast(t.pro.unlocked);
      onUnlocked();
      onClose();
    } else {
      setErr(t.premium.errUnlock);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.pro.title} wide>
      <p className="text-sm leading-relaxed text-slate-300">{t.pro.sub}</p>

      {/* Price anchor: struck-through report price next to the ₹51 offer. */}
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

      <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
        <Crown className="h-3.5 w-3.5" /> {t.pro.perksTitle}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {PREMIUM_PERKS.map((p) => (
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
                      {UPI_ID.split("@")[0]} · ₹{PREMIUM_PRICE}
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
              <Label>{t.premium.utrLabel}</Label>
              <Input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder={t.premium.utrPh} inputMode="numeric" maxLength={20} />
              {err && <p className="mt-1.5 text-xs text-rose-300">{err}</p>}
              <Button className="mt-4 w-full" loading={busy} onClick={unlock} icon={<Crown className="h-4 w-4" />}>
                {busy ? t.premium.verifying : t.premium.confirmPay}
              </Button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => toast(t.pro.soon)} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm">
              <Crown className="h-4 w-4" /> {t.pro.pay}
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
}: {
  readingId: string;
  unlocked: boolean;
  onUnlocked: () => void;
  label: string;
  icon?: "download" | "print";
  className?: string;
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
        open={open}
        onClose={() => setOpen(false)}
        readingId={readingId}
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
