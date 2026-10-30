import type { Metadata } from "next";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { payments, readings, users } from "@/db/schema";
import { isAdminKey } from "@/lib/admin-auth";
import { getGoogleSheetsConfig, getLastSheetSync } from "@/lib/google-sheets";
import { toIndiaTenDigits } from "@/lib/whatsapp";
import OutreachAutomation from "./OutreachAutomation";
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

  const [rows, paidRows, memberRows] = await Promise.all([
    db
      .select({
        id: readings.id,
        userId: readings.userId,
        fullName: readings.fullName,
        whatsappPhone: readings.whatsappPhone,
        marketingOptIn: readings.marketingOptIn,
        followupSentAt: readings.followupSentAt,
        createdAt: readings.createdAt,
      })
      .from(readings)
      .where(and(eq(readings.premium, false), eq(readings.ultra, false)))
      .orderBy(desc(readings.createdAt))
      .limit(3000),
    db
      .select({ phone: payments.customerPhone })
      .from(payments)
      .where(eq(payments.status, "paid")),
    db
      .select({ id: users.id })
      .from(users)
      .where(sql`${users.membershipUntil} > now()`),
  ]);

  const paidPhones = new Set<string>();
  for (const row of paidRows) {
    const phone = toIndiaTenDigits(row.phone);
    if (phone) paidPhones.add(phone);
  }
  const memberIds = new Set(memberRows.map((row) => row.id));

  // One row per phone number: the newest reading wins, so the same person is
  // never messaged three times for three readings. Paid readers and active
  // members are excluded even if they also took a free reading.
  const byPhone = new Map<string, FreeReader>();
  for (const row of rows) {
    const phone = toIndiaTenDigits(row.whatsappPhone);
    if (!phone) continue;
    if (paidPhones.has(phone)) continue;
    if (row.userId && memberIds.has(row.userId)) continue;
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
  const sheetConfig = getGoogleSheetsConfig();
  const lastSync = await getLastSheetSync();

  const stats = {
    total: readers.length,
    optedIn: readers.filter((r) => r.marketingOptIn).length,
    sent: readers.filter((r) => r.followupSentAt).length,
    pending: readers.filter((r) => r.marketingOptIn && !r.followupSentAt).length,
  };

  const automation = (
    <OutreachAutomation
      adminKey={key ?? ""}
      stats={stats}
      lastSync={lastSync}
      sheetUrl={sheetConfig.sheetUrl}
      sheetConfigured={sheetConfig.configured}
    />
  );

  return <OutreachTable readers={readers} adminKey={key ?? ""} automation={automation} />;
}
