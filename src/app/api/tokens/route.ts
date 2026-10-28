import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTokenWallet } from "@/lib/tokens";

export const dynamic = "force-dynamic";

/** The signed-in user's coin wallet, used by the dashboard and chat. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wallet = await getTokenWallet(user.id);
  return NextResponse.json(wallet);
}
