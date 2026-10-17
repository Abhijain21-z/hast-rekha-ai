/**
 * Installability plumbing for the "Install App" button.
 *
 * Everything lives at module scope so the browser's `beforeinstallprompt` event
 * is captured even if it fires before React has mounted, and so the component
 * can read state through useSyncExternalStore instead of setState-in-effect.
 */

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPromptEvent | null = null;
let installedCache: boolean | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function isStandalone(): boolean {
  try {
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
      window.matchMedia?.("(display-mode: minimal-ui)")?.matches === true ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

/** Subscribe to install-state changes (stable identity for useSyncExternalStore). */
export function subscribeInstall(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Is the app already installed / opened as a standalone app? */
export function isInstalled(): boolean {
  if (installedCache === null) installedCache = typeof window === "undefined" ? false : isStandalone();
  return installedCache;
}

/** Is the browser offering us a native install dialog right now? */
export function hasInstallPrompt(): boolean {
  return deferred !== null;
}

/** Consume the pending prompt (it can only be used once). */
export function takeInstallPrompt(): InstallPromptEvent | null {
  const current = deferred;
  deferred = null;
  emit();
  return current;
}

export function installPlatform(): "ios" | "android" | "other" {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/** Registers the service worker the install prompt requires. Never throws. */
export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {
    /* service worker is optional — offline support simply won't be available */
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installedCache = true;
    deferred = null;
    emit();
  });
}
