/**
 * Server-side coin billing for the AI Panditji chat.
 *
 * The wallet and the session row move together inside one transaction, so two
 * simultaneous messages cannot double-charge or overspend. A provider failure
 * refunds the newly billed minutes and rewinds the session counter.
 */
import { and, eq, or } from "drizzle-orm";
import { db, pool } from "@/db";
import { chatSessions, chatUsage, readings, users } from "@/db/schema";
import type { ChatPlan } from "./chat-quota-rules";
import {
  CHAT_COINS_PER_MINUTE,
  CHAT_GUEST_COINS,
  CHAT_PRO_INCLUDED_MINUTES,
  isChatSessionActive,
  planChatMinutes,
  type ChatBillingSummary,
} from "./chat-billing-rules";

/**
 * A reader is Pro for chat if the open reading is Pro/Ultra, or if their
 * account has unlocked any Pro/Ultra report before. A guest with a Pro reading
 * link therefore gets the 50 included minutes for that report.
 */
export async function resolveChatPlan(
  userId: string | null,
  reading: { premium: boolean; ultra: boolean } | null,
): Promise<ChatPlan> {
  if (reading?.premium || reading?.ultra) return "pro";
  if (!userId) return "free";

  try {
    const [row] = await db
      .select({ id: readings.id })
      .from(readings)
      .where(
        and(
          eq(readings.userId, userId),
          or(eq(readings.premium, true), eq(readings.ultra, true)),
        ),
      )
      .limit(1);
    return row ? "pro" : "free";
  } catch (error) {
    // A billing-read failure must not make a paid reader look free.
    console.error(
      "[chat] could not resolve Pro entitlement:",
      error instanceof Error ? error.message : "unknown",
    );
    return "free";
  }
}

async function ensureGuestWallet(subject: string): Promise<number> {
  const result = await pool.query<{ balance: number }>(
    `INSERT INTO chat_wallets (subject, balance)
     VALUES ($1, $2)
     ON CONFLICT (subject) DO UPDATE SET updated_at = chat_wallets.updated_at
     RETURNING balance`,
    [subject, CHAT_GUEST_COINS],
  );
  return result.rows[0]?.balance ?? 0;
}

async function readCoins(userId: string | null, subject: string): Promise<number> {
  if (userId) {
    const [row] = await db
      .select({ balance: users.tokenBalance })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return Math.max(0, row?.balance ?? 0);
  }
  return Math.max(0, await ensureGuestWallet(subject));
}

export async function getChatBilling(
  subject: string,
  plan: ChatPlan,
  userId: string | null,
): Promise<ChatBillingSummary> {
  const [coins, usageRows, sessionRows] = await Promise.all([
    readCoins(userId, subject),
    plan === "pro"
      ? db
          .select({ used: chatUsage.used })
          .from(chatUsage)
          .where(and(eq(chatUsage.subject, subject), eq(chatUsage.plan, "pro")))
          .limit(1)
      : Promise.resolve([]),
    db
      .select({
        startedAt: chatSessions.startedAt,
        lastSeenAt: chatSessions.lastSeenAt,
        billedMinutes: chatSessions.billedMinutes,
      })
      .from(chatSessions)
      .where(eq(chatSessions.subject, subject))
      .limit(1),
  ]);

  const includedMinutesUsed =
    plan === "pro"
      ? Math.min(Math.max(0, usageRows[0]?.used ?? 0), CHAT_PRO_INCLUDED_MINUTES)
      : null;
  const session = sessionRows[0] ?? null;

  return {
    plan,
    signedIn: Boolean(userId),
    coins,
    coinsPerMinute: CHAT_COINS_PER_MINUTE,
    includedMinutesLimit: plan === "pro" ? CHAT_PRO_INCLUDED_MINUTES : null,
    includedMinutesUsed,
    includedMinutesLeft:
      includedMinutesUsed === null
        ? null
        : Math.max(0, CHAT_PRO_INCLUDED_MINUTES - includedMinutesUsed),
    sessionStartedAt: session?.startedAt.toISOString() ?? null,
    sessionLastSeenAt: session?.lastSeenAt.toISOString() ?? null,
    sessionBilledMinutes: Math.max(0, session?.billedMinutes ?? 0),
    sessionActive: session ? isChatSessionActive(session.lastSeenAt.toISOString()) : false,
  };
}

