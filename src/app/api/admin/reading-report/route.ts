import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TOKEN = /^[a-f0-9]{32,64}$/i;

interface UploadBody {
  readingId?: string;
  token?: string;
  chunk?: string;
  chunkIndex?: number;
  chunkCount?: number;
}

/**
 * Owner-only upload for a print-ready PDF. The PDF is sent in base64 chunks so
 * it fits within the serverless request limit. The public route is /api/report
 * and only works with the long random token returned here.
 */
export async function POST(req: Request) {
  const expected = process.env.REVIEWS_ADMIN_KEY ?? "";
  const provided = req.headers.get("x-admin-key") ?? "";
  if (!expected || provided !== expected) {
    return new NextResponse("Not found", { status: 404 });
  }

  let body: UploadBody;
  try {
    body = (await req.json()) as UploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const readingId = (body.readingId ?? "").trim();
  const chunk = body.chunk ?? "";
  const chunkIndex = Number(body.chunkIndex);
  const chunkCount = Number(body.chunkCount);
  const token = TOKEN.test(body.token ?? "") ? (body.token as string) : randomBytes(24).toString("hex");

  if (!UUID.test(readingId) || !chunk) {
    return NextResponse.json({ error: "readingId and chunk are required" }, { status: 400 });
  }
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0 || !Number.isInteger(chunkCount) || chunkCount < 1 || chunkIndex >= chunkCount) {
    return NextResponse.json({ error: "Invalid chunk position" }, { status: 400 });
  }
  if (chunk.length > 4_000_000) {
    return NextResponse.json({ error: "Chunk too large" }, { status: 413 });
  }

  await db.execute(sql`
    insert into reading_report_chunks (reading_id, token, chunk_index, chunk_count, data)
    values (${readingId}, ${token}, ${chunkIndex}, ${chunkCount}, ${chunk})
    on conflict (reading_id, chunk_index) do update set
      token = excluded.token,
      chunk_count = excluded.chunk_count,
      data = excluded.data,
      created_at = now()
  `);

  const countResult = await db.execute(sql`
    select count(*)::int as uploaded
    from reading_report_chunks
    where token = ${token}
  `);
  const uploaded = Number((countResult.rows[0] as { uploaded?: number } | undefined)?.uploaded ?? 0);

  return NextResponse.json({
    token,
    uploaded,
    chunkCount,
    complete: uploaded >= chunkCount,
    url: `/api/report/${token}`,
  });
}
