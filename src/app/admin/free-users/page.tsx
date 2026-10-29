import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { isAdminKey } from "@/lib/admin-auth";
import OutreachTable, { type FreeReader } from "./OutreachTable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Free readers — WhatsApp outreach",
  robots: { index: false, follow: false },
};

/**
 * Owner-only outreach list.
 *
 * Shows every reader who has NOT bought Pro, newest first, with a one-tap
 * WhatsApp button that opens the plan message pre-filled. No Meta template is
 * needed for this path, so it works today; the automated sender is separate.
 *
 *   /admin/free-users?key=<REVIEWS_ADMIN_KEY>
 */
export default async function FreeUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string | string[] }>;
}) {
  const params = await searchParams;
  const key = Array.isArray(params.key) ? params.key[0] : params.key;

  if (!isAdminKey(key)) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl text-gold-200">Not found</h1>
        <p className="mt-3 text-sm text-slate-400">
          यह पेज निजी है। सही लिंक से खोलें।
        </p>
      </main>
    );
  }

  const rows = await db
    .select({
      id: readings.id,
      fullName: readings.fullName,
      whatsappPhone: readings.whatsappPhone,
      marketingOptIn: readings.marketingOptIn,
      followupSentAt: readings.followupSentAt,
      createdAt: readings.createdAt,
    })
    .from(readings)
    .orderBy(desc(readings.createdAt))
    .limit(3000);

  // One row per phone number: the newest reading wins, so the same person is
  // never messaged three times for three readings.
  const byPhone = new Map<string, FreeReader>();
  for (const row of rows) {
    const phone = (row.whatsappPhone ?? "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phone)) continue;
    if (byPhone.has(phone)) continue;
    byPhone.set(phone, {
      id: row.id,
      name: row.fullName,
      phone,
      createdAt: row.createdAt ? row.createdAt.toISOString() : null,
      marketingOptIn: row.marketingOptIn,
      followupSentAt: row.followupSentAt ? row.followupSentAt.toISOString() : null,
    });
  }

  const readers = [...byPhone.values()];

  return <OutreachTable readers={readers} adminKey={key ?? ""} />;
}
