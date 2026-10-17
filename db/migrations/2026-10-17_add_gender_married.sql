-- Adds the optional gender / marital-status fields collected by the reading form.
-- Run this once against the production database before deploying the build that
-- writes these columns (drizzle-kit push also produces this change):
--
--   psql "$DATABASE_URL" -f db/migrations/2026-10-17_add_gender_married.sql
--
-- Both columns are nullable, so existing rows and older clients keep working.

ALTER TABLE readings ADD COLUMN IF NOT EXISTS gender varchar(10);
ALTER TABLE readings ADD COLUMN IF NOT EXISTS married boolean;
