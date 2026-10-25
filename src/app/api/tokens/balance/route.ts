import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Lightweight balance read for the live coin chip in the header. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    { signedIn: Boolean(user), balance: user?.tokenBalance ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
