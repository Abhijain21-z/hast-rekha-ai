/**
 * Server-side coin billing for the AI Panditji chat.
 *
 * The wallet moves inside one transaction, so two simultaneous messages
 * cannot double-charge or overspend. A provider failure refunds the coins
 * and no charge is applied.
 *
 * Rules:
 *   - Every message costs CHAT_COINS_PER_MESSAGE coins (10 by default).
 *   - Pro messages are free up to CHAT_PRO_INCLUDED_MESSAGES (50 by default).
 *   - Coins are deducted only when the provider call succeeds.
 */
import { and, eq, or } from "drizzle-orm";
import { db, pool } from "@/db";
import { chatSessions, chatUsage, readings, users } from "@/db/schema";
import type { ChatPlan } from "./chat-quota-rules";
import {
  CHAT_COINS_PER_MESSAGE,
  CHAT_GUEST_COINS,
  CHAT_PRO_INCLUDED_MESSAGES,
  type ChatBillingSummary,
} from "./chat-billing-rules";

/**
 * A reader is Pro for chat if the open reading is Pro/Ultra, or if their
 * account has unlocked any Pro/Ultra report before. A guest with a Pro reading
 * link therefore gets the 50 included messages for that report.
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
        messagesSent: chatSessions.billedMinutes, // repurposed column: counts messages sent
      })
      .from(chatSessions)
      .where(eq(chatSessions.subject, subject))
      .limit(1),
  ]);

  const includedMessagesUsed =
    plan === "pro"
      ? Math.min(Math.max(0, usageRows[0]?.used ?? 0), CHAT_PRO_INCLUDED_MESSAGES)
      : null;
  const session = sessionRows[0] ?? null;

  return {
    plan,
    signedIn: Boolean(userId),
    coins,
    coinsPerMessage: CHAT_COINS_PER_MESSAGE,
    includedMessagesLimit: plan === "pro" ? CHAT_PRO_INCLUDED_MESSAGES : null,
    includedMessagesUsed,
    includedMessagesLeft:
      includedMessagesUsed === null
        ? null
        : Math.max(0, CHAT_PRO_INCLUDED_MESSAGES - includedMessagesUsed),
    messagesSent: Math.max(0, session?.messagesSent ?? 0),
  };
}

export interface ChatCharge {
  subject: string;
  userId: string | null;
  plan: ChatPlan;
  messagesSent: number;
  includedMessages: number;
  coinCost: number;
}

export type ChatChargeResult =
  | { ok: true; billing: ChatBillingSummary; charge: ChatCharge }
  | { ok: false; billing: ChatBillingSummary; coinsNeeded: number };

/**
 * Reserve coins for one message.
 *
 * - Pro included messages are used before coins.
 * - When the next message cannot be paid for, nothing is charged and the caller
 *   returns 402 with the refreshed balance.
 * - The charge is committed only after the provider call succeeds; on failure
 *   the caller must call refundChatTime to undo it.
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
      messages_sent: number;
    }>(
      `SELECT billed_minutes as messages_sent
       FROM chat_sessions WHERE subject = $1 FOR UPDATE`,
      [subject],
    );
    const session = sessionResult.rows[0];
    if (!session) throw new Error("chat session row disappeared");

    const alreadySent = Math.max(0, session.messages_sent ?? 0);

    let includedLeft = 0;
    if (plan === "pro") {
      const usageResult = await client.query<{ used: number }>(
        `SELECT used FROM chat_usage
         WHERE subject = $1 AND plan = 'pro' FOR UPDATE`,
        [subject],
      );
      const used = usageResult.rows[0]?.used ?? 0;
      includedLeft = Math.max(0, CHAT_PRO_INCLUDED_MESSAGES - used);
    }

    const includedMessages = Math.min(1, includedLeft);
    const coinMessages = 1 - includedMessages;
    const coinCost = coinMessages * CHAT_COINS_PER_MESSAGE;

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
            JSON.stringify({ messages: coinMessages, includedMessages, plan }),
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

    if (includedMessages > 0) {
      await client.query(
        `UPDATE chat_usage
         SET used = used + $2, updated_at = now()
         WHERE subject = $1 AND plan = 'pro'`,
        [subject, includedMessages],
      );
    }

    await client.query(
      `UPDATE chat_sessions
       SET billed_minutes = $2, updated_at = now()
       WHERE subject = $1`,
      [subject, alreadySent + 1],
    );

    await client.query("COMMIT");

    return {
      ok: true,
      billing: await getChatBilling(subject, plan, userId),
      charge: {
        subject,
        userId,
        plan,
        messagesSent: alreadySent + 1,
        includedMessages,
        coinCost,
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
  if (charge.messagesSent <= 0 && charge.coinCost <= 0 && charge.includedMessages <= 0) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (charge.includedMessages > 0) {
      await client.query(
        `UPDATE chat_usage
         SET used = GREATEST(used - $2, 0), updated_at = now()
         WHERE subject = $1 AND plan = 'pro'`,
        [charge.subject, charge.includedMessages],
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
              JSON.stringify({ messages: charge.messagesSent, refund: true }),
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
           updated_at = now()
       WHERE subject = $1`,
      [charge.subject, charge.messagesSent],
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
