import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { computeChart } from "@/lib/astrology";
import { RASHIS } from "@/lib/content";
import { toReadingSummary } from "@/lib/dto";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { upsertWhatsAppSubscriber } from "@/lib/whatsapp-subscribers";

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
  gender?: string | null;
  married?: boolean | null;
  whatsappPhone?: string | null;
  /** Separate, explicit consent for the 3x/week marketing message. */
  dailyRashifalOptIn?: boolean;
  title?: string;
}

export async function POST(req: Request) {
  const limit = rateLimit(`readings:${clientIp(req)}`, 20, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

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
  const gender = body.gender === "male" || body.gender === "female" || body.gender === "trans" ? body.gender : null;
  if (!gender) return NextResponse.json({ error: "Gender is required" }, { status: 400 });
  const married = typeof body.married === "boolean" ? body.married : null;
  if (married === null) return NextResponse.json({ error: "Marital status is required" }, { status: 400 });
  const whatsappPhone = typeof body.whatsappPhone === "string" ? body.whatsappPhone.replace(/\D/g, "") : "";
  if (!/^[6-9]\d{9}$/.test(whatsappPhone)) {
    return NextResponse.json({ error: "WhatsApp number is required" }, { status: 400 });
  }
  const dailyRashifalOptIn = body.dailyRashifalOptIn === true;

  let result;
  try {
    result = computeChart({ date: birthDate, time: birthTime, latitude, longitude, tzOffset }, { fullName });
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
      gender,
      married,
      whatsappPhone,
    })
    .returning();

  if (dailyRashifalOptIn && whatsappPhone) {
    const rashiKey = RASHIS[result.moonRashi]?.key;
    if (rashiKey) {
      try {
        await upsertWhatsAppSubscriber({
          phone: whatsappPhone,
          name: fullName,
          rashiKey,
          readingId: row.id,
          source: "reading_form",
        });
      } catch (error) {
        // The reading itself must not fail because the optional subscription did.
        console.error(
          "[whatsapp] daily opt-in save failed:",
          error instanceof Error ? error.message : error,
        );
      }
    }
  }

  return NextResponse.json({ id: row.id, result }, { status: 201 });
}
