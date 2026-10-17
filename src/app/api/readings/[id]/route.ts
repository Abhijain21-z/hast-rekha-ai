import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toReadingDTO } from "@/lib/dto";
import { PRO_PAY_MODE } from "@/lib/flags";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const [row] = await db.select().from(readings).where(eq(readings.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reading: toReadingDTO(row) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    notes?: string | null;
    isFavorite?: boolean;
    palmImage?: string | null;
    palmHand?: string | null;
    premiumUtr?: string;
    /** Which plan the UPI reference was paid for. Defaults to Pro (₹51). */
    plan?: "pro" | "ultra";
  };

  // Premium activation by UPI reference — available to the reading owner and to guests
  // who hold the reading link (the id is an unguessable UUID).
  if (typeof body.premiumUtr === "string" && /^\d{8,20}$/.test(body.premiumUtr.trim())) {
    // Payments closed (₹51 Pro / ₹351 Ultra are still being set up): nothing may
    // unlock, so the Ultra book can never be handed out for free by a hand-made
    // request that skips the paywall UI.
    if (PRO_PAY_MODE !== "upi") {
      return NextResponse.json({ error: "Payments are not open yet" }, { status: 403 });
    }

    const utr = body.premiumUtr.trim();
    // One UPI reference = one payment = one reading. Stops a single ₹351 payment
    // (or a reference passed around) from unlocking the book on many readings.
    const [used] = await db
      .select({ id: readings.id })
      .from(readings)
      .where(and(eq(readings.premiumUtr, utr), ne(readings.id, id)))
      .limit(1);
    if (used) return NextResponse.json({ error: "This UPI reference was already used" }, { status: 409 });

    const [row] = await db
      .update(readings)
      .set({
        premium: true,
        // Never downgrade an Ultra (₹351) unlock back to Pro.
        ...(body.plan === "ultra" ? { ultra: true } : {}),
        premiumUtr: utr,
        premiumAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(readings.id, id))
      .returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ reading: toReadingDTO(row) });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patch: Partial<typeof readings.$inferInsert> = { updatedAt: new Date() };
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim().slice(0, 120);
  if (body.notes !== undefined) patch.notes = body.notes ? String(body.notes).slice(0, 5000) : null;
  if (typeof body.isFavorite === "boolean") patch.isFavorite = body.isFavorite;
  if (body.palmImage !== undefined) {
    patch.palmImage = typeof body.palmImage === "string" && body.palmImage.startsWith("data:image/") && body.palmImage.length < 2_500_000 ? body.palmImage : null;
    if (!patch.palmImage) patch.palmHand = null;
  }
  if (body.palmHand === "left" || body.palmHand === "right") patch.palmHand = body.palmHand;

  const [row] = await db
    .update(readings)
    .set(patch)
    .where(and(eq(readings.id, id), eq(readings.userId, user.id)))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reading: toReadingDTO(row) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db.delete(readings).where(and(eq(readings.id, id), eq(readings.userId, user.id))).returning({ id: readings.id });
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
