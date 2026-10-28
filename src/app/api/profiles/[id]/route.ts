import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toProfileDTO } from "@/lib/dto";
import { validateProfile } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const v = validateProfile(body);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: 400 });

  const [existing] = await db
    .select({ consentAt: birthProfiles.consentAt })
    .from(birthProfiles)
    .where(and(eq(birthProfiles.id, id), eq(birthProfiles.userId, user.id)))
    .limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Profiles saved before consent tracking need one confirmation; after that
  // the original consent timestamp is kept.
  if (!existing.consentAt && body.consent !== true) {
    return NextResponse.json(
      { error: "Consent is required", code: "consent_required" },
      { status: 400 },
    );
  }

  const [row] = await db
    .update(birthProfiles)
    .set({
      ...v.data,
      ...(existing.consentAt ? {} : { consentAt: new Date() }),
      updatedAt: new Date(),
    })
    .where(and(eq(birthProfiles.id, id), eq(birthProfiles.userId, user.id)))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ profile: toProfileDTO(row) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db.delete(birthProfiles).where(and(eq(birthProfiles.id, id), eq(birthProfiles.userId, user.id))).returning({ id: birthProfiles.id });
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
