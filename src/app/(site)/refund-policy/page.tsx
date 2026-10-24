import type { Metadata } from "next";
import legal from "@/content/legal.json";
import LegalPage, { type LegalDoc } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Hast Rekha AI",
  description:
    "Refund and cancellation policy for Hast Rekha AI paid reports — the ₹51 Pro report and ₹351 Ultra Pro report (digital, instant delivery).",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalPage doc={legal.refunds as LegalDoc} />;
}
