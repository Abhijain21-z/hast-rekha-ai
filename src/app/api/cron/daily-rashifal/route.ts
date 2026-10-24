import { NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { whatsappDailySends, whatsappSubscribers } from "@/db/schema";
import { RASHIS } from "@/lib/content";
import {
  buildDailyRashifalUrl,
  istDateKey,
  normalizeWhatsAppPhone,
  sendDailyRashifalTemplate,
  whatsappConfigured,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_LIMIT = 50;
// Keeps a single 60-second function invocation comfortably bounded.
const MAX_LIMIT = 100;

/** Cost guard: cap how many marketing messages one cron run can send. */
function dailyLimit(): number {
  const raw = Number(process.env.DAILY_WHATSAPP_LIMIT);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(raw), MAX_LIMIT);
}

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function firstName(name: string | null): string {
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first || "Mitra";
}

function mask(phone: string): string {
  return `••••••${phone.slice(-4)}`;
}

/**
 * Daily WhatsApp rashifal cron.
 *
 * Vercel Cron calls this at 09:00 IST (03:30 UTC) with
 * `Authorization: Bearer $CRON_SECRET`. The route is inert until the sender
 * credentials and the Meta-approved template exist.
 *
 * Query params (all still require the cron secret):
 *   ?dry=1       list candidates without sending
 *   ?testPhone=  send one test message to the owner's own number
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ error: "cron_secret_missing" }, { status: 503 });
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = dailyLimit();
  const sendDate = istDateKey();

  const testPhone = url.searchParams.get("testPhone");
  if (testPhone) {
    if (!whatsappConfigured()) {
      return NextResponse.json(
        {
          error: "whatsapp_not_configured",
          required: ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"],
        },
        { status: 503 },
      );
    }
    const to = normalizeWhatsAppPhone(testPhone);
    if (!to) {
      return NextResponse.json({ error: "invalid_test_phone" }, { status: 400 });
    }
    const rashi = RASHIS[0];
    try {
      const providerMessageId = await sendDailyRashifalTemplate({
        to,
        name: "Test",
        rashiName: rashi.short.hi,
        url: buildDailyRashifalUrl(rashi.key),
      });
      return NextResponse.json({ ok: true, test: true, providerMessageId });
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "send_failed",
          detail: error instanceof Error ? error.message : "unknown_error",
        },
        { status: 502 },
      );
    }
  }

  if (url.searchParams.get("dry") === "1") {
    const rows = await db
      .select({
        phone: whatsappSubscribers.phone,
        name: whatsappSubscribers.name,
        rashiKey: whatsappSubscribers.rashiKey,
        lastSentAt: whatsappSubscribers.lastSentAt,
      })
      .from(whatsappSubscribers)
      .where(eq(whatsappSubscribers.status, "opted_in"))
      .orderBy(sql`${whatsappSubscribers.lastSentAt} asc nulls first`)
      .limit(limit);
    return NextResponse.json({
      ok: true,
      dryRun: true,
      sendDate,
      limit,
      candidates: rows.map((row) => ({
        phone: mask(row.phone),
        name: firstName(row.name),
        rashi: row.rashiKey,
        lastSentAt: row.lastSentAt,
      })),
    });
  }

  if (!whatsappConfigured()) {
    return NextResponse.json(
      {
        error: "whatsapp_not_configured",
        required: ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"],
      },
      { status: 503 },
    );
  }

  // One row per opted-in subscriber who has no send attempt for today.
  const rows = await db
    .select({ subscriber: whatsappSubscribers })
    .from(whatsappSubscribers)
    .leftJoin(
      whatsappDailySends,
      and(
        eq(whatsappDailySends.subscriberId, whatsappSubscribers.id),
        eq(whatsappDailySends.sendDate, sendDate),
      ),
    )
    .where(and(eq(whatsappSubscribers.status, "opted_in"), isNull(whatsappDailySends.id)))
    .orderBy(sql`${whatsappSubscribers.lastSentAt} asc nulls first`)
    .limit(limit);

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const errors: { phone: string; error: string }[] = [];

  for (const { subscriber } of rows) {
    const rashi = RASHIS.find((item) => item.key === subscriber.rashiKey);
    if (!rashi) {
      skipped += 1;
      await db
        .update(whatsappSubscribers)
        .set({ lastError: "invalid_rashi", updatedAt: new Date() })
        .where(eq(whatsappSubscribers.id, subscriber.id));
      continue;
    }

    const now = new Date();
    try {
      const providerMessageId = await sendDailyRashifalTemplate({
        to: subscriber.phone,
        name: firstName(subscriber.name),
        rashiName: rashi.short.hi,
        url: buildDailyRashifalUrl(rashi.key),
      });
      await db
        .insert(whatsappDailySends)
        .values({
          subscriberId: subscriber.id,
          phone: subscriber.phone,
          sendDate,
          status: "sent",
          providerMessageId,
        })
        .onConflictDoNothing();
      await db
        .update(whatsappSubscribers)
        .set({
          lastSentAt: now,
          sendCount: sql`${whatsappSubscribers.sendCount} + 1`,
          lastError: null,
          updatedAt: now,
        })
        .where(eq(whatsappSubscribers.id, subscriber.id));
      sent += 1;
    } catch (error) {
      failed += 1;
      const message = (error instanceof Error ? error.message : "send_failed").slice(0, 1000);
      errors.push({ phone: mask(subscriber.phone), error: message });
      await db
        .insert(whatsappDailySends)
        .values({
          subscriberId: subscriber.id,
          phone: subscriber.phone,
          sendDate,
          status: "failed",
          error: message,
        })
        .onConflictDoNothing();
      await db
        .update(whatsappSubscribers)
        .set({ lastError: message, updatedAt: now })
        .where(eq(whatsappSubscribers.id, subscriber.id));
    }
  }

  return NextResponse.json({
    ok: true,
    sendDate,
    limit,
    candidates: rows.length,
    sent,
    failed,
    skipped,
    errors,
  });
}
