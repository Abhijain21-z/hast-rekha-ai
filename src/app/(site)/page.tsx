import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import PalmLines from "@/components/home/PalmLines";
import HowItWorks from "@/components/home/HowItWorks";
import ZodiacShowcase from "@/components/home/ZodiacShowcase";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import Reviews from "@/components/home/Reviews";
import FAQ from "@/components/home/FAQ";
import FaqJsonLd from "@/components/home/FaqJsonLd";
import About from "@/components/home/About";
import RishisSection from "@/components/home/RishisSection";
import ConstellationBackdrop from "@/components/layout/Constellations";
import { SITE_URL } from "@/lib/site";

/**
 * The home page carries the primary keywords in its own title/description
 * instead of inheriting the layout default, and points a canonical at the
 * clean URL so the ?lang= variants never compete with it.
 */
export const metadata: Metadata = {
  title: "हस्तरेखा AI — Palmistry, Hath Ki Rekha & Kundli Vishleshan",
  description:
    "हस्तरेखा पामिस्ट्री और कुंडली का फ्री विश्लेषण — हाथ की रेखा (hath ki rekha) का मतलब, राशि, नक्षत्र और 12 जीवन-क्षेत्र, हिंदी व English में।",
  keywords: [
    "hastrekha palmistry",
    "hast rekha palmistry",
    "हस्तरेखा",
    "हाथ की रेखा",
    "hath ki rekha",
    "palmistry in hindi",
    "free palm reading",
    "palm lines meaning",
    "हस्तरेखा पढ़े",
    "कुंडली",
    "हस्तरेखा से भविष्य",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hast Rekha AI",
    title: "Hastrekha Palmistry — Hast Rekha AI",
    description:
      "Free palm reading and Kundli analysis — palm lines, Rashi, Nakshatra and 12 life areas, in Hindi and English.",
    images: [{ url: "/images/hand.png", width: 832, height: 1216, alt: "Golden palm with glowing hast rekha lines" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hastrekha Palmistry — Hast Rekha AI",
    description: "Free palm reading and Kundli analysis, Hindi and English.",
    images: ["/images/hand.png"],
  },
};

export default function HomePage() {
  return (
    <div className="relative">
      <ConstellationBackdrop />
      <div className="relative">
        <Hero />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="section-divider mt-6" /></div>
        <PalmLines />
        <RishisSection />
        <HowItWorks />
        <ZodiacShowcase />
        <Features />
        <Pricing />
        <Reviews />
        <FAQ />
        <FaqJsonLd />
        <About />
      </div>
    </div>
  );
}
