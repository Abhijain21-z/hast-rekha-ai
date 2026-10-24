import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { RASHIS } from "@/lib/content";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { toIndiaTenDigits } from "@/lib/whatsapp";
import { upsertWhatsAppSubscriber } from "@/lib/whatsapp-subscribers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Body {
  readingId?: string;
  phone?: string;
  /** Must be literally true; an unchecked checkbox is not consent. */
  consent?: boolean;
}

/**
 * Explicit opt-in for the daily rashifal WhatsApp message.
 *
 * This is deliberately separate from the payment/report-update phone field.
 * The full number is never returned; the reading page only renders a mask.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`whatsapp-daily:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const readingId = typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (!UUID.test(readingId)) {
    return NextResponse.json({ error: "invalid_reading" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? toIndiaTenDigits(body.phone) : null;
  if (!phone) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  const [reading] = await db
    .select({
      id: readings.id,
      fullName: readings.fullName,
      whatsappPhone: readings.whatsappPhone,
      result: readings.result,
    })
    .from(readings)
    .where(eq(readings.id, readingId))
    .limit(1);

  if (!reading) {
    return NextResponse.json({ error: "reading_not_found" }, { status: 404 });
  }

  // If the reading already saved a number, only that number can be opted in.
  // This stops a shared reading link from subscribing an unrelated number.
  const savedPhone = toIndiaTenDigits(reading.whatsappPhone);
  if (savedPhone && savedPhone !== phone) {
    return NextResponse.json({ error: "phone_mismatch" }, { status: 403 });
  }

  const rashiKey = RASHIS[reading.result.moonRashi]?.key;
  if (!rashiKey) {
    return NextResponse.json({ error: "invalid_rashi" }, { status: 400 });
  }

  try {
    // Older readings may have no phone saved. Persist the opted-in number so
    // the report card shows the ON state on the next visit.
    if (!savedPhone) {
      await db
        .update(readings)
        .set({ whatsappPhone: phone, updatedAt: new Date() })
        .where(eq(readings.id, reading.id));
    }
    await upsertWhatsAppSubscriber({
      phone,
      name: reading.fullName,
      rashiKey,
      readingId: reading.id,
      source: "report_page",
    });
  } catch (error) {
    console.error(
      "[whatsapp] daily opt-in failed:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
