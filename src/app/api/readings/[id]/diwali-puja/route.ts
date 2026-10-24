import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { DIWALI_PUJA_PDF_URL } from "@/lib/diwali-pdf-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Hands out the Diwali Puja PDF link only to a reading that bought Pro (or
 * Ultra Pro). The Drive URL is server-only, so it never sits in the client
 * bundle and a shared report cannot reveal it.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [row] = await db
      .select({ premium: readings.premium })
      .from(readings)
      .where(eq(readings.id, id))
      .limit(1);

    if (!row || !row.premium) {
      return NextResponse.json({ error: "Locked" }, { status: 403, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json(
      { url: DIWALI_PUJA_PDF_URL },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Could not load link" }, { status: 500 });
  }
}
