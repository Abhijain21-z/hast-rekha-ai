import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPendingReferralReward } from "@/lib/tokens";

export const dynamic = "force-dynamic";

/** Oldest unacknowledged referral reward, consumed by the gift popup. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reward = await getPendingReferralReward(user.id);
  return NextResponse.json({ reward });
}
