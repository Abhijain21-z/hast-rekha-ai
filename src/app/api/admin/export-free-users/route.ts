import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { readings } from "@/db/schema";
import { isAdminKey } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * GET /api/admin/export-free-users
 *
 * Exports all FREE users (premium = false) as a CSV file.
 * Protect with x-cron-secret (CRON_SECRET) or the owner key
 * (x-admin-key header, or ?key= for a plain browser download).
 *
 * Query params:
 *   format - "csv" (default) or "json"
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "csv";

  // Two ways in: the cron secret (machine) or the owner key in the URL, so the
  // admin page can offer a plain download link.
  const cronOk = Boolean(process.env.CRON_SECRET) && req.headers.get("x-cron-secret") === process.env.CRON_SECRET;
  const adminOk = isAdminKey(req.headers.get("x-admin-key")) || isAdminKey(url.searchParams.get("key"));
  if (!cronOk && !adminOk) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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
