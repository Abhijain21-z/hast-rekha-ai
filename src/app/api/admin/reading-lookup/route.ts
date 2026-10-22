import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Owner-only support lookup. Used to find a reader's report and payment when
 * they contact us on WhatsApp. Never linked from the website.
 */
export async function GET(req: Request) {
  const expected = process.env.REVIEWS_ADMIN_KEY ?? "";
  const provided = req.headers.get("x-admin-key") ?? "";
  if (!expected || provided !== expected) {
    return new NextResponse("Not found", { status: 404 });
  }

  const params = new URL(req.url).searchParams;
  let phone = (params.get("phone") ?? "").replace(/\D/g, "");
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);

  const email = (params.get("email") ?? "").trim().toLowerCase();
  const name = (params.get("name") ?? "").trim();
  const birthDate = (params.get("birthDate") ?? "").trim();

  if (!phone && !email && !name) {
    return NextResponse.json({ error: "phone, email or name required" }, { status: 400 });
  }

  const result = await db.execute(sql`
    select
      r.id,
      r.full_name,
      r.birth_date,
      r.birth_time,
      r.place_name,
      r.premium,
      r.ultra,
      r.created_at,
      u.email,
      p.order_id,
      p.status as payment_status,
      p.amount,
      p.plan,
      p.customer_phone
    from readings r
    left join users u on u.id = r.user_id
    left join payments p on p.reading_id = r.id
    where
      (${phone} <> '' and right(regexp_replace(coalesce(r.whatsapp_phone, ''), '[^0-9]', '', 'g'), 10) = ${phone})
      or (${email} <> '' and lower(u.email) = ${email})
      or (${name} <> '' and lower(r.full_name) = lower(${name}) and (${birthDate} = '' or r.birth_date = ${birthDate}))
    order by r.created_at desc
    limit 20
  `);

  return NextResponse.json({ rows: result.rows });
}
