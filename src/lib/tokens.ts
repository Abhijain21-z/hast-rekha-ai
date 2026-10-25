/**
 * Referral rewards + the token wallet.
 *
 * Product rules (owner-confirmed):
 *   - Every new account starts with 50 coins.
 *   - A referrer earns 50 tokens only after the referred person creates an account.
 *   - Chat with Panditji costs 10 coins per started minute; a Pro report
 *     includes 50 minutes before coins are used.
 *   - Tokens are never accepted for the Rs 51 Pro report.
 *   - 350 tokens unlock one Ultra Pro (Rs 351) report.
 *
 * The ledger is append-only and every mutation runs in a transaction with a
 * row lock, so two simultaneous redemptions cannot spend the same balance.
 */
import { randomBytes } from "crypto";
import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { readings, referrals, tokenLedger, users } from "@/db/schema";
import { normalizeReferralCode } from "./referral-code";
import { SITE_URL } from "./site";
import { REFERRAL_TOKEN_REWARD, ULTRA_PRICE_INR, ULTRA_TOKEN_COST } from "./token-rules";

export { normalizeReferralCode } from "./referral-code";
export {
  REFERRAL_TOKEN_REWARD,
  SIGNUP_TOKEN_BONUS,
  ULTRA_PRICE_INR,
  ULTRA_TOKEN_COST,
  tokenProgress,
} from "./token-rules";

/** No 0/O/1/I, so a code can be read aloud or typed without confusion. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export type TokenLedgerReason =
  | "signup_bonus"
  | "referral_signup"
  | "chat_time"
  | "chat_refund"
  | "ultra_redemption"
  | "admin_adjustment";

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

export interface PendingReferralReward {
  id: string;
  tokens: number;
  balance: number;
  createdAt: string;
}

export class TokenRedemptionError extends Error {
  constructor(
    public readonly code: "not_found" | "insufficient_tokens" | "unauthorized",
    message: string,
  ) {
    super(message);
    this.name = "TokenRedemptionError";
  }
}

export function generateReferralCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return code;
}

export function referralLink(code: string): string {
  return `${SITE_URL}/register?ref=${encodeURIComponent(code)}`;
}

const isUniqueViolation = (error: unknown) =>
  !!error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "23505";

/**
 * Return the user's code, creating one lazily for accounts that existed before
 * referrals shipped. The conditional update makes this safe under a race.
 */
export async function ensureReferralCode(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ code: users.referralCode })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) return null;
  if (row.code) return row.code;

  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateReferralCode();
    try {
      const updated = await db
        .update(users)
        .set({ referralCode: code })
        .where(and(eq(users.id, userId), isNull(users.referralCode)))
        .returning({ code: users.referralCode });
      if (updated[0]?.code) return updated[0].code;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }

    const [again] = await db
      .select({ code: users.referralCode })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (again?.code) return again.code;
  }
  throw new Error("Could not allocate a referral code");
}

/**
 * Credit the referrer after the referred account is created. Invalid or
 * self-referral codes are ignored; registration must never fail because of a
 * referral problem.
 */
