import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import StarField from "@/components/layout/StarField";
import AmbientMusic from "@/components/layout/AmbientMusic";
import FloatingHand from "@/components/layout/FloatingHand";
import { LANGS } from "@/lib/lang-overrides";
import type { Lang } from "@/lib/i18n";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://hastrekhaai.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "हस्तरेखा AI — Palmistry, Hath Ki Rekha & Kundali Vishleshan | Hast Rekha AI",
  description:
    "Palmistry और हस्तरेखा से जानें अपना भविष्य — हाथ की रेखा (hath ki rekha) का सटीक विश्लेषण, मेरे हाथ की रेखा, हस्त रेखा पढ़े, साथ में कुंडली का सटीक विश्लेषण — राशि, नक्षत्र, लग्न और विस्तृत रिपोर्ट, हिंदी व English में, तुरंत और निःशुल्क।",
  keywords: [
    "palmistry", "hast rekha", "हस्तरेखा", "हथ की रेखा", "hath ki rekha", "हाथ की रेखा से जाने अपना भविष्य",
    "मेरे हाथ की रेखा", "हस्त रेखा पढे", "हस्तरेखा शास्त्र", "hast rekha shastra", "palm lines meaning",
    "palm reading", "hand lines", "kundali", "कुंडली", "kundli vishleshan", "कुंडली का सटीक विश्लेषण",
    "राशिफल", "rashi", "nakshatra", "lagna", "jyotish", "vedic astrology", "हस्तरेखा से भविष्य",
    "palmistry in hindi", "हथेली की रेखाएं", "heart line", "life line", "भविष्य जाने",
  ],
  alternates: { languages: { hi: "/", en: "/" } },
  openGraph: {
    type: "website",
    siteName: "Hast Rekha AI",
    title: "Hast Rekha AI — Vedic Astrology & Palmistry",
    description: "Rashi, Nakshatra, Lagna and a complete palm-reading report — bilingual, instant, rule-based.",
    images: [{ url: "/images/hand.png", width: 832, height: 1216, alt: "Golden palm with glowing lines" }],
  },
  twitter: { card: "summary_large_image", title: "Hast Rekha AI", description: "Vedic astrology & palmistry, bilingual.", images: ["/images/hand.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0b0618",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  // Hindi is the default language; others only when the visitor explicitly chose them.
  const cookieLang = store.get("hr_lang")?.value;
  const lang: Lang = cookieLang && (cookieLang === "en" || cookieLang === "hi" || LANGS.some((l) => l.code === cookieLang)) ? cookieLang : "hi";
  const langMeta = LANGS.find((l) => l.code === lang);
  const extraFont = langMeta?.font && langMeta.font !== "Noto Sans Devanagari" ? `&family=${langMeta.font.replace(/ /g, "+")}:wght@400;500;600;700` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Hast Rekha AI",
        url: SITE,
        logo: `${SITE}/images/golden-hand.jpg`,
        email: "abhijain.technical@gmail.com",
        telephone: "+91-9522333669",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "Hast Rekha AI",
        url: SITE,
        inLanguage: ["hi", "en"],
        description: "Vedic astrology and palmistry reports in Hindi and English.",
      },
      {
        "@type": "WebApplication",
        name: "Hast Rekha AI",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      },
    ],
  };

  return (
    <html lang={lang} data-lang={lang} dir={lang === "ur" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        {/* Google AdSense — site verification + ads */}
        <meta name="google-adsense-account" content="ca-pub-1067207431102415" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1067207431102415"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Poppins:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700${extraFont}&display=swap`}
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        <LanguageProvider initial={lang}>
          <ToastProvider>
            <StarField />
            <FloatingHand />
            <div className="relative z-10">{children}</div>
            <AmbientMusic />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
