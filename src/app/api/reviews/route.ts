import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  archiveExpiredNegativeReviews,
  isNegativeReview,
  negativeReviewExpiresAt,
  reviewVisibilityWhere,
} from "@/lib/reviews";

export const dynamic = "force-dynamic";

/** Interface rating codes the form can send. */
const INTERFACE = new Set(["great", "good", "okay", "poor"]);

export async function GET(req: Request) {
  // The home carousel only needs the newest handful; the Public Reviews page
  // asks for the full list.
  const full = new URL(req.url).searchParams.get("all") === "1";
  try {
    // Move anything whose one-hour negative-review window has ended out of the
    // public table. A no-op for positive reviews.
    await archiveExpiredNegativeReviews().catch(() => {});
    const rows = await db
      .select()
      .from(reviews)
      .where(reviewVisibilityWhere())
      .orderBy(desc(reviews.createdAt))
      .limit(full ? 200 : 50);
    return NextResponse.json({ reviews: rows });
  } catch {
    // A database hiccup must not take the page down with a raw 500 — the UI
    // simply shows its empty state.
    return NextResponse.json({ reviews: [], error: "unavailable" }, { status: 200 });
  }
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
  const negative = isNegativeReview(rating);

  try {
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
        isNegative: negative,
        expiresAt: negative ? negativeReviewExpiresAt() : null,
      })
      .returning();
    return NextResponse.json({ review: row }, { status: 201 });
  } catch {
    // Storage problem (e.g. a database that cannot store the script). Answer
    // with a clean error the form can show instead of a stack trace.
    return NextResponse.json({ error: "could_not_save" }, { status: 503 });
  }
}
