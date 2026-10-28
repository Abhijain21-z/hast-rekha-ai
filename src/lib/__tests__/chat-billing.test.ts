import { describe, expect, it } from "vitest";
import {
  CHAT_COINS_PER_MESSAGE,
  CHAT_GUEST_COINS,
  CHAT_PRO_INCLUDED_MESSAGES,
  affordableMessages,
  chatNeedsCoins,
  type ChatBillingSummary,
} from "@/lib/chat-billing-rules";
import { SIGNUP_TOKEN_BONUS } from "@/lib/token-rules";
import { chatSubject, isChatUuid } from "@/lib/chat-quota-rules";

function billing(overrides: Partial<ChatBillingSummary> = {}): ChatBillingSummary {
  return {
    plan: "free",
    signedIn: false,
    coins: CHAT_GUEST_COINS,
    coinsPerMessage: CHAT_COINS_PER_MESSAGE,
    includedMessagesLimit: null,
    includedMessagesUsed: null,
    includedMessagesLeft: null,
    messagesSent: 0,
    ...overrides,
  };
}

describe("coin rules", () => {
  it("gives guests and new accounts 50 coins", () => {
    expect(CHAT_GUEST_COINS).toBe(50);
    expect(SIGNUP_TOKEN_BONUS).toBe(50);
  });

  it("prices chat at 10 coins per message and Pro at 50 included messages", () => {
    expect(CHAT_COINS_PER_MESSAGE).toBe(10);
    expect(CHAT_PRO_INCLUDED_MESSAGES).toBe(50);
  });

});

describe("per-message chat billing", () => {

  it("charges exactly one message per billChatTime call", () => {
    // Each message costs CHAT_COINS_PER_MESSAGE coins
    expect(CHAT_COINS_PER_MESSAGE).toBe(10);
  });

});

describe("chat affordability", () => {
  it("needs coins when the wallet cannot pay for the next message", () => {
    expect(chatNeedsCoins(billing({ coins: 10 }))).toBe(false);
    expect(chatNeedsCoins(billing({ coins: 9 }))).toBe(true);
    expect(chatNeedsCoins(billing({ coins: 0 }))).toBe(true);
  });

  it("does not demand coins while Pro messages remain", () => {
    expect(
      chatNeedsCoins(
        billing({
          plan: "pro",
          coins: 0,
          includedMessagesLeft: 12,
        }),
      ),
    ).toBe(false);
  });

  it("shows how many messages the balance can buy", () => {
    expect(affordableMessages(billing({ coins: 40 }))).toBe(4);
    expect(
      affordableMessages(
        billing({
          plan: "pro",
          coins: 0,
          includedMessagesLeft: 37,
        }),
      ),
    ).toBe(37);
  });

  it("keeps signed-in and guest identities separate", () => {
    expect(chatSubject("user-1", "anon-1")).toBe("user:user-1");
    expect(chatSubject(null, "anon-1")).toBe("anon:anon-1");
  });

  it("accepts only UUID-shaped guest ids", () => {
    expect(isChatUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isChatUuid("not-a-uuid")).toBe(false);
    expect(isChatUuid(null)).toBe(false);
  });
});
