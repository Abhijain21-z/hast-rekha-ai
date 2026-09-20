"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, ExternalLink, QrCode, HandHeart } from "lucide-react";
import QRCode from "qrcode";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Modal, cn } from "@/components/ui";
import { UPI_ID, UPI_PAYEE_NAME } from "@/lib/premium";

const AMOUNTS = [21, 51, 101, 501];

export default function DonateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [amount, setAmount] = useState<number>(51);
  const [custom, setCustom] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const finalAmount = Number(custom) > 0 ? Math.round(Number(custom)) : amount;
  const deepLink = useMemo(() => {
    const params = new URLSearchParams({ pa: UPI_ID, pn: UPI_PAYEE_NAME, am: `${finalAmount}.00`, cu: "INR", tn: "Donation - Hast Rekha AI improvement" });
    return `upi://pay?${params.toString()}`;
  }, [finalAmount]);

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(deepLink, { width: 420, margin: 1, color: { dark: "#1a1030", light: "#fbeab8" } }).then(setQr).catch(() => setQr(null));
  }, [open, deepLink]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <Modal open={open} onClose={onClose} title={t.donate.title}>
      <p className="flex items-start gap-2 text-sm text-slate-300"><HandHeart className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" /> {t.donate.sub}</p>
      <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{t.donate.amount}</p>
      <div className="flex flex-wrap gap-2">
        {AMOUNTS.map((a) => (
          <button key={a} onClick={() => { setAmount(a); setCustom(""); }} className={cn("rounded-full border px-4 py-2 text-sm transition", !custom && amount === a ? "border-rose-400/60 bg-rose-400/15 text-rose-100" : "border-white/10 text-slate-300 hover:border-white/30")}>
            ₹{a}
          </button>
        ))}
        <Input type="number" min={1} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={t.donate.custom} className="w-28 py-2 text-sm" />
      </div>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="shrink-0 rounded-2xl bg-[#fbeab8] p-3">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="UPI QR" className="h-40 w-40 rounded-lg" />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center"><QrCode className="h-10 w-10 text-[#1a1030]" /></div>
          )}
        </div>
        <div className="w-full space-y-3">
          <p className="font-display text-3xl text-rose-200">₹{finalAmount}</p>
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-2.5">
            <p className="font-mono text-sm text-gold-100">{UPI_ID}</p>
            <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-slate-200 hover:text-white">{copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}{copied ? t.premium.copied : t.premium.copy}</button>
          </div>
          <a href={deepLink} className="btn-gold flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm"><ExternalLink className="h-4 w-4" /> {t.donate.pay}</a>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">{t.donate.thanks}</p>
    </Modal>
  );
}

export function DonateButton({ variant = "ghost" }: { variant?: "ghost" | "gold" }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} icon={<Heart className="h-4 w-4 text-rose-300" />}>
        {t.donate.btn}
      </Button>
      <DonateModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
