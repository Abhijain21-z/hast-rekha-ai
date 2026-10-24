import { NextResponse } from "next/server";
import { and, eq, isNull, notExists, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { readings, whatsappDailySends, whatsappSubscribers } from "@/db/schema";
import { RASHIS } from "@/lib/content";
import {
  buildDailyRashifalUrl,
  isRashifalDay,
  istDateKey,
  istWeekday,
  normalizeWhatsAppPhone,
  rashifalWeekdays,
  sendDailyRashifalTemplate,
  whatsappConfigured,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_LIMIT = 50;
// Keeps a single 60-second function invocation comfortably bounded.
const MAX_LIMIT = 100;
// The weekday filter runs in JS, so cap how many rows one run may scan.
const MAX_SCAN = 1000;

/** Cost guard: cap how many marketing messages one cron run can send. */
function runLimit(): number {
  const raw = Number(
    process.env.RASHIFAL_WHATSAPP_LIMIT ?? process.env.DAILY_WHATSAPP_LIMIT,
  );
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(raw), MAX_LIMIT);
}

/**
 * Paid readers are never sent the reminder. A reading is the source of truth:
 * match either the phone saved on the reading or the subscriber's linked
 * reading, so an old Pro purchase still suppresses the message.
 */
function notPaidReader() {
  return notExists(
    db
      .select({ id: readings.id })
      .from(readings)
      .where(
        and(
          or(
            eq(readings.whatsappPhone, whatsappSubscribers.phone),
            eq(readings.id, whatsappSubscribers.readingId),
          ),
          or(eq(readings.premium, true), eq(readings.ultra, true)),
        ),
      ),
  );
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
 * Daily WhatsApp rashifal reminder cron.
 *
 * Vercel Cron calls this every day at 09:00 IST (03:30 UTC) with
 * `Authorization: Bearer $CRON_SECRET`. Each opted-in subscriber is assigned
 * two fixed weekdays from their subscriber id, so the cohort is spread across
 * the week and one person never receives more than two messages in a week. The
 * route is inert until the sender credentials and the Meta-approved template
 * exist. Readers who bought Pro or Ultra Pro are excluded.
 *
 * Query params (all still require the cron secret):
 *   ?dry=1       list today's assigned candidates without sending
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
  const limit = runLimit();
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
        subscriber: whatsappSubscribers,
      })
      .from(whatsappSubscribers)
      .where(and(eq(whatsappSubscribers.status, "opted_in"), notPaidReader()))
      .orderBy(sql`${whatsappSubscribers.lastSentAt} asc nulls first`)
      .limit(MAX_SCAN);
    const due = rows
      .filter(({ subscriber }) => isRashifalDay(subscriber.id, sendDate))
      .slice(0, limit);
    return NextResponse.json({
      ok: true,
      dryRun: true,
      sendDate,
      weekday: istWeekday(sendDate) + 1,
      limit,
      scanLimit: MAX_SCAN,
      candidates: due.map(({ subscriber }) => ({
        phone: mask(subscriber.phone),
        name: firstName(subscriber.name),
        rashi: subscriber.rashiKey,
        sendDays: rashifalWeekdays(subscriber.id).map((day) => day + 1),
        lastSentAt: subscriber.lastSentAt,
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
    .where(and(eq(whatsappSubscribers.status, "opted_in"), isNull(whatsappDailySends.id), notPaidReader()))
    .orderBy(sql`${whatsappSubscribers.lastSentAt} asc nulls first`)
    .limit(MAX_SCAN);

  // Only the subscribers whose two assigned weekdays include today.
  const due = rows
    .filter(({ subscriber }) => isRashifalDay(subscriber.id, sendDate))
    .slice(0, limit);

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const errors: { phone: string; error: string }[] = [];

  for (const { subscriber } of due) {
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
    weekday: istWeekday(sendDate) + 1,
    limit,
    candidates: due.length,
    sent,
    failed,
    skipped,
    errors,
  });
}
