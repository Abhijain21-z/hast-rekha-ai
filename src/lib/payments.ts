/**
 * Payment fulfilment: turn a verified Cashfree order into an unlocked reading.
 * Called from the webhook and from the return-page verification — whichever
 * arrives first wins, and the second call is a harmless no-op.
 */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments, readings, type Payment } from "@/db/schema";

export async function fulfillCashfreePayment(
  orderId: string,
  info: { cfPaymentId?: string | null; method?: string | null; raw?: unknown } = {},
) {
  const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
  if (!payment) return null;

  if (payment.status !== "paid") {
    await db
      .update(payments)
      .set({
        status: "paid",
        cfPaymentId: info.cfPaymentId ?? payment.cfPaymentId,
        paymentMethod: info.method ?? payment.paymentMethod,
        raw: (info.raw ?? payment.raw) as Payment["raw"],
        updatedAt: new Date(),
      })
      .where(eq(payments.orderId, orderId));
  }

  const [reading] = await db
    .update(readings)
    .set({
      premium: true,
      // Never downgrade: Ultra adds the book, Pro just unlocks the report.
      ...(payment.plan === "ultra" ? { ultra: true } : {}),
      premiumAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(readings.id, payment.readingId))
    .returning();

  if (!reading) return null;
  return { reading, plan: payment.plan as "pro" | "ultra", orderId: payment.orderId };
}
