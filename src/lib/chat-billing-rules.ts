/**
 * Per-minute coin billing for the AI Panditji chat.
 *
 * Owner rules:
 *   - Every new account gets 50 welcome coins.
 *   - Chat costs 10 coins for every started minute of an active conversation.
 *   - A Pro report includes 50 chat minutes; coins are used after that.
 *   - A session ends after 2 idle minutes, so leaving the page never drains coins.
 *
 * This file is dependency-free and safe to import in a client component.
 */
import type { ChatPlan } from "./chat-quota-rules";

export const CHAT_COINS_PER_MINUTE = 10;
export const CHAT_GUEST_COINS = 50;
export const CHAT_PRO_INCLUDED_MINUTES = 50;
/** A conversation stays "active" while messages arrive within this window. */
export const CHAT_SESSION_IDLE_MS = 2 * 60_000;

export interface ChatBillingSummary {
  plan: ChatPlan;
  /** True when this chat belongs to an account rather than a guest cookie. */
  signedIn: boolean;
  /** Spendable coins (account balance, or the guest cookie wallet). */
  coins: number;
  coinsPerMinute: number;
  /** Pro only: the 50 minutes included with the Pro report. */
  includedMinutesLimit: number | null;
  includedMinutesUsed: number | null;
  includedMinutesLeft: number | null;
  sessionStartedAt: string | null;
  sessionLastSeenAt: string | null;
  sessionBilledMinutes: number;
  sessionActive: boolean;
}

/**
 * Work out how many new minutes must be billed for this message.
 *
 * The first message of a session bills one minute up front, and each later
 * started minute is billed once. An idle gap longer than `idleMs` starts a new
 * session, so a visitor who returns tomorrow is not charged for the gap.
 */
export function planChatMinutes(input: {
  startedAt: number | null;
  lastSeenAt: number | null;
  billedMinutes: number;
  now: number;
  idleMs?: number;
}): { reset: boolean; minutesDue: number; newMinutes: number } {
  const idleMs = input.idleMs ?? CHAT_SESSION_IDLE_MS;
  const billed = Number.isFinite(input.billedMinutes)
    ? Math.max(0, Math.floor(input.billedMinutes))
    : 0;
  if (
    input.startedAt === null ||
    input.lastSeenAt === null ||
    input.now - input.lastSeenAt > idleMs
  ) {
    return { reset: true, minutesDue: 1, newMinutes: 1 };
  }

  const elapsed = Math.max(0, input.now - input.startedAt);
  const minutesDue = Math.max(1, Math.ceil(elapsed / 60_000));
  return { reset: false, minutesDue, newMinutes: Math.max(0, minutesDue - billed) };
}

/** True while the visitor is inside a conversation that was billed recently. */
export function isChatSessionActive(
  lastSeenAt: string | null,
  now = Date.now(),
  idleMs = CHAT_SESSION_IDLE_MS,
): boolean {
  if (!lastSeenAt) return false;
  const seen = Date.parse(lastSeenAt);
  if (!Number.isFinite(seen)) return false;
  return now - seen <= idleMs;
}

/**
 * UI-only guard. The server is still the authority: it returns 402 when the
 * next minute cannot be paid for. When a paid minute is still active we keep
 * the input enabled so the user gets the full minute they already bought.
 */
export function chatNeedsCoins(
  billing: ChatBillingSummary | null,
  now = Date.now(),
): boolean {
  if (!billing) return false;
  if ((billing.includedMinutesLeft ?? 0) > 0) return false;
  if (billing.coins >= billing.coinsPerMinute) return false;
  return !isChatSessionActive(billing.sessionLastSeenAt, now);
}

/** Minutes the visitor can still afford, for the meter copy. */
export function affordableMinutes(billing: ChatBillingSummary): number {
  if ((billing.includedMinutesLeft ?? 0) > 0) return billing.includedMinutesLeft ?? 0;
  return Math.floor(billing.coins / Math.max(1, billing.coinsPerMinute));
}
