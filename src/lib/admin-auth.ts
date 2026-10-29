import { timingSafeEqual } from "node:crypto";

/**
 * Owner-only pages and APIs (free-reader outreach, support lookup) share one
 * secret. Keep the comparison in one place so a new route cannot forget it.
 *
 * `OUTREACH_ADMIN_KEY` is a second, dedicated key for the WhatsApp outreach
 * page so that key can be rotated without breaking the support lookup.
 */
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

export function isAdminKey(value: string | null | undefined): boolean {
  const provided = (value ?? "").trim();
  if (!provided) return false;
  return ownerKeys().some((key) => safeEqual(provided, key));
}
