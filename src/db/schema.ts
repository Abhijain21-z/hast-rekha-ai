import {
  pgTable,
  text,
  timestamp,
  uuid,
  real,
  jsonb,
  boolean,
  varchar,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AstroResult } from "../lib/astrology";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  preferredLang: varchar("preferred_lang", { length: 2 }).notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const readings = pgTable(
  "readings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Nullable so guests can generate a reading without an account.
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fullName: text("full_name").notNull(),
    birthDate: text("birth_date").notNull(), // YYYY-MM-DD (local)
    birthTime: text("birth_time").notNull(), // HH:MM (local)
    timeUnknown: boolean("time_unknown").notNull().default(false),
    placeName: text("place_name").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    tzOffset: real("tz_offset").notNull().default(5.5),
    result: jsonb("result").$type<AstroResult>().notNull(),
    palmImage: text("palm_image"), // data URL (downscaled on client)
    palmHand: varchar("palm_hand", { length: 10 }),
    /** Optional WhatsApp number captured at the start; never exposed in the public DTO. */
    whatsappPhone: text("whatsapp_phone"),
    // Optional profile details captured in the form; shown back on the report.
    gender: varchar("gender", { length: 10 }), // "male" | "female" | "trans"
    married: boolean("married"), // null when the visitor skipped the question
    notes: text("notes"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    premium: boolean("premium").notNull().default(false),
    premiumUtr: text("premium_utr"),
    premiumAt: timestamp("premium_at", { withTimezone: true }),
    /** Ultra Pro (₹351): Pro + the Dhandayak book. */
    ultra: boolean("ultra").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("readings_user_idx").on(t.userId)],
);

/**
 * Explicit daily-rashifal opt-ins. One row per WhatsApp number, so a person
 * with several readings still gets at most one message per day. `readingId`
 * points at the latest reading used to derive the moon sign; no reading data
 * is included in the message.
 */
export const whatsappSubscribers = pgTable(
  "whatsapp_subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Normalized 10-digit Indian mobile. Unique = one daily message per person. */
    phone: text("phone").notNull().unique(),
    name: text("name"),
    /** Rashi key from RASHIS, e.g. "mesha". */
    rashiKey: varchar("rashi_key", { length: 20 }).notNull(),
    readingId: uuid("reading_id").references(() => readings.id, { onDelete: "set null" }),
    /** reading_form | report_page */
    source: varchar("source", { length: 30 }).notNull().default("reading_form"),
    /** opted_in | opted_out */
    status: varchar("status", { length: 20 }).notNull().default("opted_in"),
    optedInAt: timestamp("opted_in_at", { withTimezone: true }),
    optedOutAt: timestamp("opted_out_at", { withTimezone: true }),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
    sendCount: integer("send_count").notNull().default(0),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("whatsapp_subscribers_status_idx").on(t.status)],
);

/**
 * One row per attempted daily send. The unique (subscriber, send_date) pair
 * makes a retried cron run idempotent: a subscriber never gets two messages
 * for the same India date.
 */
export const whatsappDailySends = pgTable(
  "whatsapp_daily_sends",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriberId: uuid("subscriber_id")
      .notNull()
      .references(() => whatsappSubscribers.id, { onDelete: "cascade" }),
    phone: text("phone").notNull(),
    /** YYYY-MM-DD in Asia/Kolkata. */
    sendDate: varchar("send_date", { length: 10 }).notNull(),
    /** sent | failed */
    status: varchar("status", { length: 20 }).notNull(),
    providerMessageId: text("provider_message_id"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("whatsapp_daily_sends_subscriber_date_idx").on(t.subscriberId, t.sendDate),
    index("whatsapp_daily_sends_date_idx").on(t.sendDate),
  ],
);

/**
 * Cashfree payment attempts. One row per created order; the reading unlocks only
 * after Cashfree reports the order as PAID (webhook or server-side verify).
 */
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    readingId: uuid("reading_id")
      .notNull()
      .references(() => readings.id, { onDelete: "cascade" }),
    /** Cashfree order id — unique so one payment can never unlock two readings. */
    orderId: text("order_id").notNull().unique(),
    plan: varchar("plan", { length: 10 }).notNull(), // "pro" | "ultra"
    amount: real("amount").notNull(),
    /** created | paid | failed | expired */
    status: varchar("status", { length: 20 }).notNull().default("created"),
    cfOrderId: text("cf_order_id"),
    cfPaymentId: text("cf_payment_id"),
    paymentMethod: text("payment_method"),
    /** Cashfree's required payer number; also used for WhatsApp reminders when opted in. */
    customerPhone: text("customer_phone"),
    whatsappOptIn: boolean("whatsapp_opt_in").notNull().default(false),
    whatsappOptInAt: timestamp("whatsapp_opt_in_at", { withTimezone: true }),
    /** Abandoned-payment follow-up state (filled by the reminder cron later). */
    reminderCount: integer("reminder_count").notNull().default(0),
    lastReminderAt: timestamp("last_reminder_at", { withTimezone: true }),
    raw: jsonb("raw"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("payments_reading_idx").on(t.readingId)],
);

export const birthProfiles = pgTable(
  "birth_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    relation: varchar("relation", { length: 20 }).notNull().default("self"),
    birthDate: text("birth_date").notNull(),
    birthTime: text("birth_time").notNull(),
    placeName: text("place_name").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    tzOffset: real("tz_offset").notNull().default(5.5),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("profiles_user_idx").on(t.userId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 80 }).notNull(),
    rating: real("rating").notNull().default(5),
    text: text("text").notNull(),
    lang: varchar("lang", { length: 2 }).notNull().default("hi"),
    /** How the visitor rated the interface: great | good | okay | poor. */
    interfaceRating: varchar("interface_rating", { length: 20 }),
    /** Did the prediction feel accurate to them? null = not answered. */
    agrees: boolean("agrees"),
    /** Low-star reviews are public briefly, then moved to review_archive. */
    isNegative: boolean("is_negative").notNull().default(false),
    /** Public visibility deadline for a negative review; null for positive. */
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reviews_created_idx").on(t.createdAt),
    index("reviews_visibility_idx").on(t.isNegative, t.expiresAt),
  ],
);

/**
 * Owner-only archive for negative reviews removed from the public list.
 * No UI reads this table; only the protected /api/reviews/archive route.
 */
export const reviewArchive = pgTable(
  "review_archive",
  {
    reviewId: uuid("review_id").primaryKey(),
    userId: uuid("user_id"),
    name: varchar("name", { length: 80 }).notNull(),
    rating: real("rating").notNull(),
    text: text("text").notNull(),
    lang: varchar("lang", { length: 2 }).notNull().default("hi"),
    interfaceRating: varchar("interface_rating", { length: 20 }),
    agrees: boolean("agrees"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }).notNull().defaultNow(),
    reason: varchar("reason", { length: 40 }).notNull().default("negative_auto_hide"),
  },
  (t) => [
    index("review_archive_created_idx").on(t.createdAt),
    index("review_archive_archived_idx").on(t.archivedAt),
  ],
);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
export type BirthProfile = typeof birthProfiles.$inferSelect;
export type NewBirthProfile = typeof birthProfiles.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type WhatsAppSubscriber = typeof whatsappSubscribers.$inferSelect;
export type NewWhatsAppSubscriber = typeof whatsappSubscribers.$inferInsert;
export type WhatsAppDailySend = typeof whatsappDailySends.$inferSelect;
export type NewWhatsAppDailySend = typeof whatsappDailySends.$inferInsert;
