/**
 * Browser-only Cashfree Checkout JS v3 loader.
 *
 * The SDK is loaded once and the instance is cached — Cashfree's docs warn
 * against creating a new instance inside every click handler. The secret key
 * never reaches this file: the browser only receives `payment_session_id`.
 */
export type CashfreeCheckoutResult = {
  error?: unknown;
  redirect?: boolean;
  paymentDetails?: unknown;
};

export type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_top" | "_blank";
  }) => Promise<CashfreeCheckoutResult>;
};

declare global {
  interface Window {
    Cashfree?: (options: { mode: "production" | "sandbox" }) => CashfreeInstance;
  }
}

const SDK_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";
let sdkPromise: Promise<void> | null = null;
let instance: CashfreeInstance | null = null;
let instanceMode: "production" | "sandbox" | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Cashfree SDK is browser-only"));
  if (window.Cashfree) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error("Cashfree SDK failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}

export async function getCashfree(mode: "production" | "sandbox"): Promise<CashfreeInstance> {
  await loadSdk();
  if (!window.Cashfree) throw new Error("Cashfree SDK unavailable");
  if (!instance || instanceMode !== mode) {
    instance = window.Cashfree({ mode });
    instanceMode = mode;
  }
  return instance;
}
