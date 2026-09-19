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
  const [row] = await db
    .update(birthProfiles)
    .set({ ...v.data, updatedAt: new Date() })
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
