import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviewArchive } from "@/db/schema";
import { archiveExpiredNegativeReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Owner-only view of negative reviews that have left the public site.
 * Not linked from any page. Requires the x-admin-key header matching
 * REVIEWS_ADMIN_KEY, so the archive is never exposed accidentally.
 */
function isAuthorized(req: Request) {
  const expected = process.env.REVIEWS_ADMIN_KEY;
  const provided = req.headers.get("x-admin-key") ?? "";
  if (!expected || !provided || provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    // 404 rather than 401: the route should not advertise itself.
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await archiveExpiredNegativeReviews().catch(() => {});
  const requested = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Number.isFinite(requested) ? Math.min(500, Math.max(1, Math.trunc(requested))) : 200;
  const rows = await db.select().from(reviewArchive).orderBy(desc(reviewArchive.createdAt)).limit(limit);
  return NextResponse.json({ count: rows.length, reviews: rows });
}
