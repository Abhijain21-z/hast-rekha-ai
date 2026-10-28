import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { cashfreeConfigured, getCashfreeOrder } from "@/lib/cashfree";
import { fulfillCashfreePayment } from "@/lib/payments";
import type { PaidPlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

/**
 * Return-page verification. Cashfree's redirect carries only `order_id`; this
 * route re-fetches the order from Cashfree (authoritative) and unlocks the
 * reading when the order is genuinely PAID. Never trusts query-string flags.
 */
export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("order_id")?.trim() ?? "";
  if (!orderId) return NextResponse.json({ error: "Missing order_id" }, { status: 400 });

  const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
  if (!payment) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const base = { plan: payment.plan as PaidPlan, readingId: payment.readingId };

  if (payment.status === "paid") {
    return NextResponse.json({ status: "PAID", ...base });
  }
  if (!cashfreeConfigured()) {
    return NextResponse.json({ status: "UNAVAILABLE", ...base }, { status: 503 });
  }

  const order = await getCashfreeOrder(orderId);
  if (!order) return NextResponse.json({ status: "UNKNOWN", ...base });

  if (order.order_status === "PAID") {
    // Amount check: never unlock on a mismatch (defence against tampering).
    if (Math.abs(Number(order.order_amount) - payment.amount) > 0.01) {
      console.error("[cashfree] amount mismatch", { orderId, expected: payment.amount, got: order.order_amount });
      return NextResponse.json({ status: "MISMATCH", ...base }, { status: 409 });
    }
    await fulfillCashfreePayment(orderId, { raw: order });
    return NextResponse.json({ status: "PAID", ...base });
  }

  if (order.order_status === "EXPIRED" || order.order_status === "TERMINATED") {
    await db.update(payments).set({ status: "expired", updatedAt: new Date() }).where(eq(payments.orderId, orderId));
  }

  return NextResponse.json({ status: order.order_status, ...base });
}
