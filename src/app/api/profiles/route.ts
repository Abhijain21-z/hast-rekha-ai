import { NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toProfileDTO } from "@/lib/dto";
import { validateProfile } from "@/lib/validation";
import { getMembership } from "@/lib/membership";
import { FREE_PROFILE_LIMIT, MEMBERSHIP_PROFILE_LIMIT } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(birthProfiles).where(eq(birthProfiles.userId, user.id)).orderBy(desc(birthProfiles.createdAt));
  return NextResponse.json({ profiles: rows.map(toProfileDTO) });
}

/**
 * Save a birth profile. The account holder must confirm they have permission
 * to store that person's details, and the count is capped by plan: 2 for free
 * accounts, 5 while a membership pass is active.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const v = validateProfile(body);
  if ("error" in v) return NextResponse.json({ error: v.error }, { status: 400 });
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Consent is required", code: "consent_required" },
      { status: 400 },
    );
  }

  const membership = await getMembership(user.id);
  const limit = membership.active ? MEMBERSHIP_PROFILE_LIMIT : FREE_PROFILE_LIMIT;
  const [{ total }] = await db
    .select({ total: count() })
    .from(birthProfiles)
    .where(eq(birthProfiles.userId, user.id));

  if (Number(total) >= limit) {
    return NextResponse.json(
      {
        error: "Profile limit reached",
        code: "profile_limit",
        limit,
        membershipActive: membership.active,
      },
      { status: 403 },
    );
  }

  const [row] = await db
    .insert(birthProfiles)
    .values({ ...v.data, userId: user.id, consentAt: new Date() })
    .returning();
  return NextResponse.json({ profile: toProfileDTO(row) }, { status: 201 });
}
