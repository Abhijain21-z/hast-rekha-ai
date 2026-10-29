import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments, readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { cashfreeConfigured, createCashfreeOrder } from "@/lib/cashfree";
import { PLAN_PRICES, isPaidPlan, type PaidPlan } from "@/lib/plans";
import { couponPrice, findCoupon } from "@/lib/coupons";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PLAN_NOTE: Record<PaidPlan, string> = {
  pro: "Hast Rekha AI — Pro report",
  diwali: "Hast Rekha AI — Pro report + Diwali Puja PDF",
  bundle: "Hast Rekha AI — Pro report + Dhandayak book",
  ultra: "Hast Rekha AI — Ultra Pro (report + book)",
  membership: "Hast Rekha AI — 30-day membership",
};

/**
 * Create a Cashfree order and hand back its payment session id. The price
 * always comes from the server-side plan table — never the client. A coupon
 * code is re-resolved here too, so a tampered request cannot invent a price.
 *
 * Report plans unlock one reading. The membership is a standalone 30-day pass:
 * it needs a signed-in account but no reading.
 */
export async function POST(req: Request) {
  if (!cashfreeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  const limit = rateLimit(`cashfree-order:${clientIp(req)}`, 12, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    readingId?: unknown;
    plan?: unknown;
    phone?: unknown;
    whatsappOptIn?: unknown;
    coupon?: unknown;
  };
  const plan = isPaidPlan(body.plan) ? body.plan : null;
  const readingId = typeof body.readingId === "string" ? body.readingId : "";
  const whatsappOptIn = body.whatsappOptIn === true;
  const coupon = findCoupon(body.coupon);

  if (!plan) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const isMembership = plan === "membership";
  if (!isMembership && !UUID_RE.test(readingId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Cashfree requires the payer's phone on every order. It powers the checkout
  // header and the UPI app request, so it must be the visitor's real number.
  const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  const user = await getCurrentUser().catch(() => null);

  let reading: typeof readings.$inferSelect | null = null;
  if (!isMembership) {
    const [row] = await db.select().from(readings).where(eq(readings.id, readingId)).limit(1);
    if (!row) return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    reading = row;

    if (plan === "pro" && row.premium) {
      return NextResponse.json({ error: "This report is already unlocked" }, { status: 409 });
    }
    if (plan === "diwali" && row.diwaliPdf) {
      return NextResponse.json({ error: "The Diwali Puja PDF is already unlocked" }, { status: 409 });
    }
    if ((plan === "bundle" || plan === "ultra") && row.ultra) {
      return NextResponse.json({ error: "The book is already unlocked" }, { status: 409 });
    }
  }

  // A membership belongs to an account, so there must be a signed-in buyer.
  if (isMembership && !user) {
    return NextResponse.json({ error: "Please sign in to buy membership" }, { status: 401 });
  }

  const listPrice = PLAN_PRICES[plan];
  const amount = couponPrice(listPrice, coupon);
  const orderId = `hr_${plan}_${randomUUID().replace(/-/g, "").slice(0, 20)}`;

  const requestOrigin = new URL(req.url).origin;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hastrekhaai.online").replace(/\/$/, "");
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin);
  // Cashfree requires an HTTPS return URL, so local development sends the
  // browser to the public site; production stays on the request origin.
  const returnUrl = `${isLocal ? siteUrl : requestOrigin}/payment/return`;
  const notifyUrl = `${isLocal ? siteUrl : requestOrigin}/api/webhooks/cashfree`;

  try {
    const order = await createCashfreeOrder({
      orderId,
      amount,
      customerId: reading?.id ?? user!.id,
      customerPhone: phone,
      customerName: reading?.fullName ?? user!.name,
      customerEmail: user?.email ?? null,
      returnUrl,
      notifyUrl,
      note: PLAN_NOTE[plan],
    });

    await db.insert(payments).values({
      readingId: reading?.id ?? null,
      userId: user?.id ?? reading?.userId ?? null,
      orderId,
      plan,
      amount,
      status: "created",
      cfOrderId: order.cf_order_id ?? null,
      customerPhone: phone,
      whatsappOptIn,
      whatsappOptInAt: whatsappOptIn ? new Date() : null,
    });

    return NextResponse.json({
      orderId,
      paymentSessionId: order.payment_session_id,
      amount,
      listPrice,
      coupon: coupon?.code ?? null,
      plan,
    });
  } catch (error) {
    console.error("[cashfree] order create failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not start the payment. Please try again." }, { status: 502 });
  }
}
