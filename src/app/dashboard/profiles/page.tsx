import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toProfileDTO } from "@/lib/dto";
import { getMembership } from "@/lib/membership";
import { FREE_PROFILE_LIMIT, MEMBERSHIP_PROFILE_LIMIT } from "@/lib/plans";
import ProfilesManager from "@/components/dashboard/ProfilesManager";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const user = await requireUser();
  const [rows, membership] = await Promise.all([
    db.select().from(birthProfiles).where(eq(birthProfiles.userId, user.id)).orderBy(desc(birthProfiles.createdAt)),
    getMembership(user.id),
  ]);
  const limit = membership.active ? MEMBERSHIP_PROFILE_LIMIT : FREE_PROFILE_LIMIT;
  return <ProfilesManager initial={rows.map(toProfileDTO)} limit={limit} membershipActive={membership.active} />;
}
