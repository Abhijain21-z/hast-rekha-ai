"use client";

import { useEffect, useState } from "react";
import { HandHeart, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui";
import DonateModal from "./DonateModal";

/**
 * Optional dakshina nudge.
 *
 * It is deliberately a quiet inline card and never an auto-opening popup: a
 * payment-looking dialog that appears by itself is exactly what irritates a
 * reader mid-prediction. The donate dialog only opens when the reader taps the
 * button, and the card itself shows at most once per session.
 */
export function DonateReminder({ enabled }: { enabled: boolean }) {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed) return;
    if (sessionStorage.getItem("hr_donate_reminder_shown")) return;
    const id = window.setTimeout(() => {
      sessionStorage.setItem("hr_donate_reminder_shown", "1");
      setShow(true);
    }, 8 * 60 * 1000);
    return () => window.clearTimeout(id);
  }, [enabled, dismissed]);

  function close() {
    setShow(false);
    setDismissed(true);
  }

  return (
    <>
      {show && (
        <div className="no-print glass mt-8 flex flex-col gap-4 rounded-2xl border border-rose-300/25 p-5 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-400/15">
            <HandHeart className="h-5 w-5 text-rose-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-white">{t.donateReminder.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{t.donateReminder.body}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="gold" size="sm" onClick={() => setDonateOpen(true)} icon={<HandHeart className="h-4 w-4" />}>
              {t.donateReminder.btn}
            </Button>
            <button onClick={close} aria-label={t.common.close} className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
