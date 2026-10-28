import { count, desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles, readings } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toReadingSummary } from "@/lib/dto";
import { getTokenWallet } from "@/lib/tokens";
import { getMembership } from "@/lib/membership";
import { MEMBERSHIP_PROFILE_LIMIT, MEMBERSHIP_REPORT_LIMIT } from "@/lib/plans";
import Overview from "@/components/dashboard/Overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [[{ total }], [{ favs }], [{ profs }], recent] = await Promise.all([
    db.select({ total: count() }).from(readings).where(eq(readings.userId, user.id)),
    db.select({ favs: count() }).from(readings).where(and(eq(readings.userId, user.id), eq(readings.isFavorite, true))),
    db.select({ profs: count() }).from(birthProfiles).where(eq(birthProfiles.userId, user.id)),
    db.select().from(readings).where(eq(readings.userId, user.id)).orderBy(desc(readings.createdAt)).limit(4),
  ]);

  const wallet = await getTokenWallet(user.id);
  const membership = await getMembership(user.id);

  return (
    <Overview
      userName={user.name}
      memberSince={user.createdAt.toISOString()}
      stats={{ readings: total, favorites: favs, profiles: profs }}
      recent={recent.map(toReadingSummary)}
      wallet={{ balance: wallet.balance, ledger: wallet.ledger }}
      membership={{
        active: membership.active,
        daysLeft: membership.daysLeft,
        reportsUsed: membership.reportsUsed,
        reportsLeft: membership.reportsLeft,
        reportLimit: MEMBERSHIP_REPORT_LIMIT,
        profileLimit: MEMBERSHIP_PROFILE_LIMIT,
        until: membership.until ? membership.until.toISOString() : null,
      }}
    />
  );
}
