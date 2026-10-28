/**
 * Per-message coin billing for the AI Panditji chat.
 *
 * Owner rules:
 *   - Every new account gets 50 welcome coins.
 *   - Chat costs 10 coins for every message sent.
 *   - A Pro report includes 50 chat messages; coins are used after that.
 *   - Coins are deducted only when a message is successfully sent.
 *
 * This file is dependency-free and safe to import in a client component.
 */
import type { ChatPlan } from "./chat-quota-rules";

export const CHAT_COINS_PER_MESSAGE = 10;
export const CHAT_GUEST_COINS = 50;
export const CHAT_PRO_INCLUDED_MESSAGES = 50;

export interface ChatBillingSummary {
  plan: ChatPlan;
  /** True when this chat belongs to an account rather than a guest cookie. */
  signedIn: boolean;
  /** Spendable coins (account balance, or the guest cookie wallet). */
  coins: number;
  coinsPerMessage: number;
  /** Pro only: the 50 messages included with the Pro report. */
  includedMessagesLimit: number | null;
  includedMessagesUsed: number | null;
  includedMessagesLeft: number | null;
  messagesSent: number;
}

/**
 * UI-only guard. The server is still the authority: it returns 402 when the
 * next message cannot be paid for.
 */
export function chatNeedsCoins(
  billing: ChatBillingSummary | null,
): boolean {
  if (!billing) return false;
  if ((billing.includedMessagesLeft ?? 0) > 0) return false;
  return billing.coins < billing.coinsPerMessage;
}

/** Messages the visitor can still afford, for the meter copy. */
export function affordableMessages(billing: ChatBillingSummary): number {
  if ((billing.includedMessagesLeft ?? 0) > 0) return billing.includedMessagesLeft ?? 0;
  return Math.floor(billing.coins / Math.max(1, billing.coinsPerMessage));
}
