import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(50);
  return NextResponse.json({ reviews: rows });
}

export async function POST(req: Request) {
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
