/**
 * Client-safe referral-code helpers. Kept separate from `tokens.ts` so a
 * browser component never pulls the database driver into its bundle.
 */
export const REFERRAL_COOKIE = "hr_ref";
export const REFERRAL_COOKIE_DAYS = 60;

/** Accept only the compact, uppercase code format used in /register?ref=CODE. */
export function normalizeReferralCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const code = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z0-9]{6,12}$/.test(code) ? code : null;
}

/** Read the 60-day referral cookie in the browser. */
export function readReferralCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${REFERRAL_COOKIE}=([^;]*)`));
  return match ? normalizeReferralCode(decodeURIComponent(match[1])) : null;
}
