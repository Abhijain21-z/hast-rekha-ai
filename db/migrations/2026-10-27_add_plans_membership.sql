-- Plans added on 2026-10-27: Diwali PDF add-on, ₹199 bundle, and the
-- 30-day membership pass. Every statement is additive or loosens a constraint;
-- no table or column is dropped.

-- Membership: the pass is active while membership_until is in the future.
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_until timestamptz;

-- The Diwali Puja PDF used to be a Pro bonus. It is now a ₹99 add-on, so the
-- entitlement needs its own flag. Existing Pro buyers are grandfathered below.
ALTER TABLE readings ADD COLUMN IF NOT EXISTS diwali_pdf boolean NOT NULL DEFAULT false;

-- Family profiles now record when the account holder confirmed consent.
ALTER TABLE birth_profiles ADD COLUMN IF NOT EXISTS consent_at timestamptz;

-- Standalone products (membership) do not belong to a single reading, and the
-- payment needs to know which account bought them.
ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE payments ALTER COLUMN reading_id DROP NOT NULL;

-- One-time grandfathering: Pro buyers from before this change keep the Diwali
-- PDF they were promised. The cutoff keeps the statement safe to re-run on
-- every deploy without giving the PDF to future Pro buyers.
UPDATE readings
SET diwali_pdf = true
WHERE premium = true
  AND COALESCE(premium_at, created_at) < timestamptz '2026-10-27 00:00:00+05:30';
