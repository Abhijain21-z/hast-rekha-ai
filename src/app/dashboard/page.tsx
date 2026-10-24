import { count, desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { birthProfiles, readings, referrals } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toReadingSummary } from "@/lib/dto";
import { ensureReferralCode, getTokenWallet, referralLink } from "@/lib/tokens";
import Overview from "@/components/dashboard/Overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [[{ total }], [{ favs }], [{ profs }], [{ referred }], recent, code] = await Promise.all([
    db.select({ total: count() }).from(readings).where(eq(readings.userId, user.id)),
    db.select({ favs: count() }).from(readings).where(and(eq(readings.userId, user.id), eq(readings.isFavorite, true))),
    db.select({ profs: count() }).from(birthProfiles).where(eq(birthProfiles.userId, user.id)),
    db.select({ referred: count() }).from(referrals).where(eq(referrals.referrerId, user.id)),
    db.select().from(readings).where(eq(readings.userId, user.id)).orderBy(desc(readings.createdAt)).limit(4),
    ensureReferralCode(user.id),
  ]);

  const wallet = await getTokenWallet(user.id);

  return (
    <Overview
      userName={user.name}
      memberSince={user.createdAt.toISOString()}
      stats={{ readings: total, favorites: favs, profiles: profs }}
      recent={recent.map(toReadingSummary)}
      wallet={{
        balance: wallet.balance,
        ledger: wallet.ledger,
        referralCode: code,
        referralLink: code ? referralLink(code) : null,
        referralCount: referred,
      }}
    />
  );
}
