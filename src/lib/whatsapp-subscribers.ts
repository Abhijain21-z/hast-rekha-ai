import { eq } from "drizzle-orm";
import { db } from "@/db";
import { whatsappSubscribers } from "@/db/schema";
import { toIndiaTenDigits } from "./whatsapp";

export interface WhatsAppDailyStatus {
  subscribed: boolean;
  maskedPhone: string | null;
}

/** Safe summary for the reading page; the full number never enters the DTO. */
export async function getWhatsAppDailyStatus(phone: string | null): Promise<WhatsAppDailyStatus> {
  const ten = toIndiaTenDigits(phone);
  if (!ten) return { subscribed: false, maskedPhone: null };
  const [row] = await db
    .select({ status: whatsappSubscribers.status })
    .from(whatsappSubscribers)
    .where(eq(whatsappSubscribers.phone, ten))
    .limit(1);
  return {
    subscribed: row?.status === "opted_in",
    maskedPhone: `••••••${ten.slice(-4)}`,
  };
}

export interface UpsertSubscriberInput {
  phone: string;
  name?: string | null;
  rashiKey: string;
  readingId?: string | null;
  source: "reading_form" | "report_page";
}

/**
 * Record explicit consent. A previous opt-out is cleared only when the visitor
 * ticks the consent box again, which is exactly what this function represents.
 */
export async function upsertWhatsAppSubscriber(input: UpsertSubscriberInput): Promise<void> {
  const ten = toIndiaTenDigits(input.phone);
  if (!ten) throw new Error("invalid_phone");
  const now = new Date();
  await db
    .insert(whatsappSubscribers)
    .values({
      phone: ten,
      name: input.name ?? null,
      rashiKey: input.rashiKey,
      readingId: input.readingId ?? null,
      source: input.source,
      status: "opted_in",
      optedInAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: whatsappSubscribers.phone,
      set: {
        name: input.name ?? null,
        rashiKey: input.rashiKey,
        readingId: input.readingId ?? null,
        source: input.source,
        status: "opted_in",
        optedInAt: now,
        optedOutAt: null,
        lastError: null,
        updatedAt: now,
      },
    });
}

/** Honour STOP / unsubscribe replies. Returns true when a subscriber existed. */
export async function markWhatsAppOptedOut(phone: string): Promise<boolean> {
  const ten = toIndiaTenDigits(phone);
  if (!ten) return false;
  const now = new Date();
  const rows = await db
    .update(whatsappSubscribers)
    .set({ status: "opted_out", optedOutAt: now, updatedAt: now })
    .where(eq(whatsappSubscribers.phone, ten))
    .returning({ id: whatsappSubscribers.id });
  return rows.length > 0;
}
