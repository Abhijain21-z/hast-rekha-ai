/**
 * Payment fulfilment: turn a verified Cashfree order into an unlocked reading,
 * a book/PDF entitlement, or an active membership.
 *
 * Called from the webhook and from the return-page verification — whichever
 * arrives first wins, and the second call is a harmless no-op. WhatsApp report
 * delivery is transactional, Pro-only and deliberately non-blocking: a failed
 * message never rolls back a payment or leaves a report locked.
 */
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { payments, readings, users, type Payment } from "@/db/schema";
import { extendMembership } from "./membership";
import { includesBook, includesDiwaliPdf, includesProReport, type PaidPlan } from "./plans";
import { sendProReportWhatsApp } from "./whatsapp-report";
import { tokenLedger } from "@/db/schema";

export async function fulfillCashfreePayment(
  orderId: string,
  info: { cfPaymentId?: string | null; method?: string | null; raw?: unknown } = {},
) {
  const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
  if (!payment) return null;

  const firstPayment = payment.status !== "paid";

  if (firstPayment) {
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

  const plan = payment.plan as PaidPlan;
  let reading: typeof readings.$inferSelect | null = null;
  let proUnlockedNow = false;

  if (payment.readingId) {
    const [existing] = await db
      .select()
      .from(readings)
      .where(eq(readings.id, payment.readingId))
      .limit(1);

    if (existing) {
      const updates: Partial<typeof readings.$inferInsert> = { updatedAt: new Date() };
      if (includesProReport(plan) && !existing.premium) {
        updates.premium = true;
        updates.premiumAt = new Date();
        proUnlockedNow = true;
      }
      // Never downgrade or re-date: the book and the Diwali PDF are separate,
      // additive entitlements, and an add-on purchase must not reset the
      // original Pro timestamp (the Diwali grandfathering cutoff uses it).
      if (includesBook(plan) && !existing.ultra) updates.ultra = true;
      if (includesDiwaliPdf(plan) && !existing.diwaliPdf) updates.diwaliPdf = true;

      [reading] = await db
        .update(readings)
        .set(updates)
        .where(eq(readings.id, payment.readingId))
        .returning();
    }
  }

  let membershipUntil: Date | null = null;
  if (plan === "membership") {
    const userId = payment.userId ?? reading?.userId ?? null;
    if (userId) {
      const [user] = await db
        .select({ until: users.membershipUntil })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      membershipUntil = extendMembership(user?.until ?? null);
      await db.update(users).set({ membershipUntil }).where(eq(users.id, userId));
    }
  }

  // Send the report link only on the first successful fulfilment, only when
  // this payment actually unlocked Pro, and only for plans that include it.
  // Free users never reach this path.
  if (firstPayment && reading && proUnlockedNow) {
    void sendProReportWhatsApp({
      phone: payment.customerPhone,
      name: reading.fullName,
      readingId: reading.id,
    }).catch((error) => {
      console.error(
        "[whatsapp] report delivery failed (payment stays unlocked):",
        error instanceof Error ? error.message : error,
      );
    });
  }

  // Pro users get 200 AI chat tokens (instead of 50 minutes).
  if (proUnlockedNow && reading?.userId) {
    try {
      await db.insert(tokenLedger).values({
        userId: reading.userId,
        delta: 200,
        reason: "pro_bonus",
        balanceAfter: 200,
        readingId: reading.id,
        metadata: { note: "Pro report unlocked — 200 AI tokens bonus" },
      } as any);
      await db
        .update(users)
        .set({ tokenBalance: sql`${users.tokenBalance} + 200` })
        .where(eq(users.id, reading.userId));
    } catch {
      // Token bonus failure must never roll back a verified payment.
      console.error("[tokens] Pro bonus grant failed for user", reading.userId);
    }
  }

  if (!reading && plan !== "membership") return null;
  return { reading, plan, orderId: payment.orderId, membershipUntil };
}
