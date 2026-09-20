"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Lock, Check, Copy, QrCode, ExternalLink, Printer, Flame, Gem, ScrollText, AlertTriangle, Briefcase, CalendarDays, Sparkles } from "lucide-react";
import QRCode from "qrcode";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Modal, cn } from "@/components/ui";
import { buildPremiumReport, PREMIUM_PERKS, PREMIUM_PRICE, UPI_ID, upiDeepLink } from "@/lib/premium";
import type { ReadingDTO } from "@/lib/dto";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.55 } };

function PayModal({ open, onClose, readingId, onUnlocked }: { open: boolean; onClose: () => void; readingId: string; onUnlocked: () => void }) {
  const { t } = useLang();
  const { toast } = useToast();
  const [qr, setQr] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const deepLink = useMemo(() => upiDeepLink(readingId), [readingId]);

  useEffect(() => {
    if (!open) return;
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
      toast(t.premium.unlocked);
      onUnlocked();
      onClose();
    } else {
      setErr(t.premium.errUnlock);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.premium.payTitle}>
      <p className="text-sm text-slate-300">{t.premium.paySub}</p>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="shrink-0 rounded-2xl bg-[#fbeab8] p-3 gold-glow">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="UPI QR" className="h-44 w-44 rounded-lg" />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-[#fbeab8]"><QrCode className="h-10 w-10 text-[#1a1030]" /></div>
          )}
        </div>
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">{t.premium.upiId}</p>
              <p className="font-mono text-base text-gold-100">{UPI_ID}</p>
              <p className="text-xs text-slate-400">{UPI_ID.split("@")[0]} · ₹{PREMIUM_PRICE}</p>
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
        <p className="mt-3 text-center text-xs text-slate-500">{t.premium.or} — {t.premium.paySub}</p>
      </div>
    </Modal>
  );
}

export default function PremiumSection({ reading }: { reading: ReadingDTO }) {
  const { t, L, lang, cl } = useLang();
  const [payOpen, setPayOpen] = useState(false);
  const [premium, setPremium] = useState(reading.premium);

  const report = useMemo(
    () => buildPremiumReport({ result: reading.result, seed: reading.result.julianDay * 1000 + reading.fullName.length, fullName: reading.fullName, birthYear: Number(reading.birthDate.slice(0, 4)) }),
    [reading.result, reading.fullName, reading.birthDate],
  );

  const rowIcons = [CalendarDays, AlertTriangle, Briefcase, Flame, ScrollText];

  return (
    <section id="sec-premium" className="mt-14 scroll-mt-28">
      {!premium ? (
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/50 bg-gradient-to-br from-gold-400/15 via-cosmic-800/60 to-mystic-700/20 p-6 sm:p-10 gold-glow">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.premium.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl"><Crown className="mr-2 inline h-7 w-7 text-gold-300" />{t.premium.upsellTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">{t.premium.upsellSub}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {PREMIUM_PERKS.map((p) => (
                  <li key={p.en} className="flex items-start gap-2 text-sm text-slate-100">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /> {L(p)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-strong flex flex-col items-center rounded-3xl p-7 text-center">
              <Lock className="h-8 w-8 text-gold-300" />
              <p className="mt-3 font-display text-5xl gold-text">{t.premium.price}</p>
              <p className="text-xs text-slate-400">{t.premium.once}</p>
              <Button size="lg" className="mt-5 w-full" onClick={() => setPayOpen(true)} icon={<Crown className="h-5 w-5" />}>
                {t.premium.get}
              </Button>
              <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Sparkles className="h-3 w-3 text-gold-300" /> UPI · QR · {UPI_ID}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] border-2 border-gold-400/60 bg-gradient-to-br from-gold-400/15 via-cosmic-800/70 to-mystic-700/25 p-6 sm:p-10 gold-glow">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.premium.eyebrow} · 👑</p>
                  <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl"><Crown className="mr-2 inline h-7 w-7 text-gold-300" />{t.premium.title ?? ""}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-200">{t.premium.sub}</p>
                </div>
                <button onClick={() => window.print()} className="btn-gold no-print inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm">
                  <Printer className="h-4 w-4" /> {t.premium.printFull}
                </button>
              </div>

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-5 rounded-2xl border border-gold-400/25 bg-gold-400/10 px-4 py-3 text-sm text-gold-100">
                <Gem className="mr-2 inline h-4 w-4" />{report.fieldNote[cl]}
              </motion.p>

              <div className="mt-6 space-y-5">
                {report.years.map((y, i) => (
                  <motion.div key={y.calendarYear} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.05 }} className="glass overflow-hidden rounded-3xl">
                    <div className="flex flex-wrap items-center gap-3 border-b border-gold-400/20 bg-gradient-to-r from-gold-400/15 to-transparent px-5 py-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400/20 font-display text-lg text-gold-200">{String(y.calendarYear).slice(2)}</span>
                      <div>
                        <p className="font-display text-xl text-white">{y.calendarYear} · {L(y.theme)}</p>
                        <p className="text-xs text-slate-400">{t.premium.age} {y.ageRange[0]}–{y.ageRange[1]}</p>
                      </div>
                      <span className="ml-auto hidden font-display text-4xl text-gold-400/30 sm:block">{i + 1}</span>
                    </div>
                    <div className="grid gap-3 p-5 sm:grid-cols-2">
                      {[
                        { icon: rowIcons[0], label: t.premium.events, text: L(y.events), cls: "text-slate-100" },
                        { icon: rowIcons[1], label: t.premium.mistakes, text: L(y.mistakes), cls: "text-rose-200" },
                        { icon: rowIcons[3], label: t.premium.upay, text: L(y.upay), cls: "text-emerald-200" },
                        { icon: rowIcons[4], label: t.premium.stotra, text: L(y.stotra), cls: "text-gold-100" },
                      ].map((b) => (
                        <div key={b.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><b.icon className="h-3.5 w-3.5 text-gold-300" /> {b.label}</p>
                          <p className={cn("mt-2 text-sm leading-relaxed", b.cls)}>{b.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200"><Briefcase className="h-4 w-4" /> {t.premium.fieldWork}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{report.fieldNote[cl]}</p>
                </div>
                <div className="rounded-2xl border border-gold-400/25 bg-gold-400/10 p-5">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-200"><Gem className="h-4 w-4" /> {t.premium.gem}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">{report.gemNote[cl]}</p>
                </div>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 rounded-2xl bg-white/5 p-4 text-center text-sm italic text-slate-300">
                {L(report.closing)}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}

      <PayModal open={payOpen} onClose={() => setPayOpen(false)} readingId={reading.id} onUnlocked={() => setPremium(true)} />
    </section>
  );
}
