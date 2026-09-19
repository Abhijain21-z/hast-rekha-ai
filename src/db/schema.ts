import {
  pgTable,
  text,
  timestamp,
  uuid,
  real,
  jsonb,
  boolean,
  varchar,
  index,
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
    notes: text("notes"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    premium: boolean("premium").notNull().default(false),
    premiumUtr: text("premium_utr"),
    premiumAt: timestamp("premium_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("readings_user_idx").on(t.userId)],
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reviews_created_idx").on(t.createdAt)],
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
