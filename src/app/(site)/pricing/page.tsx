import type { Metadata } from "next";
import PricingPage from "@/components/pricing/PricingPage";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Hast Rekha AI | मूल्य",
  description:
    "हस्तरेखा AI का पूरा फ्री प्लान और ₹51 का प्रो प्लान — 5 वर्षों का वर्ष-दर-वर्ष रोडमैप, उपाय, रत्न विधि, PDF डाउनलोड, और अविवाहित हों तो होने वाले जीवनसाथी की पूरी भविष्यवाणी।",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingRoute() {
  return <PricingPage />;
}