export interface ChatCharge {
  subject: string;
  userId: string | null;
  plan: ChatPlan;
  newMinutes: number;
  includedMinutes: number;
  coinCost: number;
  sessionReset: boolean;
}

export type ChatChargeResult =
  | { ok: true; billing: ChatBillingSummary; charge: ChatCharge }
  | { ok: false; billing: ChatBillingSummary; coinsNeeded: number };

/**
 * Reserve the minutes this message consumes.
 *
 * - A new/expired session bills its first started minute up front.
 * - Pro minutes are used before coins.
 * - When the next minute cannot be paid for, nothing is charged and the caller
 *   returns 402 with the refreshed balance.
 */
export async function billChatTime(input: {
  subject: string;
  userId: string | null;
  plan: ChatPlan;
}): Promise<ChatChargeResult> {
  const { subject, userId, plan } = input;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO chat_sessions (subject) VALUES ($1)
       ON CONFLICT (subject) DO NOTHING`,
      [subject],
    );

    if (plan === "pro") {
      await client.query(
        `INSERT INTO chat_usage (subject, plan, used) VALUES ($1, 'pro', 0)
         ON CONFLICT (subject, plan) DO NOTHING`,
        [subject],
      );
    }

    const sessionResult = await client.query<{
      started_at: Date;
      last_seen_at: Date;
      billed_minutes: number;
    }>(
      `SELECT started_at, last_seen_at, billed_minutes
       FROM chat_sessions WHERE subject = $1 FOR UPDATE`,
      [subject],
    );
    const session = sessionResult.rows[0];
    if (!session) throw new Error("chat session row disappeared");

    const now = Date.now();
    const timing = planChatMinutes({
      startedAt: session.started_at.getTime(),
      lastSeenAt: session.last_seen_at.getTime(),
      billedMinutes: session.billed_minutes,
      now,
    });

    let includedLeft = 0;
    if (plan === "pro") {
      const usageResult = await client.query<{ used: number }>(
        `SELECT used FROM chat_usage
         WHERE subject = $1 AND plan = 'pro' FOR UPDATE`,
        [subject],
      );
      const used = usageResult.rows[0]?.used ?? 0;
      includedLeft = Math.max(0, CHAT_PRO_INCLUDED_MINUTES - used);
    }

    const includedMinutes = Math.min(timing.newMinutes, includedLeft);
    const coinMinutes = timing.newMinutes - includedMinutes;
    const coinCost = coinMinutes * CHAT_COINS_PER_MINUTE;

    let coins: number;
    if (userId) {
      const wallet = await client.query<{ token_balance: number }>(
        `SELECT token_balance FROM users WHERE id = $1 FOR UPDATE`,
        [userId],
      );
      coins = Math.max(0, wallet.rows[0]?.token_balance ?? 0);
      if (coins < coinCost) {
        await client.query("ROLLBACK");
        return {
          ok: false,
          coinsNeeded: coinCost - coins,
          billing: await getChatBilling(subject, plan, userId),
        };
      }

      if (coinCost > 0) {
        const updated = await client.query<{ token_balance: number }>(
          `UPDATE users SET token_balance = token_balance - $2
           WHERE id = $1 RETURNING token_balance`,
          [userId, coinCost],
        );
        const balanceAfter = updated.rows[0]?.token_balance;
        if (balanceAfter === undefined) throw new Error("coin wallet update returned no row");
        await client.query(
          `INSERT INTO token_ledger (user_id, delta, reason, balance_after, metadata)
           VALUES ($1, $2, 'chat_time', $3, $4)`,
          [
            userId,
            -coinCost,
            balanceAfter,
            JSON.stringify({ minutes: coinMinutes, includedMinutes, plan }),
          ],
        );
      }
    } else {
      await client.query(
        `INSERT INTO chat_wallets (subject, balance) VALUES ($1, $2)
         ON CONFLICT (subject) DO NOTHING`,
        [subject, CHAT_GUEST_COINS],
      );
      const wallet = await client.query<{ balance: number }>(
        `SELECT balance FROM chat_wallets WHERE subject = $1 FOR UPDATE`,
        [subject],
      );
      coins = Math.max(0, wallet.rows[0]?.balance ?? 0);
      if (coins < coinCost) {
        await client.query("ROLLBACK");
        return {
          ok: false,
          coinsNeeded: coinCost - coins,
          billing: await getChatBilling(subject, plan, userId),
        };
      }

      if (coinCost > 0) {
        await client.query(
          `UPDATE chat_wallets
           SET balance = balance - $2, updated_at = now()
           WHERE subject = $1`,
          [subject, coinCost],
        );
      }
    }

    if (includedMinutes > 0) {
      await client.query(
        `UPDATE chat_usage
         SET used = used + $2, updated_at = now()
         WHERE subject = $1 AND plan = 'pro'`,
        [subject, includedMinutes],
      );
    }

    if (timing.reset) {
      await client.query(
        `UPDATE chat_sessions
         SET started_at = now(), last_seen_at = now(),
             billed_minutes = $2, updated_at = now()
         WHERE subject = $1`,
        [subject, timing.minutesDue],
      );
    } else {
      await client.query(
        `UPDATE chat_sessions
         SET last_seen_at = now(), billed_minutes = $2, updated_at = now()
         WHERE subject = $1`,
        [subject, timing.minutesDue],
      );
    }

    await client.query("COMMIT");

    return {
      ok: true,
      billing: await getChatBilling(subject, plan, userId),
      charge: {
        subject,
        userId,
        plan,
        newMinutes: timing.newMinutes,
        includedMinutes,
        coinCost,
        sessionReset: timing.reset,
      },
    };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* the connection may already be gone */
    }
    throw error;
  } finally {
    client.release();
  }
}

/** Undo a reservation when the AI provider fails before answering. */
export async function refundChatTime(charge: ChatCharge): Promise<void> {
  if (charge.newMinutes <= 0 && charge.coinCost <= 0 && charge.includedMinutes <= 0) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (charge.includedMinutes > 0) {
      await client.query(
        `UPDATE chat_usage
         SET used = GREATEST(used - $2, 0), updated_at = now()
         WHERE subject = $1 AND plan = 'pro'`,
        [charge.subject, charge.includedMinutes],
      );
    }

    if (charge.coinCost > 0) {
      if (charge.userId) {
        const updated = await client.query<{ token_balance: number }>(
          `UPDATE users SET token_balance = token_balance + $2
           WHERE id = $1 RETURNING token_balance`,
          [charge.userId, charge.coinCost],
        );
        const balanceAfter = updated.rows[0]?.token_balance;
        if (balanceAfter !== undefined) {
          await client.query(
            `INSERT INTO token_ledger (user_id, delta, reason, balance_after, metadata)
             VALUES ($1, $2, 'chat_refund', $3, $4)`,
            [
              charge.userId,
              charge.coinCost,
              balanceAfter,
              JSON.stringify({ minutes: charge.newMinutes, refund: true }),
            ],
          );
        }
      } else {
        await client.query(
          `UPDATE chat_wallets
           SET balance = balance + $2, updated_at = now()
           WHERE subject = $1`,
          [charge.subject, charge.coinCost],
        );
      }
    }

    await client.query(
      `UPDATE chat_sessions
       SET billed_minutes = GREATEST(billed_minutes - $2, 0),
           last_seen_at = now(), updated_at = now()
       WHERE subject = $1`,
      [charge.subject, charge.newMinutes],
    );

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* the connection may already be gone */
    }
    throw error;
  } finally {
    client.release();
  }
}
