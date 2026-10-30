import { and, desc, eq, isNotNull, isNull, or, sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { payments, readings, users } from "@/db/schema";
import { sendProFollowUpTemplate, toIndiaTenDigits } from "@/lib/whatsapp";
import { ensureOutreachTables } from "./outreach-db";

/**
 * Free-reader WhatsApp follow-up sender.
 *
 * Eligibility is intentionally conservative:
 *   - marketing opt-in is true
 *   - the reading is not Pro/Ultra
 *   - the phone has never bought a paid plan and is not an active member
 *   - no follow-up has been sent for that phone yet
 *   - the number is a valid Indian mobile
 *
 * One message per phone number, newest reading wins.
 */

export interface EligibleReader {
  id: string;
  name: string;
  phone: string;
  createdAt: Date | null;
}

export interface FollowUpResult {
  total: number;
  sent: number;
  errors: number;
  skipped: number;
  dryRun: boolean;
  sample?: { name: string; phone: string }[];
  details?: { id: string; phone: string; status: "sent" | "error"; error?: string }[];
  error?: string;
}

export function maskPhone(phone: string): string {
  return `••••••${phone.slice(-4)}`;
}

function templateName(): string {
  return process.env.WHATSAPP_PRO_FOLLOWUP_TEMPLATE_NAME?.trim() || "pro_followup";
}

async function mapLimit<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (true) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(Math.max(concurrency, 1), items.length) }, () => worker()),
  );
  return results;
}

/**
 * Return the next batch of free readers who should receive the Pro follow-up.
 * Paid phones are excluded by looking at both readings and successful payments,
 * so a person who bought Pro on one reading is never messaged about another.
 */
export async function getEligibleFreeReaders(limit = 100): Promise<EligibleReader[]> {
  const batch = Math.min(Math.max(Math.floor(limit), 1), 200);

  const [candidates, paidRows, premiumRows, memberRows] = await Promise.all([
    db
      .select({
        id: readings.id,
        userId: readings.userId,
        name: readings.fullName,
        phone: readings.whatsappPhone,
        createdAt: readings.createdAt,
      })
      .from(readings)
      .where(
        and(
          eq(readings.marketingOptIn, true),
          eq(readings.premium, false),
          eq(readings.ultra, false),
          isNull(readings.followupSentAt),
          isNotNull(readings.whatsappPhone),
        ),
      )
      .orderBy(desc(readings.createdAt))
      .limit(5000),
    db
      .select({ phone: payments.customerPhone })
      .from(payments)
      .where(eq(payments.status, "paid")),
    db
      .select({ phone: readings.whatsappPhone })
      .from(readings)
      .where(or(eq(readings.premium, true), eq(readings.ultra, true))),
    db
      .select({ id: users.id })
      .from(users)
      .where(sql`${users.membershipUntil} > now()`),
  ]);

  const paidPhones = new Set<string>();
  for (const row of paidRows) {
    const phone = toIndiaTenDigits(row.phone);
    if (phone) paidPhones.add(phone);
  }

  const premiumPhones = new Set<string>();
  for (const row of premiumRows) {
    const phone = toIndiaTenDigits(row.phone);
    if (phone) premiumPhones.add(phone);
  }

  const memberIds = new Set(memberRows.map((row) => row.id));

  const seen = new Set<string>();
  const eligible: EligibleReader[] = [];

  for (const row of candidates) {
    const phone = toIndiaTenDigits(row.phone);
    if (!phone) continue;
    if (paidPhones.has(phone) || premiumPhones.has(phone)) continue;
    if (row.userId && memberIds.has(row.userId)) continue;
    if (seen.has(phone)) continue;

    seen.add(phone);
    eligible.push({
      id: row.id,
      name: row.name,
      phone,
      createdAt: row.createdAt,
    });

    if (eligible.length >= batch) break;
  }

  return eligible;
}

/**
 * Send the approved `pro_followup` template to the next eligible batch.
 *
 * Sends run with a small concurrency pool (Meta's Cloud API handles this
 * comfortably) so a 100-message batch finishes inside a Vercel function even
 * on a 60-second plan. Each result is written to `outreach_sends`; the
 * reader's `readings.followup_sent_at` is set only after Meta returns a
 * message id.
 */
export async function sendFollowUps(
  options: { limit?: number; dryRun?: boolean } = {},
): Promise<FollowUpResult> {
  const limit = Math.min(Math.max(Math.floor(options.limit ?? 50), 1), 200);
  const dryRun = options.dryRun === true;

  let eligible: EligibleReader[];
  try {
    eligible = await getEligibleFreeReaders(limit);
  } catch (error) {
    return {
      total: 0,
      sent: 0,
      errors: 0,
      skipped: 0,
      dryRun,
      error: `database: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (dryRun) {
    return {
      total: eligible.length,
      sent: 0,
      errors: 0,
      skipped: 0,
      dryRun: true,
      sample: eligible.slice(0, 5).map((row) => ({
        name: row.name,
        phone: maskPhone(row.phone),
      })),
    };
  }

  await ensureOutreachTables().catch((error) => {
    console.error(
      "[outreach] could not ensure audit tables:",
      error instanceof Error ? error.message : error,
    );
  });

  const template = templateName();

  const details = await mapLimit(eligible, 5, async (row) => {
    try {
      const messageId = await sendProFollowUpTemplate({
        to: row.phone,
        name: row.name,
      });

      const now = new Date();
      await db
        .update(readings)
        .set({ followupSentAt: now, updatedAt: now })
        .where(
          and(
            eq(readings.premium, false),
            sql`right(regexp_replace(coalesce(${readings.whatsappPhone}, ''), '[^0-9]', '', 'g'), 10) = ${row.phone}`,
          ),
        );

      await pool
        .query(
          `INSERT INTO outreach_sends
             (phone, name, template, provider_message_id, status)
           VALUES ($1, $2, $3, $4, 'sent')`,
          [row.phone, row.name, template, messageId],
        )
        .catch(() => {});

      return {
        id: row.id,
        phone: maskPhone(row.phone),
        status: "sent" as const,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await pool
        .query(
          `INSERT INTO outreach_sends
             (phone, name, template, status, error)
           VALUES ($1, $2, $3, 'error', $4)`,
          [row.phone, row.name, template, message.slice(0, 1000)],
        )
        .catch(() => {});

      return {
        id: row.id,
        phone: maskPhone(row.phone),
        status: "error" as const,
        error: message,
      };
    }
  });

  const sent = details.filter((row) => row.status === "sent").length;
  const errors = details.filter((row) => row.status === "error").length;

  return {
    total: eligible.length,
    sent,
    errors,
    skipped: eligible.length - sent - errors,
    dryRun: false,
    details,
  };
}
