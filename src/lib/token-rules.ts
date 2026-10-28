/**
 * Client-safe coin rules. Kept separate from `tokens.ts` so browser
 * components never import the database driver.
 */
/** Welcome coins for every new account, and for a guest's first wallet. */
export const SIGNUP_TOKEN_BONUS = 50;
