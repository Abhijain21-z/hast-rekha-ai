import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildDailyRashifalUrl,
  buildDailyTemplateComponents,
  isRashifalDay,
  istDateKey,
  istWeekday,
  isStopMessage,
  normalizeWhatsAppPhone,
  rashifalWeekdays,
  toIndiaTenDigits,
  verifyMetaSignature,
} from "@/lib/whatsapp";

describe("WhatsApp rashifal reminder helpers", () => {
  it("normalizes Indian WhatsApp numbers to the 91XXXXXXXXXX format", () => {
    expect(normalizeWhatsAppPhone("9876543210")).toBe("919876543210");
    expect(normalizeWhatsAppPhone("+91 98765 43210")).toBe("919876543210");
    expect(normalizeWhatsAppPhone("09876543210")).toBe("919876543210");
    expect(normalizeWhatsAppPhone("919876543210")).toBe("919876543210");
    expect(normalizeWhatsAppPhone("5876543210")).toBeNull();
    expect(normalizeWhatsAppPhone("12345")).toBeNull();
    expect(normalizeWhatsAppPhone("")).toBeNull();
    expect(normalizeWhatsAppPhone(null)).toBeNull();
  });

  it("extracts the 10-digit number from inbound WhatsApp senders", () => {
    expect(toIndiaTenDigits("919876543210")).toBe("9876543210");
    expect(toIndiaTenDigits("09876543210")).toBe("9876543210");
    expect(toIndiaTenDigits("9876543210")).toBe("9876543210");
    expect(toIndiaTenDigits("123")).toBeNull();
    expect(toIndiaTenDigits(undefined)).toBeNull();
  });

  it("rejects non-string runtime inputs instead of throwing", () => {
    expect(normalizeWhatsAppPhone({} as unknown as string)).toBeNull();
    expect(toIndiaTenDigits(123 as unknown as string)).toBeNull();
    expect(isStopMessage({} as unknown as string)).toBe(false);
  });

  it("builds a personalized, UTM-tagged rashifal link", () => {
    const url = new URL(buildDailyRashifalUrl("mesha"));
    expect(url.origin).toBe("https://www.hastrekhaai.online");
    expect(url.pathname).toBe("/rashifal");
    expect(url.searchParams.get("sign")).toBe("mesha");
    expect(url.searchParams.get("utm_source")).toBe("whatsapp");
    expect(url.searchParams.get("utm_medium")).toBe("weekly");
    expect(url.searchParams.get("utm_campaign")).toBe("rashifal_reminder");
  });

  it("uses the India date for the send key", () => {
    expect(istDateKey(new Date("2026-10-24T03:30:00.000Z"))).toBe("2026-10-24");
    expect(istDateKey(new Date("2026-10-24T23:30:00.000Z"))).toBe("2026-10-25");
  });

  it("recognises STOP and Hindi opt-out replies", () => {
    for (const text of ["STOP", " stop ", "Stop.", "unsubscribe", "band", "band karo", "बंद", "रोको"]) {
      expect(isStopMessage(text), text).toBe(true);
    }
    for (const text of ["hello", "stop please", "aaj ka rashifal", ""]) {
      expect(isStopMessage(text), text).toBe(false);
    }
  });

  it("verifies Meta's X-Hub-Signature-256 header", () => {
    const body = '{"object":"whatsapp_business_account"}';
    const secret = "test-secret";
    const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
    expect(verifyMetaSignature(body, signature, secret)).toBe(true);
    expect(verifyMetaSignature(body, `${signature}00`, secret)).toBe(false);
    expect(verifyMetaSignature(body, "sha256=deadbeef", secret)).toBe(false);
    expect(verifyMetaSignature(body, null, secret)).toBe(false);
  });

  it("builds the three template body parameters in order", () => {
    const components = buildDailyTemplateComponents("Aarav", "मेष", "https://example.com/rashifal?sign=mesha");
    expect(components).toEqual([
      {
        type: "body",
        parameters: [
          { type: "text", text: "Aarav" },
          { type: "text", text: "मेष" },
          { type: "text", text: "https://example.com/rashifal?sign=mesha" },
        ],
      },
    ]);
  });
});

describe("twice-weekly rashifal schedule", () => {
  const ids = Array.from({ length: 200 }, (_, index) => `subscriber-${index}`);

  it("maps an India date to a Monday-first weekday", () => {
    expect(istWeekday("2026-10-26")).toBe(0); // Monday
    expect(istWeekday("2026-10-24")).toBe(5); // Saturday
    expect(istWeekday("2026-10-25")).toBe(6); // Sunday
    expect(istWeekday("2026-11-01")).toBe(6); // Sunday, across a month boundary
    expect(istWeekday("2028-02-29")).toBe(1); // Tuesday, leap day
  });

  it("gives every subscriber two stable, different days three or four days apart", () => {
    for (const id of ids) {
      const [first, second] = rashifalWeekdays(id);
      expect(first).toBeGreaterThanOrEqual(0);
      expect(first).toBeLessThanOrEqual(6);
      expect(second).not.toBe(first);
      const gap = (second - first + 7) % 7;
      expect([3, 4]).toContain(gap);
      expect(rashifalWeekdays(id)).toEqual([first, second]);
    }
  });

  it("spreads the cohort across all seven weekdays", () => {
    const counts = new Array(7).fill(0);
    for (const id of ids) {
      for (const day of rashifalWeekdays(id)) counts[day] += 1;
    }
    // 200 subscribers x 2 sends = 400 sends, so an even spread is ~57 per day.
    for (const count of counts) {
      expect(count).toBeGreaterThan(30);
      expect(count).toBeLessThan(85);
    }
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(ids.length * 2);
  });

  it("is due exactly on the two assigned days and nowhere else", () => {
    const week = [
      "2026-10-26", // Monday
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
      "2026-10-30",
      "2026-10-31",
      "2026-11-01", // Sunday
    ];
    for (const id of ids.slice(0, 50)) {
      const assigned = rashifalWeekdays(id);
      const dueDays = week
        .map((dateKey, index) => (isRashifalDay(id, dateKey) ? index : null))
        .filter((day): day is number => day !== null);
      expect(dueDays).toEqual([...assigned].sort((a, b) => a - b));
      expect(dueDays).toHaveLength(2);
    }
  });
});
