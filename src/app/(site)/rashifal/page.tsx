import type { Metadata } from "next";
import RashifalExplorer from "@/components/rashifal/RashifalExplorer";
import { rashiIndexFromKey } from "@/lib/rashifal";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aaj Ka Rashifal, Kal Ka Rashifal Aur Weekly Rashifal | Hast Rekha AI",
  description:
    "Aaj ka rashifal, kal ka rashifal aur is hafte ka rashifal apni rashi ke hisaab se padhein. Mesha se Meena tak 12 rashiyon ke liye daily, tomorrow aur weekly horoscope — career, love, health, finance, lucky number aur simple upay ke saath.",
  keywords: [
    "aaj ka rashifal",
    "kal ka rashifal",
    "weekly rashifal",
    "is hafte ka rashifal",
    "daily horoscope hindi",
    "tomorrow horoscope",
    "rashifal by rashi",
    "mesh rashifal",
    "vrishabha rashifal",
    "hast rekha ai rashifal",
  ],
  alternates: { canonical: "/rashifal" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/rashifal`,
    siteName: "Hast Rekha AI",
    title: "Aaj Ka Rashifal, Kal Ka Rashifal Aur Weekly Rashifal",
    description:
      "12 rashiyon ke liye aaj, kal aur is hafte ka rashifal — career, love, health, finance aur lucky factors ke saath.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaj Ka Rashifal, Kal Ka Rashifal Aur Weekly Rashifal",
    description:
      "Apni rashi chunein aur aaj, kal aur is hafte ka rashifal free mein padhein.",
  },
};

export default async function RashifalPage({
  searchParams,
}: {
  searchParams: Promise<{ sign?: string | string[] }>;
}) {
  const params = await searchParams;
  const sign = Array.isArray(params.sign) ? params.sign[0] : params.sign;
  return <RashifalExplorer initialIndex={rashiIndexFromKey(sign)} />;
}
