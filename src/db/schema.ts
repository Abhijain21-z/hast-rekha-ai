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
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AstroResult } from "../lib/astrology";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    preferredLang: varchar("preferred_lang", { length: 2 }).notNull().default("en"),
    /** Short, shareable code used in /register?ref=CODE. Null until first needed. */
    referralCode: varchar("referral_code", { length: 12 }),
    /** Spendable reward balance. 350 tokens = one Ultra Pro report; never Pro. */
    tokenBalance: integer("token_balance").notNull().default(0),
    /** 30-day membership pass; active while this timestamp is in the future. */
    membershipUntil: timestamp("membership_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_referral_code_idx").on(t.referralCode).where(sql`${t.referralCode} IS NOT NULL`)],
);

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
    /** Required for new readings; older rows may still be null. Never exposed in the public DTO. */
    whatsappPhone: text("whatsapp_phone"),
    /** Marketing consent for WhatsApp follow-up about Pro plans. Defaults to true. */
    marketingOptIn: boolean("marketing_opt_in").notNull().default(true),
    /** Last time a Pro-plan follow-up was sent (or manually marked sent). */
    followupSentAt: timestamp("followup_sent_at", { withTimezone: true }),
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
    /** ₹99 Diwali Puja PDF add-on. Old Pro buyers are grandfathered by migration. */
    diwaliPdf: boolean("diwali_pdf").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("readings_user_idx").on(t.userId)],
);

/**
 * One row per successful referral. `referredUserId` is unique, so a new account
 * can trigger exactly one reward, even if the register request is retried.
 */
export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referrerId: uuid("referrer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    referredUserId: uuid("referred_user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    /** The code that was used at signup (kept for audit even if it later changes). */
    code: varchar("code", { length: 12 }).notNull(),
    tokensAwarded: integer("tokens_awarded").notNull().default(50),
    creditedAt: timestamp("credited_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("referrals_referrer_idx").on(t.referrerId),
    check("referrals_no_self", sql`${t.referrerId} <> ${t.referredUserId}`),
  ],
);

/**
 * Append-only token wallet history. `balanceAfter` lets the UI show a running
 * statement without re-summing the whole ledger. Positive rows are rewards;
 * negative rows are redemptions.
 */
export const tokenLedger = pgTable(
  "token_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    /** signup_bonus | referral_signup | chat_time | chat_refund | ultra_redemption | admin_adjustment */
    reason: varchar("reason", { length: 40 }).notNull(),
    referralId: uuid("referral_id").references(() => referrals.id, { onDelete: "set null" }),
    readingId: uuid("reading_id").references(() => readings.id, { onDelete: "set null" }),
    balanceAfter: integer("balance_after").notNull(),
    metadata: jsonb("metadata"),
    /** Set when the referrer has seen the gift popup for this reward. */
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("token_ledger_user_idx").on(t.userId, t.createdAt),
    uniqueIndex("token_ledger_referral_once_idx").on(t.referralId).where(sql`${t.referralId} IS NOT NULL`),
    uniqueIndex("token_ledger_ultra_once_idx")
      .on(t.readingId)
      .where(sql`${t.reason} = 'ultra_redemption' AND ${t.readingId} IS NOT NULL`),
  ],
);

/**
 * Included AI Panditji minutes for Pro readers. One row per subject + plan:
 *   - `user:<uuid>` for a signed-in reader, or `anon:<uuid>` for a guest.
 *   - `pro` rows count included minutes (50 with a Pro report).
 *
 * Free readers do not use this table; they pay 10 coins per started minute from
 * their wallet. The `free` plan value stays allowed for older rows.
 */
export const chatUsage = pgTable(
  "chat_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subject: text("subject").notNull(),
    plan: varchar("plan", { length: 10 }).notNull().default("free"),
    used: integer("used").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("chat_usage_subject_plan_idx").on(t.subject, t.plan),
    check("chat_usage_plan_check", sql`${t.plan} IN ('free', 'pro')`),
    check("chat_usage_used_nonnegative", sql`${t.used} >= 0`),
  ],
);

/**
 * Guest coin wallet. Signed-in readers use `users.token_balance`; a guest gets
 * a cookie-backed wallet seeded with 50 coins so the chat can be tried without
 * creating an account first.
 */
export const chatWallets = pgTable("chat_wallets", {
  subject: text("subject").primaryKey(),
  balance: integer("balance").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Current chat session, used to bill 10 coins per started minute. `startedAt`
 * is the beginning of the paid conversation and `billedMinutes` is how many
 * minutes have already been charged.
 */
export const chatSessions = pgTable(
  "chat_sessions",
  {
    subject: text("subject").primaryKey(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    billedMinutes: integer("billed_minutes").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("chat_sessions_billed_nonnegative", sql`${t.billedMinutes} >= 0`),
    index("chat_sessions_last_seen_idx").on(t.lastSeenAt),
  ],
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
    readingId: uuid("reading_id").references(() => readings.id, { onDelete: "cascade" }),
    /** Set for standalone products (membership); also mirrors the reading owner. */
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    /** Cashfree order id — unique so one payment can never unlock two readings. */
    orderId: text("order_id").notNull().unique(),
    plan: varchar("plan", { length: 10 }).notNull(), // pro | diwali | bundle | ultra | membership
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
  (t) => [index("payments_reading_idx").on(t.readingId), index("payments_user_idx").on(t.userId)],
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
    /** When the account holder confirmed the family member's consent. */
    consentAt: timestamp("consent_at", { withTimezone: true }),
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

/**
 * One row per attempted Pro-plan WhatsApp follow-up. The reader's
 * `readings.followup_sent_at` is still the source of truth for eligibility;
 * this table is the owner-visible audit trail (provider message id + errors).
 */
export const outreachSends = pgTable(
  "outreach_sends",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Normalized 10-digit Indian mobile. */
    phone: text("phone").notNull(),
    name: text("name"),
    template: text("template").notNull(),
    providerMessageId: text("provider_message_id"),
    /** sent | error */
    status: varchar("status", { length: 20 }).notNull(),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("outreach_sends_phone_idx").on(t.phone),
    index("outreach_sends_sent_idx").on(t.sentAt),
  ],
);

/**
 * One row per Google Sheet sync attempt. The sheet itself is rewritten from
 * the database, so a retry is idempotent; this table only powers the owner
 * dashboard's "last synced" status.
 */
export const outreachSyncRuns = pgTable(
  "outreach_sync_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    rowCount: integer("row_count").notNull().default(0),
    /** running | success | error */
    status: varchar("status", { length: 20 }).notNull().default("running"),
    error: text("error"),
  },
  (t) => [index("outreach_sync_runs_started_idx").on(t.startedAt)],
);

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
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
export type TokenLedgerEntry = typeof tokenLedger.$inferSelect;
export type NewTokenLedgerEntry = typeof tokenLedger.$inferInsert;
export type ChatUsage = typeof chatUsage.$inferSelect;
export type NewChatUsage = typeof chatUsage.$inferInsert;
export type ChatWallet = typeof chatWallets.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type OutreachSend = typeof outreachSends.$inferSelect;
export type NewOutreachSend = typeof outreachSends.$inferInsert;
export type OutreachSyncRun = typeof outreachSyncRuns.$inferSelect;
export type NewOutreachSyncRun = typeof outreachSyncRuns.$inferInsert;
