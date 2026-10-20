/**
 * Server-only Cashfree Payment Gateway helpers (REST API — no SDK dependency).
 *
 * The browser only ever receives a short-lived `payment_session_id`; the App ID
 * and secret key stay in `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` (never
 * `NEXT_PUBLIC_`), so they cannot leak into the client bundle.
 */
import { createHmac, timingSafeEqual } from "crypto";

/** Current PG REST API version (see Cashfree skill docs). */
export const CASHFREE_API_VERSION = "2026-01-01";

export function cashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

export function cashfreeApiBase() {
  return process.env.CASHFREE_ENV === "sandbox" ? "https://sandbox.cashfree.com/pg" : "https://api.cashfree.com/pg";
}

function apiHeaders() {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secret) throw new Error("Cashfree keys are not configured");
  return {
    "x-client-id": appId,
    "x-client-secret": secret,
    "x-api-version": CASHFREE_API_VERSION,
    "Content-Type": "application/json",
  };
}

export interface CashfreeCreateOrderInput {
  orderId: string;
  amount: number;
  customerId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  returnUrl: string;
  notifyUrl: string;
  note?: string;
}

export interface CashfreeOrder {
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | string;
  order_amount: number;
  cf_order_id?: string;
  payment_session_id?: string;
}

/**
 * Create an order and return its `payment_session_id`.
 * Throws when Cashfree rejects the request so the caller can show a retry.
 */
export async function createCashfreeOrder(input: CashfreeCreateOrderInput): Promise<CashfreeOrder> {
  const res = await fetch(`${cashfreeApiBase()}/orders`, {
    method: "POST",
    headers: apiHeaders(),
    cache: "no-store",
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        // Cashfree requires a phone on every order; the checkout collects the
        // payment details itself, so this is only a booking reference.
        customer_phone: "9999999999",
        customer_name: input.customerName || "Hast Rekha guest",
        customer_email: input.customerEmail || "guest@hastrekhaai.online",
      },
      order_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
      },
      order_note: input.note,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as CashfreeOrder & { message?: string };
  if (!res.ok || !data.payment_session_id) {
    throw new Error(`Cashfree order failed: ${res.status} ${data.message ?? ""}`.trim());
  }
  return data;
}

/** Authoritative order status — always used before unlocking a reading. */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrder | null> {
  const res = await fetch(`${cashfreeApiBase()}/orders/${encodeURIComponent(orderId)}`, {
    headers: apiHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as CashfreeOrder | null;
}

/**
 * Webhook signature check: base64(HMAC-SHA256(timestamp + rawBody, secret)).
 * The raw body must be the exact bytes received — never the re-serialised JSON.
 */
export function verifyCashfreeSignature(input: {
  rawBody: string;
  timestamp: string | null | undefined;
  signature: string | null | undefined;
  secret: string | null | undefined;
}) {
  const { rawBody, timestamp, signature, secret } = input;
  if (!rawBody || !timestamp || !signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(timestamp + rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
