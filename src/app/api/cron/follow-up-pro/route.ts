import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST /api/cron/follow-up-pro
 *
 * Daily Pro-plan follow-up to free readers who opted into marketing.
 * Protected by CRON_SECRET (Vercel Cron sends it automatically).
 *
 * Vercel Cron config:
 *   Path: /api/cron/follow-up-pro
 *   Schedule: 0 9 * * * (09:00 UTC = 14:30 IST)
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hastrekhaai.online";
  const res = await fetch(`${baseUrl}/api/whatsapp/follow-up-pro?limit=100`, {
    method: "GET",
    headers: { "Cache-Control": "no-store", "x-cron-secret": secret },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
