"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Smartphone } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Modal } from "@/components/ui";
import { hasInstallPrompt, installPlatform, isInstalled, registerServiceWorker, subscribeInstall, takeInstallPrompt } from "@/lib/pwa";

/**
 * Installs the site as an app on the phone.
 * Registers the service worker (needed for the Android install prompt) and shows
 * the button in the top bar. When the browser gives us no install prompt (iOS,
 * or desktop Chrome without the criteria) we explain how to add it manually
 * instead of failing.
 */
export default function PwaInstall() {
  const { t } = useLang();
  const installed = useSyncExternalStore(subscribeInstall, isInstalled, () => false);
  const canPrompt = useSyncExternalStore(subscribeInstall, hasInstallPrompt, () => false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [what, setWhat] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    registerServiceWorker();
  }, []);

  async function install() {
    const prompt = takeInstallPrompt();
    if (!prompt) {
      setWhat(installPlatform());
      setHelpOpen(true);
      return;
    }
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      /* user dismissed */
    }
  }

  if (installed) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => void install()}
        title={t.top.install}
        aria-label={t.top.install}
        className={
          canPrompt
            ? "flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-2.5 py-1.5 text-xs font-semibold text-gold-200 transition hover:bg-gold-400/20"
            : "flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-gold-400/50"
        }
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t.top.install}</span>
      </button>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title={t.top.installTitle}>
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center gap-3 rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4">
            <Smartphone className="h-5 w-5 shrink-0 text-gold-300" />
            <p className="text-slate-200">{t.top.installIntro}</p>
          </div>
          <ol className="space-y-2.5">
            {(what === "ios" ? t.top.installIos : what === "android" ? t.top.installAndroid : t.top.installDesktop)
              .split("\n")
              .filter(Boolean)
              .map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-xs font-semibold text-gold-300">{i + 1}</span>
                  <span className="pt-0.5 text-slate-200">{step}</span>
                </li>
              ))}
          </ol>
          <div className="flex justify-end">
            <Button onClick={() => setHelpOpen(false)}>{t.common.ok}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
