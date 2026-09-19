import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Disclaimer — Hast Rekha AI | अस्वीकरण" };

export default function DisclaimerPage() {
  return <LegalPage doc={legal.disclaimer as LegalDoc} />;
}
