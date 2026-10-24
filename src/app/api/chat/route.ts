import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import {
  buildReadingContext,
  buildSystemPrompt,
  getChatConfig,
  sanitizeMessages,
} from "@/lib/ai-chat";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ensureAdvanced } from "@/lib/astro/hydrate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Body {
  readingId?: unknown;
  messages?: unknown;
}

interface ProviderResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

/**
 * Minimal AI astrology chat.
 *
 * - The chart summary is built server-side; birth details never leave the app.
 * - The endpoint is inert until an OpenAI-compatible key is configured.
 * - Chat history is not stored; only the current request is forwarded.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages) {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }

  const readingId = typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (readingId && !UUID.test(readingId)) {
    return NextResponse.json({ error: "invalid_reading" }, { status: 400 });
  }

  const config = getChatConfig();
  if (!config.configured) {
    return NextResponse.json(
      { error: "chat_not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let readingContext: string | null = null;
  if (readingId) {
    const [row] = await db
      .select()
      .from(readings)
      .where(eq(readings.id, readingId))
      .limit(1);
    if (!row) {
      return NextResponse.json({ error: "reading_not_found" }, { status: 404 });
    }
    readingContext = buildReadingContext(ensureAdvanced(row));
  }

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
      return NextResponse.json(
        { error: "chat_provider_error" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "empty_reply" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { reply: reply.slice(0, 4000) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(
      "[chat] request failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      { error: "chat_failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
