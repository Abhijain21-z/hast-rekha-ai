import { NextResponse } from "next/server";
import { chatAnonymousCookie, resolveChatAccess } from "@/lib/chat-access";
import { getChatBilling } from "@/lib/chat-billing";
import { isChatUuid } from "@/lib/chat-quota-rules";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Current coin balance, Pro minutes and active session for this reader/guest. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawReadingId = url.searchParams.get("readingId")?.trim() ?? "";
  if (rawReadingId && !isChatUuid(rawReadingId)) {
    return NextResponse.json({ error: "invalid_reading" }, { status: 400 });
  }
  const readingId = rawReadingId || null;

  let access;
  try {
    access = await resolveChatAccess(readingId);
  } catch (error) {
    console.error(
      "[chat] billing access failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      { error: "billing_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (readingId && !access.reading) {
    return NextResponse.json({ error: "reading_not_found" }, { status: 404 });
  }

  try {
    const billing = await getChatBilling(
      access.subject,
      access.plan,
      access.user?.id ?? null,
    );
    const res = NextResponse.json(
      { billing, readingId },
      { headers: { "Cache-Control": "no-store" } },
    );
    if (access.newAnonymousId) {
      res.cookies.set(chatAnonymousCookie(access.newAnonymousId));
    }
    return res;
  } catch (error) {
    console.error(
      "[chat] billing read failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return NextResponse.json(
      { error: "billing_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
