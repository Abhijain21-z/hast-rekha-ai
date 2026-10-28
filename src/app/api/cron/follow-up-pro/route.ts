import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST /api/cron/follow-up-pro
 *
 * Cron endpoint to send daily Pro follow-up messages to free readers.
 * Protect with CRON_SECRET header.
 *
 * Add to Vercel Cron:
 *   Path: /api/cron/follow-up-pro
 *   Schedule: 0 9 * * * (every day at 9:00 AM UTC)
 */
export async function POST(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Forward to the follow-up API with a reasonable limit
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hastrekhaai.online";
  const res = await fetch(`${baseUrl}/api/whatsapp/follow-up-pro?limit=100`, {
    method: "GET",
    headers: { "Cache-Control": "no-store" },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
