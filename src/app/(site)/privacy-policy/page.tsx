import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Hast Rekha AI | गोपनीयता नीति",
  description:
    "Hast Rekha AI privacy policy — kaunsa data collect hota hai, kaise use hota hai, cookies, payment data aur aapke rights.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={legal.privacy as LegalDoc} />;
}
