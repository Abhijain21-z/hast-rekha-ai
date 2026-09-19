import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toProfileDTO } from "@/lib/dto";
import ProfilesManager from "@/components/dashboard/ProfilesManager";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const user = await requireUser();
  const rows = await db.select().from(birthProfiles).where(eq(birthProfiles.userId, user.id)).orderBy(desc(birthProfiles.createdAt));
  return <ProfilesManager initial={rows.map(toProfileDTO)} />;
}
