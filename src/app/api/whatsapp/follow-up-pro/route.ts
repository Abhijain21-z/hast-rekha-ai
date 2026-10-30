import { NextResponse } from "next/server";
import { isAdminKey } from "@/lib/admin-auth";
import { sendFollowUps } from "@/lib/outreach-sender";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for bulk sending

/**
 * GET /api/whatsapp/follow-up-pro
 *
 * Sends the approved Pro-plan WhatsApp template to free readers who opted into
 * marketing and have not already received it. Paid readers (Pro/Ultra,
 * successful payment, or active membership) are excluded by the sender.
 *
 * Query params:
 *   limit  - max messages to send (default 50, max 200)
 *   dryRun - "1" only counts eligible readers, sends nothing
 *
 * Auth: x-cron-secret (CRON_SECRET), Authorization: Bearer CRON_SECRET, or the
 * owner key (x-admin-key header / ?key=).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  const cronOk =
    Boolean(secret) &&
    (req.headers.get("x-cron-secret") === secret ||
      req.headers.get("authorization") === `Bearer ${secret}`);
  const adminOk =
    isAdminKey(req.headers.get("x-admin-key")) || isAdminKey(url.searchParams.get("key"));
  if (!cronOk && !adminOk) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`whatsapp-followup:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const limitParam = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? "50") || 50, 1),
    200,
  );
  const dryRun = url.searchParams.get("dryRun") === "1";

  const result = await sendFollowUps({ limit: limitParam, dryRun });
  return NextResponse.json(result);
}
