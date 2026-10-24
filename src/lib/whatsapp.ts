import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

/**
 * WhatsApp helpers.
 *
 * Sending is intentionally env-gated: nothing leaves the server until both
 * WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are set, and Meta has
 * approved the daily template. The rest of the app can safely ship before
 * those credentials exist.
 */

export const DAILY_TEMPLATE_NAME = "daily_rashifal";
export const DAILY_TEMPLATE_LANG = "hi";

export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
  apiVersion: string;
  configured: boolean;
}

export interface WhatsAppTemplateComponent {
  type: "body";
  parameters: { type: "text"; text: string }[];
}

export class WhatsAppSendError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "WhatsAppSendError";
  }
}

/** Strip a number down to the 10-digit Indian mobile form, or return null. */
function extractTenDigits(input: string | null | undefined): string | null {
  if (typeof input !== "string" || !input) return null;
  const digits = input.replace(/\D/g, "");
  let ten: string | null = null;
  if (digits.length === 10) ten = digits;
  else if (digits.length === 11 && digits.startsWith("0")) ten = digits.slice(1);
  else if (digits.length === 12 && digits.startsWith("91")) ten = digits.slice(2);
  else if (digits.length === 13 && digits.startsWith("091")) ten = digits.slice(3);
  return ten && /^[6-9]\d{9}$/.test(ten) ? ten : null;
}

/** 9876543210 / +91 98765 43210 / 09876543210 -> 919876543210 */
export function normalizeWhatsAppPhone(input: string | null | undefined): string | null {
  const ten = extractTenDigits(input);
  return ten ? `91${ten}` : null;
}

/** Inbound WhatsApp senders arrive as 919876543210 -> 9876543210. */
export function toIndiaTenDigits(input: string | null | undefined): string | null {
  return extractTenDigits(input);
}

/** The personalized click-through link used in the daily message. */
export function buildDailyRashifalUrl(rashiKey: string): string {
  const url = new URL("/rashifal", SITE_URL);
  url.searchParams.set("sign", rashiKey);
  url.searchParams.set("utm_source", "whatsapp");
  url.searchParams.set("utm_medium", "daily");
  url.searchParams.set("utm_campaign", "daily_rashifal");
  return url.toString();
}

/** Today's calendar date in India, matching the rashifal page's date. */
export { istDateKey } from "./rashifal";

/** Recognize the opt-out replies we advertise in the template and privacy page. */
export function isStopMessage(text: string | null | undefined): boolean {
  if (typeof text !== "string" || !text) return false;
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[.!?,]+$/g, "")
    .replace(/\s+/g, " ");
  return /^(stop|unsubscribe|opt out|band|band karo|बंद|बंद करो|रोको)$/i.test(cleaned);
}

/** Meta signs webhook bodies with HMAC-SHA256; verify before trusting STOP replies. */
export function verifyMetaSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string,
): boolean {
  if (!signature || !secret || !signature.startsWith("sha256=")) return false;
  const received = signature.slice("sha256=".length);
  if (!/^[a-f0-9]{64}$/i.test(received)) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  try {
    return timingSafeEqual(Buffer.from(received, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/** Meta body parameters: {{1}} name, {{2}} rashi, {{3}} personalized link. */
export function buildDailyTemplateComponents(
  name: string,
  rashiName: string,
  url: string,
): WhatsAppTemplateComponent[] {
  return [
    {
      type: "body",
      parameters: [
        { type: "text", text: name },
        { type: "text", text: rashiName },
        { type: "text", text: url },
      ],
    },
  ];
}

export function getWhatsAppConfig(): WhatsAppConfig {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim() ?? "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? "";
  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || "v23.0";
  return {
    token,
    phoneNumberId,
    apiVersion,
    configured: Boolean(token && phoneNumberId),
  };
}

export function whatsappConfigured(): boolean {
  return getWhatsAppConfig().configured;
}

export interface SendDailyRashifalInput {
  /** 10-digit Indian number or any format normalizeWhatsAppPhone accepts. */
  to: string;
  name: string;
  rashiName: string;
  url: string;
  templateName?: string;
  languageCode?: string;
}

/**
 * Send one approved marketing template through Meta's WhatsApp Cloud API.
 * Returns the provider message id. Throws WhatsAppSendError on any failure.
 */
export async function sendDailyRashifalTemplate(input: SendDailyRashifalInput): Promise<string> {
  const config = getWhatsAppConfig();
  if (!config.configured) {
    throw new WhatsAppSendError(503, "WhatsApp sender is not configured");
  }

  const to = normalizeWhatsAppPhone(input.to);
  if (!to) throw new WhatsAppSendError(400, "Invalid WhatsApp number");

  const templateName =
    input.templateName?.trim() ||
    process.env.WHATSAPP_DAILY_TEMPLATE_NAME?.trim() ||
    DAILY_TEMPLATE_NAME;
  const languageCode =
    input.languageCode?.trim() ||
    process.env.WHATSAPP_DAILY_TEMPLATE_LANG?.trim() ||
    DAILY_TEMPLATE_LANG;

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: buildDailyTemplateComponents(
        input.name.slice(0, 60),
        input.rashiName.slice(0, 60),
        input.url,
      ),
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    },
  );

  const json = (await res.json().catch(() => null)) as
    | { messages?: { id?: string }[]; error?: { message?: string } }
    | null;

  if (!res.ok) {
    throw new WhatsAppSendError(
      res.status,
      json?.error?.message || `WhatsApp API returned ${res.status}`,
    );
  }

  const messageId = json?.messages?.[0]?.id;
  if (!messageId) {
    throw new WhatsAppSendError(502, "WhatsApp API did not return a message id");
  }
  return messageId;
}
