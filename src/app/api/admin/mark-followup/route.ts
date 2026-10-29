import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { isAdminKey } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/mark-followup
 *
 * Records that the owner sent the Pro follow-up to one reader, so the outreach
 * list stops showing them under "बाकी". Owner-only via x-admin-key.
 */
export async function POST(req: Request) {
  if (!isAdminKey(req.headers.get("x-admin-key"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = (body.id ?? "").trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await db
    .update(readings)
    .set({ followupSentAt: new Date(), updatedAt: new Date() })
    .where(eq(readings.id, id));

  return NextResponse.json({ ok: true });
}
