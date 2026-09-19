import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { computeChart } from "@/lib/astrology";
import { toReadingSummary } from "@/lib/dto";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(readings).where(eq(readings.userId, user.id)).orderBy(desc(readings.createdAt));
  return NextResponse.json({ readings: rows.map(toReadingSummary) });
}

interface Body {
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  timeUnknown?: boolean;
  placeName?: string;
  latitude?: number;
  longitude?: number;
  tzOffset?: number;
  palmImage?: string | null;
  palmHand?: string | null;
  title?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = (body.fullName ?? "").trim();
  const birthDate = body.birthDate ?? "";
  const birthTime = /^\d{2}:\d{2}$/.test(body.birthTime ?? "") ? (body.birthTime as string) : "12:00";
  const placeName = (body.placeName ?? "").trim();
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const tzOffset = Number.isFinite(Number(body.tzOffset)) ? Number(body.tzOffset) : 5.5;

  if (fullName.length < 2 || fullName.length > 80) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(Date.parse(birthDate))) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  if (!placeName || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 89.9 || Math.abs(longitude) > 180)
    return NextResponse.json({ error: "Invalid place" }, { status: 400 });
  const palmImage = typeof body.palmImage === "string" && body.palmImage.startsWith("data:image/") && body.palmImage.length < 2_500_000 ? body.palmImage : null;
  const palmHand = body.palmHand === "left" || body.palmHand === "right" ? body.palmHand : null;

  let result;
  try {
    result = computeChart({ date: birthDate, time: birthTime, latitude, longitude, tzOffset });
  } catch {
    return NextResponse.json({ error: "Calculation failed" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const [row] = await db
    .insert(readings)
    .values({
      userId: user?.id ?? null,
      title: (body.title ?? "").trim() || `${fullName.split(" ")[0]} — Kundli`,
      fullName,
      birthDate,
      birthTime,
      timeUnknown: !!body.timeUnknown,
      placeName,
      latitude,
      longitude,
      tzOffset,
      result,
      palmImage,
      palmHand,
    })
    .returning();

  return NextResponse.json({ id: row.id, result }, { status: 201 });
}
