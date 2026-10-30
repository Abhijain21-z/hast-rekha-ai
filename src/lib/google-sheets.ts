import { and, desc, eq, or, sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { payments, readings, users } from "@/db/schema";
import { NAKSHATRAS, RASHIS } from "@/lib/content";
import { toIndiaTenDigits } from "@/lib/whatsapp";
import { ensureOutreachTables } from "./outreach-db";

/**
 * Google Sheet sync for free readers.
 *
 * The sheet is written through a small Google Apps Script web app
 * (`scripts/google-sheet-webhook.gs`). The app POSTs the complete, deduped
 * free-reader table; the script clears the "Free Users" tab and writes it
 * again, so a retried daily sync can never create duplicate rows.
 *
 * Required env vars:
 *   GOOGLE_SHEETS_WEBHOOK_URL     Apps Script /exec URL
 *   GOOGLE_SHEETS_WEBHOOK_SECRET  same secret as the script
 *   GOOGLE_SHEET_URL              optional, link shown in the owner dashboard
 */

export interface GoogleSheetsConfig {
  webhookUrl: string;
  secret: string;
  sheetUrl: string;
  configured: boolean;
}

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() ?? "";
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim() ?? "";
  const sheetUrl = process.env.GOOGLE_SHEET_URL?.trim() ?? "";
  return {
    webhookUrl,
    secret,
    sheetUrl,
    configured: Boolean(webhookUrl && secret),
  };
}

export const FREE_USERS_SHEET_NAME = "Free Users";

export const FREE_USERS_SHEET_HEADERS = [
  "Synced (IST)",
  "Created (IST)",
  "Name",
  "WhatsApp (10-digit)",
  "Email",
  "Birth Date",
  "Birth Time",
  "Place",
  "Gender",
  "Married",
  "Rashi",
  "Nakshatra",
  "Marketing Opt-in",
  "Follow-up Sent (IST)",
  "Source",
  "Reading ID",
  "User ID",
] as const;

const IST_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function ist(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return IST_FORMATTER.format(date).replace(",", "");
}

/** Keep a cell from being interpreted as a formula by Google Sheets. */
function sheetSafe(value: string | null | undefined): string {
  const text = value ?? "";
  return /^[=+\-@]/.test(text) ? ` ${text}` : text;
}

function rashiLabel(index: unknown): string {
  if (typeof index !== "number" || !Number.isFinite(index)) return "";
  const rashi = RASHIS[((index % 12) + 12) % 12];
  return rashi ? `${rashi.name.hi} (${rashi.name.en})` : "";
}

function nakshatraLabel(index: unknown): string {
  if (typeof index !== "number" || !Number.isFinite(index)) return "";
  const nakshatra = NAKSHATRAS[((index % 27) + 27) % 27];
  return nakshatra ? `${nakshatra.name.hi} (${nakshatra.name.en})` : "";
}

export interface FreeUsersSheetData {
  headers: string[];
  rows: string[][];
  totalReadings: number;
  skippedPaid: number;
}

/**
 * Build the current free-reader table. One row per phone number (newest
 * reading wins), plus one row per reading when no phone/email exists.
 *
 * Readers with a successful payment, a Pro/Ultra reading, or an active
 * membership are deliberately excluded: the sheet is a free-reader list, not
 * a customer list.
 */
