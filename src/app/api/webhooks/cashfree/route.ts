import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { getCashfreeOrder, verifyCashfreeSignature } from "@/lib/cashfree";
import { fulfillCashfreePayment } from "@/lib/payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WebhookPayload {
  type?: string;
  data?: {
    order?: { order_id?: string; order_amount?: number };
    payment?: { payment_status?: string; cf_payment_id?: string | number; payment_group?: string };
  };
}

/**
 * Cashfree webhook. The signature is checked against the exact raw body, and a
 * success event is re-verified with the Get Order API before anything unlocks —
 * a forged payload can never open a report on its own.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const isValid = verifyCashfreeSignature({
    rawBody,
    timestamp: req.headers.get("x-webhook-timestamp"),
    signature: req.headers.get("x-webhook-signature"),
    secret: process.env.CASHFREE_SECRET_KEY,
  });
  if (!isValid) return new Response("Invalid signature", { status: 400 });

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return new Response("OK");
  }

  try {
    if (payload.type === "PAYMENT_SUCCESS_WEBHOOK" && payload.data?.payment?.payment_status === "SUCCESS") {
      const orderId = payload.data?.order?.order_id;
      if (orderId) {
        const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
        if (payment && payment.status !== "paid") {
          const order = await getCashfreeOrder(orderId);
          if (order?.order_status === "PAID" && Math.abs(Number(order.order_amount) - payment.amount) <= 0.01) {
            await fulfillCashfreePayment(orderId, {
              cfPaymentId: payload.data?.payment?.cf_payment_id != null ? String(payload.data.payment.cf_payment_id) : null,
              method: payload.data?.payment?.payment_group ?? null,
              raw: payload,
            });
          }
        }
      }
    } else if (payload.type === "PAYMENT_FAILED_WEBHOOK") {
      const orderId = payload.data?.order?.order_id;
      if (orderId) {
        await db
          .update(payments)
          .set({ status: "failed", updatedAt: new Date() })
          .where(and(eq(payments.orderId, orderId), ne(payments.status, "paid")));
      }
    }
  } catch (error) {
    // Verified webhook: still answer 200 so Cashfree does not retry forever.
    console.error("[cashfree] webhook handling failed:", error instanceof Error ? error.message : error);
  }

  return new Response("OK");
}
