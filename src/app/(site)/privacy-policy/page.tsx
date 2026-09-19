import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy — Hast Rekha AI | गोपनीयता नीति" };

export default function PrivacyPage() {
  return <LegalPage doc={legal.privacy as LegalDoc} />;
}
