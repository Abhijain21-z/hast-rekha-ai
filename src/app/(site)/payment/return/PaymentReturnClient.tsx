"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui";
import type { PaidPlan } from "@/lib/plans";
import { PaymentHelpButton } from "@/components/reading/PaymentHelp";

interface VerifyResponse {
  status?: string;
  plan?: PaidPlan;
  readingId?: string | null;
  error?: string;
}

/** Webhooks can arrive a moment after the redirect — poll a few times. */
const MAX_POLLS = 6;
const POLL_MS = 3000;

export default function PaymentReturnClient({ orderId }: { orderId: string }) {
  const { t, L } = useLang();
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const polls = useRef(0);

  const check = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/payments/cashfree/verify?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as VerifyResponse;
      setResult(data);
    } catch {
      setResult({ status: "UNKNOWN" });
    } finally {
      setChecking(false);
    }
  }, [orderId]);

  useEffect(() => {
    // Deferred by a tick: the effect only starts the request, state lands async.
    const timer = window.setTimeout(() => void check(), 0);
    return () => window.clearTimeout(timer);
  }, [check]);

  useEffect(() => {
    if (!orderId || checking) return;
    if (result?.status === "PAID" || result?.status === "MISMATCH") return;
    if (polls.current >= MAX_POLLS) return;
    const timer = window.setTimeout(() => {
      polls.current += 1;
      void check();
    }, POLL_MS);
    return () => window.clearTimeout(timer);
  }, [orderId, checking, result, check]);

  const paid = result?.status === "PAID";
  const failed = result?.status === "MISMATCH" || result?.status === "EXPIRED" || result?.status === "TERMINATED" || result?.status === "failed";
  const isMembership = result?.plan === "membership";

  const successMessage = isMembership
    ? L({
        en: "Payment received — your 30-day membership is active. New readings unlock automatically.",
        hi: "भुगतान मिल गया — आपकी 30-दिन की मेंबरशिप सक्रिय है। नई रीडिंग अपने आप अनलॉक होंगी।",
      })
    : result?.plan === "diwali"
      ? L({
          en: "Payment received — the Diwali Puja PDF is unlocked on this report.",
          hi: "भुगतान मिल गया — इस रिपोर्ट पर दिवाली पूजा PDF अनलॉक है।",
        })
      : result?.plan === "bundle" || result?.plan === "ultra"
        ? L({
            en: "Payment received — Pro and the Dhandayak book are unlocked.",
            hi: "भुगतान मिल गया — प्रो और धनदायक पुस्तक अनलॉक हैं।",
          })
        : t.payReturn.success;

  const ctaHref = isMembership ? "/membership" : result?.readingId ? `/reading/${result.readingId}` : "/dashboard";
  const ctaLabel = isMembership
    ? L({ en: "View my membership", hi: "मेरी मेंबरशिप देखें" })
    : result?.readingId
      ? t.payReturn.open
      : t.dash.overview;

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="glass-strong rounded-3xl border border-gold-400/25 p-7 text-center sm:p-10">
        {!orderId ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-rose-300" />
            <h1 className="mt-4 font-display text-2xl text-white sm:text-3xl">{t.payReturn.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.payReturn.missing}</p>
            <Link href="/reading" className="btn-gold mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm">
              {t.payReturn.open}
            </Link>
          </>
        ) : paid ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
            <h1 className="mt-4 font-display text-2xl text-white sm:text-3xl">{t.payReturn.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{successMessage}</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link href={ctaHref} className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-sm">
                {ctaLabel}
              </Link>
              <Link href="/" className="text-sm text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
                {t.payReturn.home}
              </Link>
            </div>
          </>
        ) : (
          <>
            {checking ? (
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-gold-300" />
            ) : failed ? (
              <XCircle className="mx-auto h-12 w-12 text-rose-300" />
            ) : (
              <Clock3 className="mx-auto h-12 w-12 text-gold-300" />
            )}
            <h1 className="mt-4 font-display text-2xl text-white sm:text-3xl">{t.payReturn.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {checking ? t.payReturn.checking : failed ? t.payReturn.failed : t.payReturn.pending}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {t.payReturn.help} <span className="font-mono text-slate-400">{orderId}</span>
            </p>
            <div className="mt-7 flex flex-col items-center gap-3">
              {!checking && (
                <>
                  <PaymentHelpButton
                    className="max-w-sm"
                    details={{
                      readingId: result?.readingId,
                      plan: result?.plan,
                      orderId,
                      issue: "return_page",
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      polls.current = 0;
                      setChecking(true);
                      void check();
                    }}
                  >
                    {t.payReturn.again}
                  </Button>
                </>
              )}
              <Link href="/" className="text-sm text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
                {t.payReturn.home}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
