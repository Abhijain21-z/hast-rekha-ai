import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getMembership } from "@/lib/membership";
import MembershipPage from "@/components/membership/MembershipPage";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership — 30 Pro reports in 30 days | Hastrekha AI",
  description:
    "A 30-day Hastrekha AI membership: 30 Pro reports, 5 saved family profiles, and automatic unlocks for ₹1,000. A one-time pass with no auto-renewal.",
  alternates: { canonical: `${SITE_URL}/membership` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/membership`,
    siteName: "Hastrekha AI",
    title: "Membership — 30 Pro reports in 30 days",
    description: "A 30-day pass for family readings: 30 Pro reports, 5 profiles, no auto-renewal.",
    images: [{ url: "/images/hand.png", alt: "Hastrekha AI membership" }],
  },
  robots: { index: true, follow: true },
};

export default async function MembershipRoute() {
  const user = await getCurrentUser().catch(() => null);
  const status = user ? await getMembership(user.id).catch(() => null) : null;

  return (
    <MembershipPage
      signedIn={Boolean(user)}
      status={
        status
          ? {
              active: status.active,
              until: status.until ? status.until.toISOString() : null,
              daysLeft: status.daysLeft,
              reportsUsed: status.reportsUsed,
              reportsLeft: status.reportsLeft,
            }
          : null
      }
    />
  );
}
