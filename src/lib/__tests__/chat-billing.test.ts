import { describe, expect, it } from "vitest";
import {
  CHAT_COINS_PER_MINUTE,
  CHAT_GUEST_COINS,
  CHAT_PRO_INCLUDED_MINUTES,
  CHAT_SESSION_IDLE_MS,
  affordableMinutes,
  chatNeedsCoins,
  planChatMinutes,
  type ChatBillingSummary,
} from "@/lib/chat-billing-rules";
import { SIGNUP_TOKEN_BONUS } from "@/lib/token-rules";
import { chatSubject, isChatUuid } from "@/lib/chat-quota-rules";

const MINUTE = 60_000;

function billing(overrides: Partial<ChatBillingSummary> = {}): ChatBillingSummary {
  return {
    plan: "free",
    signedIn: false,
    coins: CHAT_GUEST_COINS,
    coinsPerMinute: CHAT_COINS_PER_MINUTE,
    includedMinutesLimit: null,
    includedMinutesUsed: null,
    includedMinutesLeft: null,
    sessionStartedAt: null,
    sessionLastSeenAt: null,
    sessionBilledMinutes: 0,
    sessionActive: false,
    ...overrides,
  };
}

describe("coin rules", () => {
  it("gives guests and new accounts 50 coins", () => {
    expect(CHAT_GUEST_COINS).toBe(50);
    expect(SIGNUP_TOKEN_BONUS).toBe(50);
  });

  it("prices chat at 10 coins per started minute and Pro at 50 included minutes", () => {
    expect(CHAT_COINS_PER_MINUTE).toBe(10);
    expect(CHAT_PRO_INCLUDED_MINUTES).toBe(50);
    expect(CHAT_SESSION_IDLE_MS).toBe(2 * MINUTE);
  });

});

describe("per-minute chat billing", () => {
  const startedAt = 1_000_000;

  it("bills the first minute when a session starts", () => {
    expect(
      planChatMinutes({
        startedAt: null,
        lastSeenAt: null,
        billedMinutes: 0,
        now: startedAt,
      }),
    ).toEqual({ reset: true, minutesDue: 1, newMinutes: 1 });
  });

  it("does not charge again within the same started minute", () => {
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 20_000,
        billedMinutes: 1,
        now: startedAt + 45_000,
      }),
    ).toEqual({ reset: false, minutesDue: 1, newMinutes: 0 });
  });

  it("bills each later started minute exactly once", () => {
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 20_000,
        billedMinutes: 1,
        now: startedAt + MINUTE + 1,
      }),
    ).toEqual({ reset: false, minutesDue: 2, newMinutes: 1 });

    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + MINUTE + 10_000,
        billedMinutes: 2,
        now: startedAt + 2 * MINUTE + 1,
      }),
    ).toEqual({ reset: false, minutesDue: 3, newMinutes: 1 });
  });

  it("starts a fresh paid minute after two idle minutes", () => {
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 10 * MINUTE,
        billedMinutes: 3,
        now: startedAt + 12 * MINUTE + 1,
      }),
    ).toEqual({ reset: true, minutesDue: 1, newMinutes: 1 });
  });

  it("keeps an active session when the gap is exactly the idle window", () => {
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 2 * MINUTE,
        billedMinutes: 4,
        now: startedAt + 4 * MINUTE,
      }),
    ).toEqual({ reset: false, minutesDue: 4, newMinutes: 0 });
  });

  it("ignores malformed stored counters", () => {
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 1_000,
        billedMinutes: Number.NaN,
        now: startedAt + 20_000,
      }).newMinutes,
    ).toBe(1);
    expect(
      planChatMinutes({
        startedAt,
        lastSeenAt: startedAt + 1_000,
        billedMinutes: -4,
        now: startedAt + 20_000,
      }).newMinutes,
    ).toBe(1);
  });
});

describe("chat affordability", () => {
  it("needs coins when the wallet cannot buy the next minute", () => {
    expect(chatNeedsCoins(billing({ coins: 10 }))).toBe(false);
    expect(chatNeedsCoins(billing({ coins: 9 }))).toBe(true);
  });

  it("keeps the paid minute usable while the session is active", () => {
    const now = Date.now();
    expect(
      chatNeedsCoins(
        billing({
          coins: 5,
          sessionLastSeenAt: new Date(now - 10_000).toISOString(),
        }),
        now,
      ),
    ).toBe(false);
  });

  it("does not demand coins while Pro minutes remain", () => {
    expect(
      chatNeedsCoins(
        billing({
          plan: "pro",
          coins: 0,
          includedMinutesLeft: 12,
        }),
      ),
    ).toBe(false);
  });

  it("shows how many minutes the balance can buy", () => {
    expect(affordableMinutes(billing({ coins: 40 }))).toBe(4);
    expect(
      affordableMinutes(
        billing({
          plan: "pro",
          coins: 0,
          includedMinutesLeft: 37,
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
