/**
 * Membership helpers. Server-only: imports the database.
 *
 * A membership is a 30-day pass. It is active while `users.membership_until`
 * is in the future. Buying again extends the pass from the later of now and
 * the current expiry, so nobody loses paid days.
 */
import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { readings, users } from "@/db/schema";
import { MEMBERSHIP_DAYS, MEMBERSHIP_REPORT_LIMIT } from "./plans";

export { MEMBERSHIP_DAYS, MEMBERSHIP_REPORT_LIMIT } from "./plans";

export interface MembershipStatus {
  active: boolean;
  until: Date | null;
  daysLeft: number;
  reportsUsed: number;
  reportsLeft: number;
}

/** Extend a pass by `days`, starting from the current expiry if it is later. */
export function extendMembership(current: Date | null, days = MEMBERSHIP_DAYS, now = new Date()): Date {
  const base = current && current.getTime() > now.getTime() ? current : now;
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export function membershipDaysLeft(until: Date | null, now = new Date()): number {
  if (!until || until.getTime() <= now.getTime()) return 0;
  return Math.ceil((until.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * Read the membership and the fair-use counter.
 *
 * `reportsUsed` counts Pro reports unlocked in the rolling 30-day window
 * (`premium = true` with `premiumAt` inside the window) — not every reading.
 * A member who made free readings before joining does not start with the cap
 * already partly consumed. Separately bought Pro reports do count, because the
 * promise is 30 Pro reports per 30 days, however they were unlocked.
 */
export async function getMembership(userId: string, now = new Date()): Promise<MembershipStatus> {
  const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [[row], [{ used }]] = await Promise.all([
    db.select({ until: users.membershipUntil }).from(users).where(eq(users.id, userId)).limit(1),
    db
      .select({ used: count() })
      .from(readings)
      .where(
        and(
          eq(readings.userId, userId),
          eq(readings.premium, true),
          gte(readings.premiumAt, windowStart),
        ),
      ),
  ]);

  const until = row?.until ?? null;
  const active = !!until && until.getTime() > now.getTime();
  const reportsUsed = Number(used ?? 0);
  return {
    active,
    until,
    daysLeft: membershipDaysLeft(until, now),
    reportsUsed,
    reportsLeft: active ? Math.max(0, MEMBERSHIP_REPORT_LIMIT - reportsUsed) : 0,
  };
}

/** True when a new reading should be auto-unlocked as a member benefit. */
export async function membershipCanUnlockReport(userId: string, now = new Date()): Promise<boolean> {
  const status = await getMembership(userId, now);
  return status.active && status.reportsLeft > 0;
}
