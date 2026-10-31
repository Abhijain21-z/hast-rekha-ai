import type { Metadata } from "next";
import { cookies } from "next/headers";
import PricingPage from "@/components/pricing/PricingPage";
import PricingFaq from "@/components/pricing/PricingFaq";
import PricingJsonLd from "@/components/pricing/PricingJsonLd";
import { SITE_URL } from "@/lib/site";

/**
 * /pricing carries the "हस्त रेखा price" keyword in its own title and meta,
 * the FAQ block below the plans answers the pre-purchase questions, and the
 * ?lang=en variant is a first-class URL so hreflang stays honest.
 */

export type PricingSearchParams = Promise<Record<string, string | string[] | undefined>>;

const OG_IMAGE = "/images/hand.png";

export async function generateMetadata({ searchParams }: { searchParams: PricingSearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const en = sp.lang === "en";
  const url = `${SITE_URL}/pricing`;
  const canonical = en ? `${url}?lang=en` : url;

  const title = en
    ? "Hast Rekha Price — Free Reading, ₹51 Pro & Membership | Hastrekha AI"
    : "हस्त रेखा Price — फ्री रीडिंग, ₹51 प्रो और मेंबरशिप | Hastrekha AI";
  const description = en
    ? "The core palm reading is free — no login, no card. Pro is ₹51 one time and now includes the Diwali Puja PDF, Pro + book is ₹199, or a ₹1,000 30-day family membership. Printing is a Pro feature."
    : "मूल हस्तरेखा रीडिंग फ्री — बिना लॉगिन, बिना कार्ड। प्रो ₹51 (अब दिवाली पूजा PDF शामिल), प्रो + पुस्तक ₹199, या ₹1,000 का 30-दिन पारिवारिक मेंबरशिप। प्रिंटिंग प्रो सुविधा है।";

  return {
    title,
    description,
    keywords: [
      "हस्त रेखा price",
      "hast rekha price",
      "palm reading price india",
      "free palm reading",
      "₹51 report",
      "hastrekha ai pricing",
      "palmistry report price",
    ],
    alternates: {
      canonical,
      languages: {
        "hi-IN": url,
        "en-IN": `${url}?lang=en`,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Hastrekha AI",
      title,
      description,
      locale: en ? "en_IN" : "hi_IN",
      images: [{ url: OG_IMAGE, alt: "Hastrekha AI pricing — free reading, ₹51 Pro and membership" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export default async function PricingRoute({ searchParams }: { searchParams: PricingSearchParams }) {
  const sp = await searchParams;
  const pinnedLang: "hi" | "en" | undefined = sp.lang === "en" ? "en" : undefined;

  // Match the structured data to the language this response is served in.
  const cookieLang = (await cookies()).get("hr_lang")?.value;
  const jsonLang: "hi" | "en" = pinnedLang ?? (cookieLang === "en" ? "en" : "hi");

  return (
    <>
      <PricingPage />
      <PricingFaq pinnedLang={pinnedLang} />
      <PricingJsonLd lang={jsonLang} />
    </>
  );
}
