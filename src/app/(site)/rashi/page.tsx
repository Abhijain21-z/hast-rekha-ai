import { Suspense } from "react";
import type { Metadata } from "next";
import RashiExplorer from "@/components/rashi/RashiExplorer";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = {
  title: "12 राशियाँ (Rashis) — स्वभाव, प्रेम, करियर | Hast Rekha AI",
  description:
    "12 राशियों (rashis) का पूरा विश्लेषण — मेष से मीन तक स्वभाव, प्रेम, करियर, धन और स्वास्थ्य, साथ में राशि मिलान (compatibility) और दैनिक राशिफल — हिंदी और English में।",
  alternates: { canonical: "/rashi" },
  openGraph: {
    title: "12 राशियाँ (Rashis) — Hast Rekha AI",
    description: "मेष से मीन तक हर राशि का स्वभाव, प्रेम, करियर और दैनिक राशिफल — हिंदी और English में।",
    url: "/rashi",
  },
  twitter: {
    card: "summary_large_image",
    title: "12 राशियाँ (Rashis) — Hast Rekha AI",
    description: "मेष से मीन तक हर राशि का स्वभाव, प्रेम, करियर और राशिफल।",
  },
};

export default function RashiPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>}>
      <RashiExplorer />
    </Suspense>
  );
}
