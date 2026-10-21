import { and, eq, gt, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { reviewArchive, reviews } from "@/db/schema";

/** Public lifetime of a negative review before it moves to the archive. */
export const NEGATIVE_REVIEW_TTL_MS = 60 * 60 * 1000;

/** 1–3 stars are treated as negative. Change this one number to tune it. */
export const NEGATIVE_REVIEW_MAX_RATING = 3;

export function isNegativeReview(rating: number) {
  return rating <= NEGATIVE_REVIEW_MAX_RATING;
}

export function negativeReviewExpiresAt(now = new Date()) {
  return new Date(now.getTime() + NEGATIVE_REVIEW_TTL_MS);
}

/**
 * Public reviews are positive reviews plus negative reviews that are still
 * inside their one-hour window. The `is_negative = false` branch matters for
 * old rows created before this feature existed.
 */
export function reviewVisibilityWhere(now = new Date()) {
  return or(eq(reviews.isNegative, false), gt(reviews.expiresAt, now));
}

/**
 * Move expired negative reviews out of the public table into the owner-only
 * archive. Safe to call on every reviews request — it is a no-op when nothing
 * has expired. A limit keeps a busy first request from doing too much work.
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
