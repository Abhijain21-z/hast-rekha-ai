import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Hands out the Ultra Pro book link, but only to a reading that actually bought
 * Ultra Pro. The URL itself lives in the server-only `ULTRA_BOOK_URL`
 * environment variable, so it is never part of the client bundle — a plain
 * "view source" on someone else's report cannot reveal it.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [row] = await db
      .select({ premium: readings.premium, ultra: readings.ultra })
      .from(readings)
      .where(eq(readings.id, id))
      .limit(1);

    if (!row || !row.premium || !row.ultra) {
      return NextResponse.json({ error: "Locked" }, { status: 403 });
    }

    const url = process.env.ULTRA_BOOK_URL?.trim();
    return NextResponse.json({ url: url ? url : null });
  } catch {
    // Missing column / database hiccup: the card falls back to its note.
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
