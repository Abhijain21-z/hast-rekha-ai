import { and, desc, eq, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { reviewArchive, reviews } from "@/db/schema";

/** Legacy negative-review lifetime; new reviews no longer expire. */
export const NEGATIVE_REVIEW_TTL_MS = 0;

/** 1–3 stars are treated as negative. Change this one number to tune it. */
export const NEGATIVE_REVIEW_MAX_RATING = 3;

export function isNegativeReview(rating: number) {
  return rating <= NEGATIVE_REVIEW_MAX_RATING;
}

/**
 * Public review shape used by the API and the server-rendered reviews page.
 * Archived rows are mapped back into this shape so old reviews keep showing.
 */
export interface PublicReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  lang: string;
  interfaceRating: string | null;
  agrees: boolean | null;
  isNegative: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

/**
 * Every review is public again. Active rows come from `reviews`; rows that
 * were moved to `review_archive` by the old negative-review policy are merged
 * back in, deduped by id, and sorted newest-first.
 */
export async function listPublicReviews(limit = 200): Promise<PublicReview[]> {
  const [active, archived] = await Promise.all([
    db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(limit),
    db.select().from(reviewArchive).orderBy(desc(reviewArchive.createdAt)).limit(limit),
  ]);

  const byId = new Map<string, PublicReview>();

  for (const review of active) {
    byId.set(review.id, {
      id: review.id,
      name: review.name,
      rating: review.rating,
      text: review.text,
      lang: review.lang,
      interfaceRating: review.interfaceRating ?? null,
      agrees: review.agrees ?? null,
      isNegative: review.isNegative || isNegativeReview(review.rating),
      expiresAt: review.expiresAt ?? null,
      createdAt: review.createdAt,
    });
  }

  for (const review of archived) {
    if (byId.has(review.reviewId)) continue;
    byId.set(review.reviewId, {
      id: review.reviewId,
      name: review.name,
      rating: review.rating,
      text: review.text,
      lang: review.lang,
      interfaceRating: review.interfaceRating ?? null,
      agrees: review.agrees ?? null,
      isNegative: isNegativeReview(review.rating),
      expiresAt: null,
      createdAt: review.createdAt,
    });
  }

  return [...byId.values()]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

/**
 * Move expired negative reviews out of the public table into the owner-only
 * archive. Kept for the manual owner route; the public listing no longer
 * calls it, so new negative reviews stay visible.
 */
export async function archiveExpiredNegativeReviews(limit = 200) {
  const now = new Date();
  const expired = await db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.isNegative, true),
        or(lte(reviews.expiresAt, now), isNull(reviews.expiresAt)),
      ),
    )
    .limit(limit);

  if (!expired.length) return 0;

  await db.transaction(async (tx) => {
    await tx
      .insert(reviewArchive)
      .values(
        expired.map((review) => ({
          reviewId: review.id,
          userId: review.userId,
          name: review.name,
          rating: review.rating,
          text: review.text,
          lang: review.lang,
          interfaceRating: review.interfaceRating,
          agrees: review.agrees,
          createdAt: review.createdAt,
          reason: "negative_auto_hide",
        })),
      )
      .onConflictDoNothing();

    await tx.delete(reviews).where(
      inArray(
        reviews.id,
        expired.map((review) => review.id),
      ),
    );
  });

  return expired.length;
}
