/**
 * Client-safe token rules. Kept separate from `tokens.ts` so browser
 * components never import the database driver.
 */
export const REFERRAL_TOKEN_REWARD = 50;
/** Welcome coins for every new account, and for a guest's first wallet. */
export const SIGNUP_TOKEN_BONUS = 50;
export const ULTRA_TOKEN_COST = 350;
export const ULTRA_PRICE_INR = 351;

export function tokenProgress(balance: number) {
  const safe = Math.max(0, Math.floor(balance));
  const remaining = Math.max(0, ULTRA_TOKEN_COST - safe);
  return {
    balance: safe,
    cost: ULTRA_TOKEN_COST,
    remaining,
    percent: Math.min(100, Math.round((safe / ULTRA_TOKEN_COST) * 100)),
    ready: safe >= ULTRA_TOKEN_COST,
  };
}
