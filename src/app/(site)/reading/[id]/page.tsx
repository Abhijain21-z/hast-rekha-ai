import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toReadingDTO } from "@/lib/dto";
import ReadingResult from "@/components/reading/ReadingResult";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PublicReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [row] = await db.select().from(readings).where(eq(readings.id, id)).limit(1);
  if (!row) notFound();
  const user = await getCurrentUser();
  const isOwner = !!user && row.userId === user.id;
  return <ReadingResult reading={toReadingDTO(row)} guest={!user} backHref={isOwner ? `/dashboard/readings/${row.id}` : undefined} />;
}
