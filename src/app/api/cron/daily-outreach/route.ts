import { NextResponse } from "next/server";
import { syncFreeUsersToSheet } from "@/lib/google-sheets";
import { sendFollowUps } from "@/lib/outreach-sender";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Daily 9:00 AM IST outreach cron (03:30 UTC).
 *
 * 1. Rewrites the owner's Google Sheet with the current free-reader table.
 * 2. Sends the approved `pro_followup` WhatsApp template to the next eligible
 *    batch of free readers.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 * Manual: `?key=<owner key>` or `x-cron-secret`.
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (secret) {
    if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
    if (req.headers.get("x-cron-secret") === secret) return true;
  }
  return false;
}

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? "100") || 100, 1),
    200,
  );

  const sheet = await syncFreeUsersToSheet({ dryRun }).catch((error) => ({
    ok: false,
    configured: false,
    dryRun,
    rowCount: 0,
    totalReadings: 0,
    skippedPaid: 0,
    syncedAt: new Date().toISOString(),
    sheetUrl: "",
    error: error instanceof Error ? error.message : String(error),
  }));

  // Safety switch: the daily cron syncs the sheet immediately, but it will not
  // message real readers until the owner has tested the template and set
  // OUTREACH_LIVE=true in Vercel. Manual admin sends are still possible.
  const live = process.env.OUTREACH_LIVE === "true";
  const whatsapp = !live && !dryRun
    ? {
        total: 0,
        sent: 0,
        errors: 0,
        skipped: 0,
        dryRun,
        error: "OUTREACH_LIVE is not true — WhatsApp send skipped",
      }
    : await sendFollowUps({ limit, dryRun }).catch((error) => ({
        total: 0,
        sent: 0,
        errors: 0,
        skipped: 0,
        dryRun,
        error: error instanceof Error ? error.message : String(error),
      }));

  // A missing Sheet webhook is a warning, not a reason to fail the cron: the
  // WhatsApp batch can still run while the owner finishes the sheet setup.
  const ok = whatsapp.errors === 0 && (sheet.ok || !sheet.configured);

  return NextResponse.json(
    { ok, dryRun, live, sheet, whatsapp },
    { status: ok ? 200 : 502 },
  );
}

export async function GET(req: Request) {
  return run(req);
}

export async function POST(req: Request) {
  return run(req);
}
