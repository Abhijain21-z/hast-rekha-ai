import { NextResponse } from "next/server";
import { desc, and, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { sendProFollowUpTemplate } from "@/lib/whatsapp";
import { isAdminKey } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for bulk sending

/**
 * GET /api/whatsapp/follow-up-pro
 *
 * Sends the Pro-plan WhatsApp template to free readers who:
 *   - opted into marketing (marketing_opt_in = true)
 *   - have not bought Pro (premium = false)
 *   - have not already received this follow-up (followup_sent_at is null)
 *   - have a valid Indian mobile number
 *
 * Query params:
 *   limit  - max messages to send (default 50)
 *   dryRun - "1" only counts eligible readers, sends nothing
 *
 * Auth: x-cron-secret (CRON_SECRET) or ?key=<REVIEWS_ADMIN_KEY>.
 * Needs a Meta-approved template: WHATSAPP_PRO_FOLLOWUP_TEMPLATE_NAME.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const cronOk =
    Boolean(process.env.CRON_SECRET) && req.headers.get("x-cron-secret") === process.env.CRON_SECRET;
  const adminOk = isAdminKey(req.headers.get("x-admin-key")) || isAdminKey(url.searchParams.get("key"));
  if (!cronOk && !adminOk) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`whatsapp-followup:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const limitParam = Math.min(Math.max(Number(url.searchParams.get("limit") ?? "50") || 50, 1), 200);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const rows = await db
    .select({
      id: readings.id,
      fullName: readings.fullName,
      whatsappPhone: readings.whatsappPhone,
      marketingOptIn: readings.marketingOptIn,
      premium: readings.premium,
      followupSentAt: readings.followupSentAt,
      createdAt: readings.createdAt,
    })
    .from(readings)
    .where(
      and(
        eq(readings.marketingOptIn, true),
        eq(readings.premium, false),
        isNull(readings.followupSentAt),
        or(eq(readings.ultra, false), isNull(readings.ultra)),
      ),
    )
    .orderBy(desc(readings.createdAt))
    .limit(1000);

  // One message per phone number, newest reading first.
  const seen = new Set<string>();
  const eligible: typeof rows = [];
  for (const row of rows) {
    const phone = (row.whatsappPhone ?? "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone) || seen.has(phone)) continue;
    seen.add(phone);
    eligible.push(row);
    if (eligible.length >= limitParam) break;
  }

  if (dryRun) {
    return NextResponse.json({
      eligibleCount: eligible.length,
      sample: eligible.slice(0, 5).map((r) => ({ name: r.fullName, phone: r.whatsappPhone })),
    });
  }

  const results: Array<{ id: string; status: "sent" | "skipped" | "error"; error?: string }> = [];

  for (const row of eligible) {
    const phone = (row.whatsappPhone ?? "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      results.push({ id: row.id, status: "skipped", error: "invalid_phone" });
      continue;
    }

    try {
      await sendProFollowUpTemplate({ to: phone, name: row.fullName });
      await db
        .update(readings)
        .set({ followupSentAt: new Date(), updatedAt: new Date() })
        .where(eq(readings.id, row.id));
      results.push({ id: row.id, status: "sent" });
    } catch (error) {
      results.push({
        id: row.id,
        status: "error",
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    total: eligible.length,
    sent,
    errors,
    skipped: eligible.length - sent - errors,
    details: results,
  });
}
