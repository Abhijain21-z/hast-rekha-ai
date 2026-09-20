import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Hast Rekha AI | सेवा की शर्तें",
  description: "Terms of Service for Hast Rekha AI — rules for using our free astrology and palmistry reading platform.",
};

export default function TermsPage() {
  return <LegalPage doc={legal.terms as LegalDoc} />;
}
