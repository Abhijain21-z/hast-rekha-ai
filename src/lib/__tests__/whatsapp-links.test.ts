import { describe, expect, it } from "vitest";
import { buildReportLink, fixLinks, wantsReportLink } from "../whatsapp-links";

const READING_ID = "a3b4f759-033f-4ede-812d-d32bf08b315b";
const REPORT_LINK = `https://www.hastrekhaai.online/reading/${READING_ID}?utm_source=whatsapp&utm_campaign=pro_followup`;
const FORM_LINK =
  "https://www.hastrekhaai.online/reading?utm_source=whatsapp&utm_campaign=pro_followup";

describe("buildReportLink", () => {
  it("opens the reader's own report when the id is known", () => {
    expect(buildReportLink(READING_ID)).toBe(REPORT_LINK);
  });

  it("falls back to the reading form without an id", () => {
    expect(buildReportLink(null)).toBe(FORM_LINK);
  });
});

describe("fixLinks", () => {
  it("keeps the exact report link", () => {
    const reply = `Aapki report yahan hai: ${REPORT_LINK}`;
    expect(fixLinks(reply, REPORT_LINK)).toBe(reply);
  });

  it("replaces an invented domain", () => {
    expect(fixLinks("Yahan dekhein: https://hastrekha-ai.example/pro", REPORT_LINK)).toBe(
      `Yahan dekhein: ${REPORT_LINK}`,
    );
  });

  it("replaces an invented path on our own domain", () => {
    expect(fixLinks("Yahan dekhein: https://www.hastrekhaai.online/pro", REPORT_LINK)).toBe(
      `Yahan dekhein: ${REPORT_LINK}`,
    );
  });

  it("replaces a hallucinated reading id", () => {
    expect(
      fixLinks("Yahan dekhein: https://www.hastrekhaai.online/reading/not-a-real-id", REPORT_LINK),
    ).toBe(`Yahan dekhein: ${REPORT_LINK}`);
  });

  it("expands a bare domain mention", () => {
    expect(fixLinks("Yahan dekhein: www.hastrekhaai.online/pro", REPORT_LINK)).toBe(
      `Yahan dekhein: ${REPORT_LINK}`,
    );
  });

  it("leaves text without links untouched", () => {
    expect(fixLinks("Aapka naam kya hai?", REPORT_LINK)).toBe("Aapka naam kya hai?");
  });
});

describe("wantsReportLink", () => {
  it("is true when the user shares details or asks about Pro/payment", () => {
    for (const text of [
      "Mera naam Rahul hai",
      "janm 15/08/1990",
      "Pro plan ka link bhejo",
      "payment kaise karu",
      "report chahiye",
      "reading form kahan hai",
    ]) {
      expect(wantsReportLink(text), text).toBe(true);
    }
  });

  it("is false for a plain greeting", () => {
    expect(wantsReportLink("Namaste")).toBe(false);
  });
});
