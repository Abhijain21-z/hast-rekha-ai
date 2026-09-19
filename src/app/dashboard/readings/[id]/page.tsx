import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toReadingDTO } from "@/lib/dto";
import ReadingResult from "@/components/reading/ReadingResult";
import ReadingEditor from "@/components/dashboard/ReadingEditor";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function DashboardReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const user = await requireUser(`/dashboard/readings/${id}`);
  const [row] = await db.select().from(readings).where(and(eq(readings.id, id), eq(readings.userId, user.id))).limit(1);
  if (!row) notFound();
  const dto = toReadingDTO(row);
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-10">
      <ReadingEditor key={dto.updatedAt} reading={dto} />
      <ReadingResult reading={dto} backHref="/dashboard/readings" />
    </div>
  );
}
