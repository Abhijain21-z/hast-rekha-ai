import Hero from "@/components/home/Hero";
import PalmLines from "@/components/home/PalmLines";
import HowItWorks from "@/components/home/HowItWorks";
import ZodiacShowcase from "@/components/home/ZodiacShowcase";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import Reviews from "@/components/home/Reviews";
import About from "@/components/home/About";
import RishisSection from "@/components/home/RishisSection";
import ConstellationBackdrop from "@/components/layout/Constellations";

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
        <About />
      </div>
    </div>
  );
}
