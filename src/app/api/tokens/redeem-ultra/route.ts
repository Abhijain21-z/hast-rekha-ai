import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toReadingDTO } from "@/lib/dto";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { TokenRedemptionError, redeemUltraWithTokens } from "@/lib/tokens";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Spend 350 tokens on one Ultra Pro reading. Pro (Rs 51) deliberately has no
 * token path: the owner's rule is that Pro must be paid in real money.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limit = rateLimit(`tokens-redeem:${user.id}:${clientIp(req)}`, 6, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const body = (await req.json().catch(() => ({}))) as { readingId?: string };
  const readingId = typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (!UUID.test(readingId)) return NextResponse.json({ error: "invalid_reading" }, { status: 400 });

  try {
    const result = await redeemUltraWithTokens(user.id, readingId);
    return NextResponse.json({
      balance: result.balance,
      alreadyUnlocked: result.alreadyUnlocked,
      reading: result.reading ? toReadingDTO(result.reading) : null,
    });
  } catch (error) {
    if (error instanceof TokenRedemptionError) {
      const status = error.code === "insufficient_tokens" ? 409 : error.code === "not_found" ? 404 : 401;
      return NextResponse.json({ error: error.code, message: error.message }, { status });
    }
    console.error("[tokens] ultra redemption failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "redemption_failed" }, { status: 500 });
  }
}