export async function buildFreeUsersSheetData(): Promise<FreeUsersSheetData> {
  const [readingRows, paidRows, premiumRows, memberRows] = await Promise.all([
    db
      .select({
        id: readings.id,
        userId: readings.userId,
        name: readings.fullName,
        phone: readings.whatsappPhone,
        email: users.email,
        birthDate: readings.birthDate,
        birthTime: readings.birthTime,
        placeName: readings.placeName,
        gender: readings.gender,
        married: readings.married,
        marketingOptIn: readings.marketingOptIn,
        followupSentAt: readings.followupSentAt,
        createdAt: readings.createdAt,
        result: readings.result,
      })
      .from(readings)
      .leftJoin(users, eq(users.id, readings.userId))
      .where(and(eq(readings.premium, false), eq(readings.ultra, false)))
      .orderBy(desc(readings.createdAt))
      .limit(10_000),
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

  const syncedAt = ist(new Date());
  const seen = new Set<string>();
  const rows: string[][] = [];
  let skippedPaid = 0;

  for (const row of readingRows) {
    const phone = toIndiaTenDigits(row.phone);

    if (phone && (paidPhones.has(phone) || premiumPhones.has(phone))) {
      skippedPaid += 1;
      continue;
    }
    if (row.userId && memberIds.has(row.userId)) {
      skippedPaid += 1;
      continue;
    }

    const key = phone
      ? `phone:${phone}`
      : row.email
        ? `email:${row.email.toLowerCase()}`
        : `reading:${row.id}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push([
      syncedAt,
      ist(row.createdAt),
      sheetSafe(row.name),
      phone ?? "",
      sheetSafe(row.email),
      row.birthDate ?? "",
      row.birthTime ?? "",
      sheetSafe(row.placeName),
      row.gender ?? "",
      row.married === true ? "Yes" : row.married === false ? "No" : "",
      rashiLabel(row.result?.moonRashi),
      nakshatraLabel(row.result?.nakshatra),
      row.marketingOptIn ? "Yes" : "No",
      row.followupSentAt ? ist(row.followupSentAt) : "No",
      row.userId ? "Account" : "Guest",
      row.id,
      row.userId ?? "",
    ]);
  }

  return {
    headers: [...FREE_USERS_SHEET_HEADERS],
    rows,
    totalReadings: readingRows.length,
    skippedPaid,
  };
}

export interface SheetSyncResult {
  ok: boolean;
  configured: boolean;
  dryRun: boolean;
  rowCount: number;
  totalReadings: number;
  skippedPaid: number;
  syncedAt: string;
  sheetUrl: string;
  error?: string;
}

/**
 * POST the complete free-reader table to the Apps Script webhook. The script
 * clears and rewrites the sheet, so this is safe to retry.
 */
export async function syncFreeUsersToSheet(
  options: { dryRun?: boolean } = {},
): Promise<SheetSyncResult> {
  const config = getGoogleSheetsConfig();
  const syncedAt = new Date().toISOString();
  const dryRun = options.dryRun === true;

  let data: FreeUsersSheetData;
  try {
    data = await buildFreeUsersSheetData();
  } catch (error) {
    return {
      ok: false,
      configured: config.configured,
      dryRun,
      rowCount: 0,
      totalReadings: 0,
      skippedPaid: 0,
      syncedAt,
      sheetUrl: config.sheetUrl,
      error: `database: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const base: Omit<SheetSyncResult, "ok" | "error"> = {
    configured: config.configured,
    dryRun,
    rowCount: data.rows.length,
    totalReadings: data.totalReadings,
    skippedPaid: data.skippedPaid,
    syncedAt,
    sheetUrl: config.sheetUrl,
  };

  if (dryRun) {
    return { ...base, ok: true };
  }

  if (!config.configured) {
    return {
      ...base,
      ok: false,
      error: "GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_WEBHOOK_SECRET is not set",
    };
  }

  let runId: string | null = null;
  try {
    await ensureOutreachTables();
    const inserted = await pool.query<{ id: string }>(
      `INSERT INTO outreach_sync_runs (status) VALUES ('running') RETURNING id`,
    );
    runId = inserted.rows[0]?.id ?? null;
  } catch (error) {
    // The sync itself must not fail because the audit table could not be made.
    console.error(
      "[google-sheets] could not start sync log:",
      error instanceof Error ? error.message : error,
    );
  }

  try {
    const res = await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: config.secret,
        sheetName: FREE_USERS_SHEET_NAME,
        headers: data.headers,
        rows: data.rows,
        syncedAt,
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; count?: number; error?: string }
      | null;

    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || `Google Sheet webhook returned ${res.status}`);
    }

    if (runId) {
      await pool
        .query(
          `UPDATE outreach_sync_runs SET status='success', row_count=$1, finished_at=now() WHERE id=$2`,
          [data.rows.length, runId],
        )
        .catch(() => {});
    }

    return { ...base, ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (runId) {
      await pool
        .query(
          `UPDATE outreach_sync_runs SET status='error', row_count=$1, error=$2, finished_at=now() WHERE id=$3`,
          [data.rows.length, message.slice(0, 1000), runId],
        )
        .catch(() => {});
    }
    return { ...base, ok: false, error: message };
  }
}

export interface LastSheetSync {
  startedAt: string;
  finishedAt: string | null;
  rowCount: number;
  status: string;
  error: string | null;
}

/** Latest sync run for the owner dashboard; null when nothing has run yet. */
export async function getLastSheetSync(): Promise<LastSheetSync | null> {
  try {
    await ensureOutreachTables();
    const result = await pool.query<{
      started_at: Date | string;
      finished_at: Date | string | null;
      row_count: number;
      status: string;
      error: string | null;
    }>(
      `SELECT started_at, finished_at, row_count, status, error
       FROM outreach_sync_runs
       ORDER BY started_at DESC
       LIMIT 1`,
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      startedAt:
        row.started_at instanceof Date ? row.started_at.toISOString() : String(row.started_at),
      finishedAt:
        row.finished_at instanceof Date ? row.finished_at.toISOString() : row.finished_at,
      rowCount: row.row_count,
      status: row.status,
      error: row.error,
    };
  } catch {
    return null;
  }
}
