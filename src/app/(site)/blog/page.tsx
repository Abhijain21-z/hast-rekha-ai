import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog — हस्तरेखा ज्ञान | Hast Rekha, Ratna, Navagraha, Upay",
  description:
    "हस्तरेखा शास्त्र, नवग्रह, रत्न धारण, उपाय, स्तोत्र, राशि व नक्षत्र पर 15 विस्तृत द्विभाषी लेख। Palmistry, gemstones, remedies and zodiac articles in Hindi & English.",
};

export default function BlogPage() {
  return <BlogList />;
}
