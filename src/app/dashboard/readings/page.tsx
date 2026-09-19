import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toReadingSummary } from "@/lib/dto";
import ReadingsManager from "@/components/dashboard/ReadingsManager";

export const dynamic = "force-dynamic";

export default async function ReadingsPage() {
  const user = await requireUser();
  const rows = await db.select().from(readings).where(eq(readings.userId, user.id)).orderBy(desc(readings.createdAt));
  return <ReadingsManager initial={rows.map(toReadingSummary)} />;
}
