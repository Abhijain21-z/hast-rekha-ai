/**
 * Transactional WhatsApp delivery of a paid report link.
 *
 * This module is only called from `fulfillCashfreePayment`, so a free reader
 * can never receive the message. Failures are logged by the caller and never
 * affect the unlock.
 */
import { SITE_URL } from "./site";
import { sendProReportTemplate } from "./whatsapp";

export interface ProReportMessage {
  phone: string | null;
  name: string;
  readingId: string;
}

export async function sendProReportWhatsApp({
  phone,
  name,
  readingId,
}: ProReportMessage): Promise<string | null> {
  if (!phone || !readingId) return null;

  const url = new URL(`/reading/${readingId}`, SITE_URL);
  url.searchParams.set("utm_source", "whatsapp");
  url.searchParams.set("utm_medium", "transactional");
  url.searchParams.set("utm_campaign", "pro_report");

  return sendProReportTemplate({
    to: phone,
    name: name || "Ji",
    /** Updated message for Pro users: "Aapka rashifal taiyar hai kya? Aap apna aaj/kal ka rashifal dekhna chahte hain? To is website ki link se dekh sakte ho." Only website link included — no feature promotion. */
  url: url.toString(),
  });
}
