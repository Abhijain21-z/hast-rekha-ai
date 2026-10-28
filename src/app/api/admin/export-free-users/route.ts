import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * GET /api/admin/export-free-users
 *
 * Exports all FREE users (premium = false) as a CSV file.
 * Protect with x-cron-secret header matching CRON_SECRET env var.
 *
 * Query params:
 *   format - "csv" (default) or "json"
 */
export async function GET(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "csv";

  // Find all FREE readers (not premium)
  const rows = await db
    .select({
      id: readings.id,
      fullName: readings.fullName,
      birthDate: readings.birthDate,
      birthTime: readings.birthTime,
      placeName: readings.placeName,
      gender: readings.gender,
      married: readings.married,
      whatsappPhone: readings.whatsappPhone,
      marketingOptIn: readings.marketingOptIn,
      premium: readings.premium,
      createdAt: readings.createdAt,
    })
    .from(readings)
    .where(eq(readings.premium, false))
    .orderBy(desc(readings.createdAt));

  if (format === "json") {
    return NextResponse.json({
      total: rows.length,
      users: rows,
    });
  }

  // Build CSV
  const headers = [
    "ID",
    "Name",
    "Birth Date",
    "Birth Time",
    "Place",
    "Gender",
    "Married",
    "WhatsApp Phone",
    "Marketing Opt-in",
    "Premium",
    "Created At",
  ];

  const csvRows = rows.map((r) => [
    r.id,
    `"${(r.fullName ?? "").replace(/"/g, '""')}"`,
    r.birthDate ?? "",
    r.birthTime ?? "",
    `"${(r.placeName ?? "").replace(/"/g, '""')}"`,
    r.gender ?? "",
    r.married ? "Yes" : "No",
    r.whatsappPhone ?? "",
    r.marketingOptIn ? "Yes" : "No",
    r.premium ? "Yes" : "No",
    r.createdAt ?? "",
  ]);

  const csvContent = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="free-users-${new Date().toISOString().split("T")[0]}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
