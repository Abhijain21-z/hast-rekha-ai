import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, hashPassword, toSafeUser, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { name?: string; preferredLang?: string; currentPassword?: string; newPassword?: string };

  const patch: Partial<typeof users.$inferInsert> = {};
  if (typeof body.name === "string" && body.name.trim().length >= 2) patch.name = body.name.trim().slice(0, 80);
  if (body.preferredLang === "en" || body.preferredLang === "hi") patch.preferredLang = body.preferredLang;

  if (body.newPassword) {
    if (body.newPassword.length < 6) return NextResponse.json({ error: "short_password" }, { status: 400 });
    const [full] = await db.select().from(users).where(eq(users.id, me.id)).limit(1);
    if (!full || !(await verifyPassword(body.currentPassword ?? "", full.passwordHash))) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    patch.passwordHash = await hashPassword(body.newPassword);
  }

  if (!Object.keys(patch).length) return NextResponse.json({ user: me });
  const [updated] = await db.update(users).set(patch).where(eq(users.id, me.id)).returning();
  return NextResponse.json({ user: toSafeUser(updated) });
}
