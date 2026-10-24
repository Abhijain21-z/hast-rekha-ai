import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { acknowledgeReferralReward } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { id?: string };
  if (typeof body.id !== "string" || body.id.length < 10) {
    return NextResponse.json({ error: "Invalid reward id" }, { status: 400 });
  }

  const ok = await acknowledgeReferralReward(user.id, body.id);
  return NextResponse.json({ ok });
}
