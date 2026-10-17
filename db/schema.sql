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
  created_at timestamptz NOT NULL DEFAULT now()
);

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
  gender varchar(10),         -- "male" | "female" | "trans"
  married boolean,            -- null when the visitor skipped the question
  notes text,
  is_favorite boolean NOT NULL DEFAULT false,
  premium boolean NOT NULL DEFAULT false,
  premium_utr text,
  premium_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS readings_user_idx ON readings (user_id);

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
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reviews_created_idx ON reviews (created_at);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
