"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input } from "@/components/ui";

interface Props {
  readingId: string;
  rashiLabel: string;
  /** Server-side status for the phone saved with this reading. */
  subscribed: boolean;
  /** Last four digits only; the full number never enters the page HTML. */
  maskedPhone: string | null;
}

/**
 * Explicit daily-rashifal opt-in shown right under the rashifal panel.
 *
 * This is separate from the payment/report-update consent. The API also checks
 * that the number matches the one saved with the reading, so a shared report
 * link cannot subscribe an unrelated number.
 */
export default function WhatsAppDailyOptIn({
  readingId,
  rashiLabel,
  subscribed,
  maskedPhone,
}: Props) {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">(
    subscribed ? "done" : "idle",
  );
  const [error, setError] = useState("");

  /** Read the number saved by the reading form only when the visitor focuses
   * the field — avoids a state-setting effect and a hydration mismatch. */
  function prefillFromStorage() {
    if (phone) return;
    const saved = window.localStorage.getItem("hr-whatsapp");
    if (saved && /^[6-9]\d{9}$/.test(saved)) setPhone(saved);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits) || !consent) {
      setError(t.result.dailyWhatsappErr);
      return;
    }

    setState("saving");
    setError("");
    try {
      const res = await fetch("/api/whatsapp/daily-rashifal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, phone: digits, consent: true }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          data?.error === "phone_mismatch"
            ? t.result.dailyWhatsappMismatch
            : t.result.dailyWhatsappFailed,
        );
        setState("error");
        return;
      }
      window.localStorage.setItem("hr-whatsapp", digits);
      setState("done");
    } catch {
      setError(t.result.dailyWhatsappFailed);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <section className="no-print mt-8">
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </span>
            <div>
              <p className="font-display text-lg text-white">{t.result.dailyWhatsappOn}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                {t.result.dailyWhatsappOnBody}
              </p>
              {maskedPhone && <p className="mt-2 text-xs text-slate-500">{maskedPhone}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="no-print mt-8">
      <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.05] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/15">
            <MessageCircle className="h-5 w-5 text-gold-300" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg text-white">{t.result.dailyWhatsappTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              {t.result.dailyWhatsappBody}
            </p>
            <p className="mt-1 text-xs text-gold-200/80">{rashiLabel}</p>

            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onFocus={prefillFromStorage}
                  placeholder={
                    maskedPhone
                      ? `${t.result.dailyWhatsappPlaceholder} (${maskedPhone})`
                      : t.result.dailyWhatsappPlaceholder
                  }
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  className="sm:max-w-xs"
                  aria-label={t.result.dailyWhatsappPlaceholder}
                />
                <Button
                  type="submit"
                  loading={state === "saving"}
                  disabled={!consent}
                  className="shrink-0"
                >
                  {t.result.dailyWhatsappCta}
                </Button>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-slate-400">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5c242]"
                />
                <span>{t.result.dailyWhatsappConsent}</span>
              </label>

              {error && <p className="text-xs text-rose-300">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
