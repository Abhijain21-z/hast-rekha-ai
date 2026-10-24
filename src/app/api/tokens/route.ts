import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  REFERRAL_TOKEN_REWARD,
  ULTRA_PRICE_INR,
  ULTRA_TOKEN_COST,
  ensureReferralCode,
  getTokenWallet,
  referralLink,
  tokenProgress,
} from "@/lib/tokens";

export const dynamic = "force-dynamic";

/** The signed-in user's wallet + referral link, used by the dashboard and paywall. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [wallet, code] = await Promise.all([getTokenWallet(user.id), ensureReferralCode(user.id)]);
  return NextResponse.json({
    ...wallet,
    progress: tokenProgress(wallet.balance),
    referralCode: code,
    referralLink: code ? referralLink(code) : null,
    referralReward: REFERRAL_TOKEN_REWARD,
    ultraTokenCost: ULTRA_TOKEN_COST,
    ultraPriceInr: ULTRA_PRICE_INR,
  });
}
