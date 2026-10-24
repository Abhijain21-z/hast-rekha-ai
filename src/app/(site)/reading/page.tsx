import { Suspense } from "react";
import type { Metadata } from "next";
import ReadingForm from "@/components/reading/ReadingForm";
import { Spinner } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Free Hast Rekha Reading — Palm + Kundli | Hast Rekha AI",
  description:
    "Enter your birth details and get a free palmistry + kundli reading in Hindi or English — rashi, nakshatra, career, love, health and money, instantly.",
  alternates: { canonical: "/reading" },
  openGraph: {
    type: "website",
    url: "/reading",
    siteName: "Hast Rekha AI",
    title: "Free Hast Rekha Reading — Palm + Kundli",
    description:
      "Free palmistry and kundli reading — rashi, nakshatra, career, love, health and money in one report.",
  },
};

export default async function ReadingPage() {
  const user = await getCurrentUser();
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>}>
      <ReadingForm loggedIn={!!user} />
    </Suspense>
  );
}
