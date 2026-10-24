-- Referral rewards and the token wallet.
--
-- Rules (owner-confirmed):
--   * A referrer earns 50 tokens only after the referred person creates an account.
--   * Tokens are never accepted for the Rs 51 Pro report.
--   * 350 tokens unlock one Ultra Pro (Rs 351) report.
--
-- Applied by scripts/migrate.mjs on every build; safe to run repeatedly.

ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code varchar(12);
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_balance integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_idx
  ON users (referral_code)
  WHERE referral_code IS NOT NULL;

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
