import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Owner-only pages and APIs (free-reader outreach, support lookup).
 *
 * Two ways in:
 *  1. `REVIEWS_ADMIN_KEY` / `OUTREACH_ADMIN_KEY` env vars (rotatable in Vercel).
 *  2. `OUTREACH_KEY_SHA256` — the SHA-256 of a long random outreach key.
 *
 * The hash path exists because Vercel never returns secret values, so a key
 * that only lives in an env var cannot be handed back to the owner as a link.
 * A SHA-256 of a 40-char random string is not brute-forceable, so storing the
 * digest in the repo is safe.
 */
const OUTREACH_KEY_SHA256 =
  "0701674cda5ac5c1bf1820d997c88af5252d9a41fc659855ef03b905151adc81";

function ownerKeys(): string[] {
  return [process.env.REVIEWS_ADMIN_KEY, process.env.OUTREACH_ADMIN_KEY]
    .map((value) => value?.trim() ?? "")
    .filter(Boolean);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function isAdminKey(value: string | null | undefined): boolean {
  const provided = (value ?? "").trim();
  if (!provided) return false;
  if (safeEqual(sha256(provided), OUTREACH_KEY_SHA256)) return true;
  return ownerKeys().some((key) => safeEqual(provided, key));
}
