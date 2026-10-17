import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { isValidEmail } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 3, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const body = (await req.json().catch(() => ({}))) as { name?: string; email?: string; message?: string };
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const message = (body.message ?? "").trim();
  if (name.length < 2 || !isValidEmail(email) || message.length < 5) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await db.insert(contactMessages).values({ name: name.slice(0, 80), email: email.slice(0, 120), message: message.slice(0, 2000) });
  return NextResponse.json({ ok: true }, { status: 201 });
}
