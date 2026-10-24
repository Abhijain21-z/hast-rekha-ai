import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildDailyRashifalUrl,
  buildDailyTemplateComponents,
  istDateKey,
  isStopMessage,
  normalizeWhatsAppPhone,
  toIndiaTenDigits,
  verifyMetaSignature,
} from "@/lib/whatsapp";

describe("WhatsApp daily rashifal helpers", () => {
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
    expect(url.searchParams.get("utm_medium")).toBe("daily");
    expect(url.searchParams.get("utm_campaign")).toBe("daily_rashifal");
  });

  it("uses the India date for the daily send key", () => {
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
