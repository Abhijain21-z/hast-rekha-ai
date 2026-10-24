import { after } from "next/server";
import { isStopMessage, verifyMetaSignature } from "@/lib/whatsapp";
import { markWhatsAppOptedOut } from "@/lib/whatsapp-subscribers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WebhookPayload {
  object?: string;
  entry?: {
    changes?: {
      field?: string;
      value?: {
        messages?: {
          from?: string;
          type?: string;
          text?: { body?: string };
        }[];
      };
    }[];
  }[];
}

/**
 * Meta webhook verification. Set the callback URL to
 * https://www.hastrekhaai.online/api/whatsapp/webhook and use the same value as
 * WHATSAPP_WEBHOOK_VERIFY_TOKEN.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim();

  if (!expected) {
    return new Response("Webhook verify token is not configured", { status: 503 });
  }
  if (mode === "subscribe" && token === expected && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/**
 * Inbound messages. Only STOP-style replies are acted on: they flip the
 * subscriber to opted_out immediately so the next daily run skips them.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.WHATSAPP_APP_SECRET?.trim();

  if (!secret) {
    // In production an unsigned endpoint would let anyone unsubscribe any
    // number. Refuse until the app secret is configured.
    if (process.env.NODE_ENV === "production") {
      return new Response("Webhook app secret is not configured", { status: 503 });
    }
  } else if (!verifyMetaSignature(rawBody, req.headers.get("x-hub-signature-256"), secret)) {
    return new Response("Invalid signature", { status: 403 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return new Response("OK", { status: 200 });
  }

  // Meta expects a fast 200; the DB update can finish after the response.
  after(async () => {
    try {
      let optedOut = 0;
      for (const entry of payload.entry ?? []) {
        for (const change of entry.changes ?? []) {
          for (const message of change.value?.messages ?? []) {
            const text = message.text?.body;
            if (!message.from || !text || !isStopMessage(text)) continue;
            if (await markWhatsAppOptedOut(message.from)) optedOut += 1;
          }
        }
      }
      if (optedOut > 0) {
        console.info(`[whatsapp] ${optedOut} subscriber(s) opted out via webhook`);
      }
    } catch (error) {
      console.error(
        "[whatsapp] webhook handling failed:",
        error instanceof Error ? error.message : error,
      );
    }
  });

  return new Response("OK", { status: 200 });
}
