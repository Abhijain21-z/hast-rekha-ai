-- Ultra Pro (₹351) is the plan that also includes the Dhandayak book. This
-- column records which readings bought it; plain Pro (₹51) readings stay false.
--
-- Run before deploying the build that selects the column:
--   psql "$DATABASE_URL" -f db/migrations/2026-10-17_add_ultra_plan.sql
-- Safe to run more than once. `npm run build` also applies this automatically
-- through scripts/migrate.mjs.

ALTER TABLE readings ADD COLUMN IF NOT EXISTS ultra boolean NOT NULL DEFAULT false;
