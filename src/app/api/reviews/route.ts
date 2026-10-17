import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Interface rating codes the form can send. */
const INTERFACE = new Set(["great", "good", "okay", "poor"]);

export async function GET(req: Request) {
  // The home carousel only needs the newest handful; the Public Reviews page
  // asks for the full list.
  const full = new URL(req.url).searchParams.get("all") === "1";
  const rows = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(full ? 200 : 50);
  return NextResponse.json({ reviews: rows });
}

export async function POST(req: Request) {
  const limit = rateLimit(`reviews:${clientIp(req)}`, 3, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    rating?: number;
    text?: string;
    lang?: string;
    interfaceRating?: string;
    agrees?: boolean | null;
  };
  const name = (body.name ?? "").trim();
  const text = (body.text ?? "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));
  if (name.length < 2) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  if (text.length < 10) return NextResponse.json({ error: "Text too short" }, { status: 400 });

  // Answering the survey questions is optional — never reject a review over them.
  const interfaceRating = body.interfaceRating && INTERFACE.has(body.interfaceRating) ? body.interfaceRating : null;
  const agrees = typeof body.agrees === "boolean" ? body.agrees : null;

  const user = await getCurrentUser();
  const [row] = await db
    .insert(reviews)
    .values({
      userId: user?.id ?? null,
      name: name.slice(0, 80),
      rating,
      text: text.slice(0, 1200),
      lang: body.lang === "en" ? "en" : "hi",
      interfaceRating,
      agrees,
    })
    .returning();
  return NextResponse.json({ review: row }, { status: 201 });
}
