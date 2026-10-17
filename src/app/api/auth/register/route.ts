import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword, isValidEmail, SESSION_COOKIE, sessionCookieOptions, toSafeUser } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limit = rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const body = (await req.json().catch(() => ({}))) as { name?: string; email?: string; password?: string; lang?: string };
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (name.length < 2) return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "short_password" }, { status: 400 });

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) return NextResponse.json({ error: "exists" }, { status: 409 });

  const [user] = await db
    .insert(users)
    .values({ name: name.slice(0, 80), email, passwordHash: await hashPassword(password), preferredLang: body.lang === "hi" ? "hi" : "en" })
    .returning();

  const { token, expiresAt } = await createSession(user.id);
  const res = NextResponse.json({ user: toSafeUser(user) }, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return res;
}
