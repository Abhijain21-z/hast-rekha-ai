-- Canonical schema for Hast Rekha AI.
--
-- Kept in sync with src/db/schema.ts (the single source of truth used by Drizzle).
-- Useful for bootstrapping a fresh database, e.g. on a new machine or a new
-- local cluster:
--
--   createdb app_db --encoding=UTF8 --template=template0 --locale=C
--   psql "$DATABASE_URL" -f db/schema.sql
--
-- Safe to run more than once (every statement is IF NOT EXISTS).
-- Requires PostgreSQL 13+ for gen_random_uuid().

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  preferred_lang varchar(2) NOT NULL DEFAULT 'en',
  referral_code varchar(12),
  token_balance integer NOT NULL DEFAULT 0, -- 350 tokens = one Ultra Pro report
  created_at timestamptz NOT NULL DEFAULT now()
);
-- On a database created before referrals shipped, `users` already exists, so the
-- CREATE TABLE above is a no-op. Add the columns before any index needs them.
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code varchar(12);
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_balance integer NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_idx
  ON users (referral_code)
  WHERE referral_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nullable so guests can generate a reading without an account.
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  full_name text NOT NULL,
  birth_date text NOT NULL,   -- YYYY-MM-DD (local)
  birth_time text NOT NULL,   -- HH:MM (local)
  time_unknown boolean NOT NULL DEFAULT false,
  place_name text NOT NULL,
  latitude real NOT NULL,
  longitude real NOT NULL,
  tz_offset real NOT NULL DEFAULT 5.5,
  result jsonb NOT NULL,
  palm_image text,            -- data URL, downscaled on the client
  palm_hand varchar(10),
  whatsapp_phone text,        -- optional number captured for payment/report updates
  gender varchar(10),         -- "male" | "female" | "trans"
  married boolean,            -- null when the visitor skipped the question
  notes text,
  is_favorite boolean NOT NULL DEFAULT false,
  premium boolean NOT NULL DEFAULT false,
  premium_utr text,
  premium_at timestamptz,
  ultra boolean NOT NULL DEFAULT false, -- Ultra Pro: Pro + the Dhandayak book
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS readings_user_idx ON readings (user_id);

-- One row per successful referral. The unique referred_user_id makes the
-- 50-token credit idempotent even if the register request is retried.
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  code varchar(12) NOT NULL,
  tokens_awarded integer NOT NULL DEFAULT 50,
  credited_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referrals_no_self CHECK (referrer_id <> referred_user_id)
);
CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON referrals (referrer_id);

-- Append-only token wallet statement.
CREATE TABLE IF NOT EXISTS token_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason varchar(40) NOT NULL, -- referral_signup | ultra_redemption | admin_adjustment
  referral_id uuid REFERENCES referrals(id) ON DELETE SET NULL,
  reading_id uuid REFERENCES readings(id) ON DELETE SET NULL,
  balance_after integer NOT NULL,
  metadata jsonb,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS token_ledger_user_idx ON token_ledger (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS token_ledger_referral_once_idx
  ON token_ledger (referral_id)
  WHERE referral_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS token_ledger_ultra_once_idx
  ON token_ledger (reading_id)
  WHERE reason = 'ultra_redemption' AND reading_id IS NOT NULL;

-- Explicit daily-rashifal opt-ins. One row per WhatsApp number, so a person
-- with several readings gets at most one message per day.
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE, -- normalized 10-digit Indian mobile
  name text,
  rashi_key varchar(20) NOT NULL,
  reading_id uuid REFERENCES readings(id) ON DELETE SET NULL,
  source varchar(30) NOT NULL DEFAULT 'reading_form',
  status varchar(20) NOT NULL DEFAULT 'opted_in', -- opted_in | opted_out
  opted_in_at timestamptz,
  opted_out_at timestamptz,
  last_sent_at timestamptz,
  send_count integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS whatsapp_subscribers_status_idx ON whatsapp_subscribers (status);

-- Attempt log; UNIQUE (subscriber_id, send_date) keeps retried crons idempotent.
CREATE TABLE IF NOT EXISTS whatsapp_daily_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL REFERENCES whatsapp_subscribers(id) ON DELETE CASCADE,
  phone text NOT NULL,
  send_date varchar(10) NOT NULL, -- YYYY-MM-DD in Asia/Kolkata
  status varchar(20) NOT NULL,    -- sent | failed
  provider_message_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscriber_id, send_date)
);
CREATE INDEX IF NOT EXISTS whatsapp_daily_sends_date_idx ON whatsapp_daily_sends (send_date);

CREATE TABLE IF NOT EXISTS birth_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relation varchar(20) NOT NULL DEFAULT 'self',
  birth_date text NOT NULL,
  birth_time text NOT NULL,
  place_name text NOT NULL,
  latitude real NOT NULL,
  longitude real NOT NULL,
  tz_offset real NOT NULL DEFAULT 5.5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS profiles_user_idx ON birth_profiles (user_id);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name varchar(80) NOT NULL,
  rating real NOT NULL DEFAULT 5,
  text text NOT NULL,
  lang varchar(2) NOT NULL DEFAULT 'hi',
  -- How the visitor rated the interface: great | good | okay | poor.
  interface_rating varchar(20),
  -- Did the prediction feel accurate to them? null = not answered.
  agrees boolean,
  -- Low-star reviews are public for one hour, then archived.
  is_negative boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reviews_created_idx ON reviews (created_at);

-- Owner-only archive. Kept out of every public query and UI.
CREATE TABLE IF NOT EXISTS review_archive (
  review_id uuid PRIMARY KEY,
  user_id uuid,
  name varchar(80) NOT NULL,
  rating real NOT NULL,
  text text NOT NULL,
  lang varchar(2) NOT NULL DEFAULT 'hi',
  interface_rating varchar(20),
  agrees boolean,
  created_at timestamptz NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT now(),
  reason varchar(40) NOT NULL DEFAULT 'negative_auto_hide'
);
CREATE INDEX IF NOT EXISTS review_archive_created_idx ON review_archive (created_at);
CREATE INDEX IF NOT EXISTS review_archive_archived_idx ON review_archive (archived_at);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id uuid NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  order_id text NOT NULL UNIQUE,   -- Cashfree order id
  plan varchar(10) NOT NULL,       -- "pro" (₹51) | "ultra" (₹351)
  amount real NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'created', -- created | paid | expired
  cf_order_id text,
  cf_payment_id text,
  payment_method text,
  customer_phone text,
  whatsapp_opt_in boolean NOT NULL DEFAULT false,
  whatsapp_opt_in_at timestamptz,
  reminder_count integer NOT NULL DEFAULT 0,
  last_reminder_at timestamptz,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_reading_idx ON payments (reading_id);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
