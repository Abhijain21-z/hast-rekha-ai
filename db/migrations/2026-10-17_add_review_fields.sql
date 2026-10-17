-- Review form upgrade: the post-prediction review asks two extra questions
-- (interface rating + "do you agree with the prediction?") alongside the star
-- rating and the free-text review that already existed.
--
-- Run this on any environment whose database predates the columns, e.g. the
-- production database, BEFORE deploying the build that reads them:
--   psql "$DATABASE_URL" -f db/migrations/2026-10-17_add_review_fields.sql
-- Safe to run more than once.

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS interface_rating varchar(20);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS agrees boolean;
