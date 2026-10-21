import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import PublicReviews from "@/components/reviews/PublicReviews";
import { archiveExpiredNegativeReviews, reviewVisibilityWhere } from "@/lib/reviews";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews — Hast Rekha AI | समीक्षाएँ",
  description:
    "हस्तरेखा AI पर दिए गए सभी पाठकों के रिव्यू और रेटिंग एक जगह — देखें कि लोगों को इंटरफ़ेस और भविष्यवाणी कैसी लगी, और अपनी समीक्षा भी लिखें।",
  alternates: { canonical: `${SITE_URL}/reviews` },
};

export default async function ReviewsPage() {
  let initial: {
    id: string;
    name: string;
    rating: number;
    text: string;
    interfaceRating: string | null;
    agrees: boolean | null;
    createdAt: string | undefined;
    expiresAt: string | undefined;
  }[] = [];

  try {
    await archiveExpiredNegativeReviews().catch(() => {});
    const rows = await db
      .select()
      .from(reviews)
      .where(reviewVisibilityWhere())
      .orderBy(desc(reviews.createdAt))
      .limit(200);
    initial = rows.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      text: r.text,
      interfaceRating: r.interfaceRating ?? null,
      agrees: r.agrees ?? null,
      createdAt: r.createdAt?.toISOString(),
      expiresAt: r.expiresAt?.toISOString(),
    }));
  } catch {
    // A database hiccup should still render the page (with a friendly empty
    // state) rather than a 500.
    initial = [];
  }

  return <PublicReviews initial={initial} />;
}
