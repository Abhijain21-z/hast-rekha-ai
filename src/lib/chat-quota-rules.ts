/**
 * Chat identity + plan helpers shared by the browser and the server.
 *
 * Wallet rules and per-minute pricing live in `chat-billing-rules.ts`; this
 * file only answers "who is this?" and "which plan applies?".
 */

/** HttpOnly cookie that gives guests a stable identity across pages. */
export const CHAT_ANON_COOKIE = "hr_chat_id";
export const CHAT_ANON_COOKIE_DAYS = 365;

export type ChatPlan = "free" | "pro";

/** Subject key for a signed-in reader, or an anonymous browser id for a guest. */
export function chatSubject(userId: string | null | undefined, anonymousId: string): string {
  return userId ? `user:${userId}` : `anon:${anonymousId}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isChatUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}
