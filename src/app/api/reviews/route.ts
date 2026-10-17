import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(50);
  return NextResponse.json({ reviews: rows });
}

export async function POST(req: Request) {
  const limit = rateLimit(`reviews:${clientIp(req)}`, 3, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const body = (await req.json().catch(() => ({}))) as { name?: string; rating?: number; text?: string; lang?: string };
  const name = (body.name ?? "").trim();
  const text = (body.text ?? "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));
  if (name.length < 2) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  if (text.length < 10) return NextResponse.json({ error: "Text too short" }, { status: 400 });
  const user = await getCurrentUser();
  const [row] = await db
    .insert(reviews)
    .values({ userId: user?.id ?? null, name: name.slice(0, 80), rating, text: text.slice(0, 1200), lang: body.lang === "en" ? "en" : "hi" })
    .returning();
  return NextResponse.json({ review: row }, { status: 201 });
}
