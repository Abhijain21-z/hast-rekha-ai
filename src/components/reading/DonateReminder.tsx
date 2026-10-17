"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandHeart, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui";
import DonateModal from "./DonateModal";

/** Suggests a voluntary donation 8 minutes after the prediction appears (once per session). */
export function DonateReminder({ enabled }: { enabled: boolean }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed) return;
    if (sessionStorage.getItem("hr_donate_reminder_shown")) return;
    const id = window.setTimeout(() => {
      sessionStorage.setItem("hr_donate_reminder_shown", "1");
      setOpen(true);
    }, 8 * 60 * 1000);
    return () => window.clearTimeout(id);
  }, [enabled, dismissed]);

  function close() {
    setOpen(false);
    setDismissed(true);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-[80] flex items-end justify-center bg-cosmic-950/70 p-4 backdrop-blur-sm sm:items-center"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-md rounded-3xl border border-rose-300/25 p-7 shadow-2xl"
            >
              <button onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/15">
                <HandHeart className="h-6 w-6 text-rose-300" />
              </div>
              <h3 className="mt-4 font-display text-2xl text-white">{t.donateReminder.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.donateReminder.body}</p>
              <div className="mt-6 flex gap-3">
                <Button variant="gold" className="flex-1" onClick={() => { setOpen(false); setDonateOpen(true); }} icon={<HandHeart className="h-4 w-4" />}>
                  {t.donateReminder.btn}
                </Button>
                <Button variant="ghost" onClick={close}>{t.donateReminder.later}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
