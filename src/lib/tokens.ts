/**
 * Coin wallet.
 *
 * Product rules (owner-confirmed):
 *   - Every new account starts with 50 coins.
 *   - Chat with Panditji costs 10 coins per started minute; a Pro report
 *     includes 50 minutes before coins are used.
 *   - Coins are never accepted as payment for the ₹51 Pro report.
 *
 * The ledger is append-only and every mutation runs in a transaction with a
 * row lock, so two simultaneous chat minutes cannot spend the same balance.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tokenLedger, users } from "@/db/schema";

export { SIGNUP_TOKEN_BONUS } from "./token-rules";

export type TokenLedgerReason = "signup_bonus" | "chat_time" | "chat_refund" | "admin_adjustment";

export interface TokenWallet {
  balance: number;
  ledger: {
    id: string;
    delta: number;
    reason: string;
    balanceAfter: number;
    readingId: string | null;
    createdAt: string;
  }[];
}

export async function getTokenWallet(userId: string): Promise<TokenWallet> {
  const [[user], ledger] = await Promise.all([
    db.select({ balance: users.tokenBalance }).from(users).where(eq(users.id, userId)).limit(1),
    db
      .select({
        id: tokenLedger.id,
        delta: tokenLedger.delta,
        reason: tokenLedger.reason,
        balanceAfter: tokenLedger.balanceAfter,
        readingId: tokenLedger.readingId,
        createdAt: tokenLedger.createdAt,
      })
      .from(tokenLedger)
      .where(eq(tokenLedger.userId, userId))
      .orderBy(desc(tokenLedger.createdAt))
      .limit(20),
  ]);

  return {
    balance: user?.balance ?? 0,
    ledger: ledger.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
  };
}
