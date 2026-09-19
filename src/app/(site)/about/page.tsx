import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "About Us — Hast Rekha AI | हमारे बारे में" };

export default function AboutPage() {
  return <LegalPage doc={legal.about as LegalDoc} eyebrow="✦ About" />;
}
