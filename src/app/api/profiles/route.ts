import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toProfileDTO } from "@/lib/dto";
import { validateProfile } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(birthProfiles).where(eq(birthProfiles.userId, user.id)).orderBy(desc(birthProfiles.createdAt));
  return NextResponse.json({ profiles: rows.map(toProfileDTO) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const v = validateProfile(body);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: 400 });
  const [row] = await db.insert(birthProfiles).values({ ...v.data, userId: user.id }).returning();
  return NextResponse.json({ profile: toProfileDTO(row) }, { status: 201 });
}
