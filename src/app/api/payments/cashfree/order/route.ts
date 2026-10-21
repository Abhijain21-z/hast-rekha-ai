import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments, readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { cashfreeConfigured, createCashfreeOrder } from "@/lib/cashfree";
import { PREMIUM_PRICE } from "@/lib/premium";
import { ULTRA_PRICE } from "@/lib/flags";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type Plan = "pro" | "ultra";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Create a Cashfree order for a reading and hand back its payment session id.
 * The price always comes from the server-side plan table — never the client.
 */
export async function POST(req: Request) {
  if (!cashfreeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet" }, { status: 503 });
  }

  const limit = rateLimit(`cashfree-order:${clientIp(req)}`, 12, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { readingId?: unknown; plan?: unknown; phone?: unknown; whatsappOptIn?: unknown };
  const readingId = typeof body.readingId === "string" ? body.readingId : "";
  const plan: Plan | null = body.plan === "ultra" ? "ultra" : body.plan === "pro" ? "pro" : null;
  const whatsappOptIn = body.whatsappOptIn === true;
  if (!plan || !UUID_RE.test(readingId)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Cashfree requires the payer's phone on every order. It powers the checkout
  // header and the UPI app request, so it must be the visitor's real number.
  const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  const [reading] = await db.select().from(readings).where(eq(readings.id, readingId)).limit(1);
  if (!reading) return NextResponse.json({ error: "Reading not found" }, { status: 404 });
  if (reading.ultra || (reading.premium && plan === "pro")) {
    return NextResponse.json({ error: "This report is already unlocked" }, { status: 409 });
  }

  const amount = plan === "ultra" ? ULTRA_PRICE : PREMIUM_PRICE;
  const orderId = `hr_${plan}_${randomUUID().replace(/-/g, "").slice(0, 20)}`;

  const requestOrigin = new URL(req.url).origin;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hastrekhaai.online").replace(/\/$/, "");
  const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin);
  // Cashfree requires an HTTPS return URL, so local development sends the
  // browser to the public site; production stays on the request origin.
  const returnUrl = `${isLocal ? siteUrl : requestOrigin}/payment/return`;
  const notifyUrl = `${isLocal ? siteUrl : requestOrigin}/api/webhooks/cashfree`;

  const user = await getCurrentUser().catch(() => null);

  try {
    const order = await createCashfreeOrder({
      orderId,
      amount,
      customerId: reading.id,
      customerPhone: phone,
      customerName: reading.fullName,
      customerEmail: user?.email ?? null,
      returnUrl,
      notifyUrl,
      note: plan === "ultra" ? "Hast Rekha AI — Ultra Pro (report + book)" : "Hast Rekha AI — Pro report",
    });

    await db.insert(payments).values({
      readingId: reading.id,
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
      plan,
    });
  } catch (error) {
    console.error("[cashfree] order create failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not start the payment. Please try again." }, { status: 502 });
  }
}
