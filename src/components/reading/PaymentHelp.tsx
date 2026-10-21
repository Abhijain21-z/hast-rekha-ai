"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, ShieldCheck, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";
import { paymentHelpUrl, type PaymentHelpDetails } from "@/lib/support";

const whatsappButton =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#062d1a] shadow-lg shadow-[#25D366]/20 transition hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140b26]";

/**
 * Popup shown when Cashfree checkout is dismissed/fails, or when a payment
 * returns but the report is still locked. The visitor lands in the owner's
 * WhatsApp with plan, amount, reading and order details already filled in.
 */
export function PaymentHelpModal({
  open,
  onClose,
  ...details
}: PaymentHelpDetails & { open: boolean; onClose: () => void }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-help-title"
        onClick={(event) => event.stopPropagation()}
        className="glass-strong max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[#25D366]/25 p-6 text-center shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 id="payment-help-title" className="font-display text-xl text-white">
          {t.paymentHelp.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.paymentHelp.body}</p>

        <a
          href={paymentHelpUrl(details)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(whatsappButton, "mt-5")}
        >
          <MessageCircle className="h-4 w-4" />
          {t.paymentHelp.cta}
        </a>

        {details.orderId && (
          <p className="mt-3 text-xs text-slate-500">
            {t.paymentHelp.orderId}: <span className="font-mono text-slate-400">{details.orderId}</span>
          </p>
        )}

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5" /> {t.paymentHelp.note}
        </p>
      </div>
    </div>,
    document.body,
  );
}

/** Same WhatsApp hand-off as a plain button, for the return page. */
export function PaymentHelpButton({
  details,
  className,
  label,
}: {
  details: PaymentHelpDetails;
  className?: string;
  label?: string;
}) {
  const { t } = useLang();
  return (
    <a
      href={paymentHelpUrl(details)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(whatsappButton, className)}
    >
      <MessageCircle className="h-4 w-4" />
      {label ?? t.paymentHelp.cta}
    </a>
  );
}
