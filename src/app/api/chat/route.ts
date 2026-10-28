import { NextResponse } from "next/server";
import {
  buildReadingContext,
  buildSystemPrompt,
  getChatConfig,
  sanitizeMessages,
} from "@/lib/ai-chat";
import { chatAnonymousCookie, resolveChatAccess, type ChatAccess } from "@/lib/chat-access";
import {
  billChatTime,
  getChatBilling,
  refundChatTime,
  type ChatCharge,
} from "@/lib/chat-billing";
import { isChatUuid } from "@/lib/chat-quota-rules";
import type { ChatBillingSummary } from "@/lib/chat-billing-rules";
import { ensureAdvanced } from "@/lib/astro/hydrate";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

interface Body {
  readingId?: unknown;
  messages?: unknown;
}

interface ProviderResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

function chatJson(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
  access?: ChatAccess,
) {
  const res = NextResponse.json(body, {
    status: init.status,
    headers: { "Cache-Control": "no-store", ...(init.headers ?? {}) },
  });
  if (access?.newAnonymousId) {
    res.cookies.set(chatAnonymousCookie(access.newAnonymousId));
  }
  return res;
}

/**
 * AI Panditji chat.
 *
 * - The chart summary is built server-side; birth details never leave the app.
 * - Chat costs 10 coins per message. Pro reports include 50 messages.
 *   The coins are reserved before the provider call and refunded if the call
 *   fails, so a 502 never costs the reader a coin.
 * - Chat history is not stored; only the current request is forwarded.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60_000);
  if (!limit.ok) {
    return chatJson(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return chatJson({ error: "invalid_json" }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages) {
    return chatJson({ error: "invalid_messages" }, { status: 400 });
  }

  const readingId = typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (readingId && !isChatUuid(readingId)) {
    return chatJson({ error: "invalid_reading" }, { status: 400 });
  }

  const config = getChatConfig();
  if (!config.configured) {
    return chatJson({ error: "chat_not_configured" }, { status: 503 });
  }

  let access: ChatAccess;
  try {
    access = await resolveChatAccess(readingId || null);
  } catch (error) {
    console.error(
      "[chat] could not resolve access:",
      error instanceof Error ? error.message : "unknown",
    );
    return chatJson({ error: "chat_unavailable" }, { status: 503 });
  }

  if (readingId && !access.reading) {
    return chatJson({ error: "reading_not_found" }, { status: 404 }, access);
  }

  const readingContext = access.reading
    ? buildReadingContext(ensureAdvanced(access.reading))
    : null;

  let billing: ChatBillingSummary;
  let charge: ChatCharge | null = null;
  try {
    const result = await billChatTime({
      subject: access.subject,
      userId: access.user?.id ?? null,
      plan: access.plan,
    });
    billing = result.billing;
    if (!result.ok) {
      return chatJson(
        { error: "insufficient_coins", billing, coinsNeeded: result.coinsNeeded },
        { status: 402 },
        access,
      );
    }
    charge = result.charge;
  } catch (error) {
    console.error(
      "[chat] billing failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return chatJson({ error: "chat_billing_unavailable" }, { status: 503 }, access);
  }

  const releaseCharge = async () => {
    if (!charge) return;
    const reserved = charge;
    charge = null;
    try {
      await refundChatTime(reserved);
    } catch (error) {
      console.error(
        "[chat] refund failed:",
        error instanceof Error ? error.message : "unknown",
      );
    }
    try {
      // The 502 response should show the refunded balance, not the temporary
      // reservation that was taken before the provider call.
      billing = await getChatBilling(access.subject, access.plan, access.user?.id ?? null);
    } catch {
      /* keep the last known summary */
    }
  };

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.7,
        max_tokens: config.maxOutputTokens,
        ...(config.reasoningEffort ? { reasoning_effort: config.reasoningEffort } : {}),
        messages: [
          { role: "system", content: buildSystemPrompt(readingContext) },
          ...messages,
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    const data = (await res.json().catch(() => null)) as ProviderResponse | null;
    if (!res.ok) {
      console.error(
        "[chat] provider error:",
        res.status,
        data?.error?.message?.slice(0, 300) ?? "unknown",
      );
      await releaseCharge();
      return chatJson({ error: "chat_provider_error", billing }, { status: 502 }, access);
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      await releaseCharge();
      return chatJson({ error: "empty_reply", billing }, { status: 502 }, access);
    }

    return chatJson({ reply: reply.slice(0, 4000), billing }, {}, access);
  } catch (error) {
    console.error(
      "[chat] request failed:",
      error instanceof Error ? error.message : "unknown",
    );
    await releaseCharge();
    return chatJson({ error: "chat_failed", billing }, { status: 502 }, access);
  }
}
