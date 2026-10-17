import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import PublicReviews from "@/components/reviews/PublicReviews";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public Reviews — Hast Rekha AI | सार्वजनिक समीक्षाएँ",
  description:
    "हस्तरेखा AI पर दिए गए सभी पाठकों के रिव्यू और रेटिंग एक जगह — देखें कि लोगों को इंटरफ़ेस और भविष्यवाणी कैसी लगी, और अपनी समीक्षा भी लिखें।",
  alternates: { canonical: `${SITE_URL}/reviews` },
};

export default async function PublicReviewsPage() {
  let initial: {
    id: string;
    name: string;
    rating: number;
    text: string;
    interfaceRating: string | null;
    agrees: boolean | null;
    createdAt: string | undefined;
  }[] = [];

  try {
    const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(200);
    initial = rows.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      text: r.text,
      interfaceRating: r.interfaceRating ?? null,
      agrees: r.agrees ?? null,
      createdAt: r.createdAt?.toISOString(),
    }));
  } catch {
    // A database hiccup should still render the page (with a friendly empty
    // state) rather than a 500.
    initial = [];
  }

  return <PublicReviews initial={initial} />;
}
