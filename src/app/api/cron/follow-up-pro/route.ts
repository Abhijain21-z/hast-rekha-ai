import { NextResponse } from "next/server";
import { sendFollowUps } from "@/lib/outreach-sender";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST/GET /api/cron/follow-up-pro
 *
 * Legacy dedicated follow-up cron. The combined daily cron is
 * `/api/cron/daily-outreach` (sheet sync + WhatsApp). This route stays for
 * manual runs and for anyone pointing an external scheduler at it.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; the x-cron-secret
 * header is also accepted for manual curl calls.
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return (
    req.headers.get("authorization") === `Bearer ${secret}` ||
    req.headers.get("x-cron-secret") === secret
  );
}

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? "100") || 100, 1),
    200,
  );
  const dryRun = url.searchParams.get("dryRun") === "1";

  const result = await sendFollowUps({ limit, dryRun });
  return NextResponse.json(result);
}

export async function GET(req: Request) {
  return run(req);
}

export async function POST(req: Request) {
  return run(req);
}