export async function creditReferral(input: {
  code: string;
  newUserId: string;
  newUserEmail: string;
}): Promise<{ tokensAwarded: number; balanceAfter: number; referralId: string } | null> {
  const code = normalizeReferralCode(input.code);
  if (!code) return null;

  try {
    return await db.transaction(async (tx) => {
      const [referrer] = await tx
        .select({ id: users.id, email: users.email, tokenBalance: users.tokenBalance })
        .from(users)
        .where(eq(users.referralCode, code))
        .limit(1)
        .for("update");
      if (!referrer) return null;
      if (referrer.id === input.newUserId) return null;
      if (referrer.email.toLowerCase() === input.newUserEmail.toLowerCase()) return null;

      // The unique referred_user_id also protects this, but checking first keeps
      // a retried registration from producing a confusing conflict log.
      const [already] = await tx
        .select({ id: referrals.id })
        .from(referrals)
        .where(eq(referrals.referredUserId, input.newUserId))
        .limit(1);
      if (already) return null;

      const balanceAfter = referrer.tokenBalance + REFERRAL_TOKEN_REWARD;
      const [referral] = await tx
        .insert(referrals)
        .values({
          referrerId: referrer.id,
          referredUserId: input.newUserId,
          code,
          tokensAwarded: REFERRAL_TOKEN_REWARD,
        })
        .returning({ id: referrals.id });

      await tx.insert(tokenLedger).values({
        userId: referrer.id,
        delta: REFERRAL_TOKEN_REWARD,
        reason: "referral_signup",
        referralId: referral.id,
        balanceAfter,
        metadata: { referredUserId: input.newUserId },
      });

      await tx.update(users).set({ tokenBalance: balanceAfter }).where(eq(users.id, referrer.id));
      return { tokensAwarded: REFERRAL_TOKEN_REWARD, balanceAfter, referralId: referral.id };
    });
  } catch (error) {
    // A concurrent retry can hit the unique referred_user_id; it is a no-op.
    if (isUniqueViolation(error)) return null;
    console.error("[tokens] referral credit failed:", error instanceof Error ? error.message : error);
    return null;
  }
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

/** Oldest unseen referral reward, for the gift/sparkles popup. */
export async function getPendingReferralReward(userId: string): Promise<PendingReferralReward | null> {
  const [row] = await db
    .select({
      id: tokenLedger.id,
      tokens: tokenLedger.delta,
      balance: tokenLedger.balanceAfter,
      createdAt: tokenLedger.createdAt,
    })
    .from(tokenLedger)
    .where(
      and(
        eq(tokenLedger.userId, userId),
        eq(tokenLedger.reason, "referral_signup"),
        gt(tokenLedger.delta, 0),
        isNull(tokenLedger.acknowledgedAt),
      ),
    )
    .orderBy(asc(tokenLedger.createdAt))
    .limit(1);
  return row ? { ...row, createdAt: row.createdAt.toISOString() } : null;
}

export async function acknowledgeReferralReward(userId: string, ledgerId: string): Promise<boolean> {
  const updated = await db
    .update(tokenLedger)
    .set({ acknowledgedAt: new Date() })
    .where(and(eq(tokenLedger.id, ledgerId), eq(tokenLedger.userId, userId), isNull(tokenLedger.acknowledgedAt)))
    .returning({ id: tokenLedger.id });
  return updated.length > 0;
}

/**
 * Redeem 350 tokens for Ultra Pro on one reading owned by the user.
 * Already-Ultra readings are a no-op, never a second charge.
 */
export async function redeemUltraWithTokens(userId: string, readingId: string) {
  try {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .select({ id: users.id, tokenBalance: users.tokenBalance, email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .for("update");
      if (!user) throw new TokenRedemptionError("unauthorized", "Please sign in again.");

      const [reading] = await tx
        .select()
        .from(readings)
        .where(and(eq(readings.id, readingId), eq(readings.userId, userId)))
        .limit(1)
        .for("update");
      if (!reading) throw new TokenRedemptionError("not_found", "This reading is not in your account.");

      if (reading.ultra) {
        return { balance: user.tokenBalance, reading, alreadyUnlocked: true };
      }

      const [spent] = await tx
        .select({ id: tokenLedger.id })
        .from(tokenLedger)
        .where(and(eq(tokenLedger.readingId, readingId), eq(tokenLedger.reason, "ultra_redemption")))
        .limit(1);
      if (spent) {
        const [fresh] = await tx.select().from(readings).where(eq(readings.id, readingId)).limit(1);
        return { balance: user.tokenBalance, reading: fresh ?? reading, alreadyUnlocked: true };
      }

      if (user.tokenBalance < ULTRA_TOKEN_COST) {
        throw new TokenRedemptionError(
          "insufficient_tokens",
          `You need ${ULTRA_TOKEN_COST} tokens. Your balance is ${user.tokenBalance}.`,
        );
      }

      const balanceAfter = user.tokenBalance - ULTRA_TOKEN_COST;
      await tx.update(users).set({ tokenBalance: balanceAfter }).where(eq(users.id, userId));

      const [updated] = await tx
        .update(readings)
        .set({ premium: true, ultra: true, premiumAt: new Date(), updatedAt: new Date() })
        .where(eq(readings.id, readingId))
        .returning();

      await tx.insert(tokenLedger).values({
        userId,
        delta: -ULTRA_TOKEN_COST,
        reason: "ultra_redemption",
        readingId,
        balanceAfter,
        metadata: { plan: "ultra", priceInr: ULTRA_PRICE_INR },
      });

      return { balance: balanceAfter, reading: updated, alreadyUnlocked: false };
    });
  } catch (error) {
    // Two simultaneous taps: the partial unique index stops the second ledger
    // row. Report the reading as unlocked without charging again.
    if (isUniqueViolation(error)) {
      const [reading] = await db.select().from(readings).where(eq(readings.id, readingId)).limit(1);
      const [user] = await db.select({ balance: users.tokenBalance }).from(users).where(eq(users.id, userId)).limit(1);
      return { balance: user?.balance ?? 0, reading, alreadyUnlocked: true };
    }
    throw error;
  }
}
