import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import PanditjiPromo from "@/components/home/PanditjiPromo";
import PalmLines from "@/components/home/PalmLines";
import HowItWorks from "@/components/home/HowItWorks";
import ZodiacShowcase from "@/components/home/ZodiacShowcase";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import HomePopup from "@/components/home/HomePopup";
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
        <HomePopup />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center mt-1">
          <p className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100 inline-flex items-center gap-2 shadow-[0_0_20px_-5px] shadow-emerald-400/20 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            अभी से वेबसाइट के उपयोग में आने वाली सभी समस्याओं का समाधान कर लिया गया है।
          </p>
        </div>
        <PanditjiPromo />
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
        {/* Background video — muted loop, low opacity, smooth scroll */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cosmic-900/60 via-[#1a1030]/70 to-mystic-800/40 my-12 mx-4 sm:mx-6 lg:mx-8 p-6 sm:p-12 shadow-2xl shadow-black/20">
          <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none select-none z-0" aria-hidden="true">
            <source src="/assets/krsn.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 text-center">
            <h2 className="font-display text-2xl sm:text-3xl text-white">हस्तरेखा — अपने भविष्य को जानें</h2>
            <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">अपनी हथेली का फोटो अपलोड करें और अपनी कुंडली, 12 जीवन-क्षेत्र और भविष्य की भविष्यवाणी देखें।</p>
          </div>
        </section>
      </div>
    </div>
  );
}
