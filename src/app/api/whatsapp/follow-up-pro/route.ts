import { NextResponse } from "next/server";
import { desc, and, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { sendProFollowUpTemplate } from "@/lib/whatsapp";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for bulk sending

/**
 * GET /api/whatsapp/follow-up-pro
 *
 * Sends Pro plan follow-up WhatsApp messages to free readers who:
 *   - Have marketing_opt_in = true
 *   - Have not purchased Pro (premium = false)
 *   - Have a valid WhatsApp phone number
 *
 * Query params:
 *   limit - max messages to send (default 50)
 *   dryRun - if "1", only counts eligible users without sending
 *
 * Requires a valid WhatsApp marketing template approved by Meta.
 * Set WHATSAPP_PRO_FOLLOWUP_TEMPLATE_NAME env var to your template name.
 */
export async function GET(req: Request) {
  const limit = rateLimit(`whatsapp-followup:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const url = new URL(req.url);
  const limitParam = Number(url.searchParams.get("limit") ?? "50");
  const dryRun = url.searchParams.get("dryRun") === "1";

  // Find free readers with marketing consent and valid phone
  const rows = await db
    .select({
      id: readings.id,
      fullName: readings.fullName,
      whatsappPhone: readings.whatsappPhone,
      marketingOptIn: readings.marketingOptIn,
      premium: readings.premium,
    })
    .from(readings)
    .where(and(eq(readings.marketingOptIn, true), eq(readings.premium, false)))
    .orderBy(desc(readings.createdAt))
    .limit(limitParam);
  if (dryRun) {
    return NextResponse.json({
      eligibleCount: rows.length,
      sample: rows.slice(0, 5).map((r: { fullName: string; whatsappPhone: string | null }) => ({ fullName: r.fullName, phone: r.whatsappPhone })),
    });
  }

  const proLink = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hastrekhaai.online";
  const results: Array<{ id: string; status: "sent" | "skipped" | "error"; error?: string }> = [];

  for (const row of rows) {
    if (!row.whatsappPhone || !/^[6-9]\d{9}$/.test(row.whatsappPhone.replace(/\D/g, ""))) {
      results.push({ id: row.id, status: "skipped", error: "invalid_phone" });
      continue;
    }

    try {
      await sendProFollowUpTemplate({
        to: row.whatsappPhone,
        name: row.fullName,
        url: `${proLink}/reading`,
      });
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
    total: rows.length,
    sent,
    errors,
    skipped: rows.length - sent - errors,
    details: results,
  });
}
