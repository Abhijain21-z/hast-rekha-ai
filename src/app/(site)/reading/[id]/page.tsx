import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toReadingDTO } from "@/lib/dto";
import { getWhatsAppDailyStatus } from "@/lib/whatsapp-subscribers";
import ReadingResult from "@/components/reading/ReadingResult";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Per-request cache — generateMetadata and the page share a single SELECT. */
const loadReading = cache(async (id: string) => {
  const [row] = await db.select().from(readings).where(eq(readings.id, id)).limit(1);
  return row;
});

// The id is validated in generateMetadata too: metadata resolves before the
// shell streams, so a malformed or missing reading answers a proper 404
// instead of the 200 soft-404 the loading boundary would emit.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  if (!(await loadReading(id))) notFound();
  // A saved reading is personal, user-generated content. Keep it out of the
  // index so shared links never become thin/duplicate search results.
  return { robots: { index: false, follow: false } };
}

export default async function PublicReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const row = await loadReading(id);
  if (!row) notFound();
  const user = await getCurrentUser();
  const isOwner = !!user && row.userId === user.id;
  const whatsappDaily = await getWhatsAppDailyStatus(row.whatsappPhone);
  return (
    <ReadingResult
      reading={toReadingDTO(row)}
      guest={!user}
      backHref={isOwner ? `/dashboard/readings/${row.id}` : undefined}
      whatsappDaily={whatsappDaily}
    />
  );
}
