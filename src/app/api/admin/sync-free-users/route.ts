import { NextResponse } from "next/server";
import { isAdminKey } from "@/lib/admin-auth";
import { syncFreeUsersToSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * POST/GET /api/admin/sync-free-users
 *
 * Owner-only "Sync now" button for the Google Sheet. Rewrites the complete
 * free-reader table; safe to click repeatedly.
 *
 * Auth: x-admin-key header or ?key= (same owner key as /admin/free-users).
 * Query: dryRun=1 builds the rows but does not call the Sheet webhook.
 */
async function run(req: Request) {
  const url = new URL(req.url);
  const adminOk =
    isAdminKey(req.headers.get("x-admin-key")) || isAdminKey(url.searchParams.get("key"));
  if (!adminOk) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dryRun = url.searchParams.get("dryRun") === "1";
  const result = await syncFreeUsersToSheet({ dryRun });

  return NextResponse.json(result, {
    status: result.ok ? 200 : result.configured ? 502 : 200,
  });
}

export async function GET(req: Request) {
  return run(req);
}

export async function POST(req: Request) {
  return run(req);
}
