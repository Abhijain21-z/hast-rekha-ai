/**
 * Resolve who is chatting and which allowance applies.
 *
 * Signed-in readers share one wallet and session across devices
 * (`user:<uuid>`). Guests get a long-lived HttpOnly browser id (`anon:<uuid>`),
 * so creating another reading does not hand them a new coin wallet.
 */
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { readings, type Reading } from "@/db/schema";
import { getCurrentUser, type SafeUser } from "./auth";
import { resolveChatPlan } from "./chat-billing";
import {
  CHAT_ANON_COOKIE,
  CHAT_ANON_COOKIE_DAYS,
  chatSubject,
  isChatUuid,
  type ChatPlan,
} from "./chat-quota-rules";

export interface ChatAccess {
  user: SafeUser | null;
  reading: Reading | null;
  subject: string;
  plan: ChatPlan;
  /** Set only when a new guest id was minted; the response must set the cookie. */
  newAnonymousId: string | null;
}

export async function resolveChatAccess(readingId?: string | null): Promise<ChatAccess> {
  const [user, store] = await Promise.all([getCurrentUser(), cookies()]);

  let reading: Reading | null = null;
  if (readingId) {
    const [row] = await db
      .select()
      .from(readings)
      .where(eq(readings.id, readingId))
      .limit(1);
    reading = row ?? null;
  }

  let anonymousId = store.get(CHAT_ANON_COOKIE)?.value ?? "";
  let newAnonymousId: string | null = null;
  if (!user && !isChatUuid(anonymousId)) {
    anonymousId = randomUUID();
    newAnonymousId = anonymousId;
  }

  const plan = await resolveChatPlan(user?.id ?? null, reading);
  return {
    user,
    reading,
    plan,
    subject: chatSubject(user?.id ?? null, anonymousId),
    newAnonymousId,
  };
}

export function chatAnonymousCookie(value: string) {
  return {
    name: CHAT_ANON_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CHAT_ANON_COOKIE_DAYS * 86400,
  };
}
