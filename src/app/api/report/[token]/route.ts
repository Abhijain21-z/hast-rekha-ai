import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const TOKEN = /^[a-f0-9]{32,64}$/i;

interface ReportRow {
  chunk_index: number;
  chunk_count: number;
  data: string;
  full_name: string | null;
}

/** Long, unguessable download link for an owner-generated report PDF. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!TOKEN.test(token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const result = await db.execute(sql`
    select c.chunk_index, c.chunk_count, c.data, r.full_name
    from reading_report_chunks c
    join readings r on r.id = c.reading_id
    where c.token = ${token}
    order by c.chunk_index asc
    limit 1000
  `);
  const rows = result.rows as unknown as ReportRow[];

  if (!rows.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const chunkCount = Number(rows[0].chunk_count);
  if (rows.length !== chunkCount) {
    return new NextResponse("Not found", { status: 404 });
  }
  for (let index = 0; index < rows.length; index += 1) {
    if (rows[index].chunk_index !== index || rows[index].chunk_count !== chunkCount) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  const pdf = Buffer.concat(rows.map((row) => Buffer.from(row.data, "base64")));
  if (pdf.length < 5 || pdf.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": 'attachment; filename="HastRekhaAI-Report.pdf"',
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
