-- Coin-powered AI Panditji chat.
--
-- Rules:
--   * Every new account gets 50 welcome coins on signup.
--   * Chat costs 10 coins per started minute of an active conversation.
--   * Coins live in users.token_balance (signed in) or chat_wallets (guest).
--   * Pro reports include 50 chat minutes; chat_usage.pro.used counts them.
--
-- Applied by scripts/migrate.mjs on every build; safe to run repeatedly.

CREATE TABLE IF NOT EXISTS chat_wallets (
  subject text PRIMARY KEY,
  balance integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chat_wallets_balance_nonnegative CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  subject text PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  billed_minutes integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chat_sessions_billed_nonnegative CHECK (billed_minutes >= 0)
);
CREATE INDEX IF NOT EXISTS chat_sessions_last_seen_idx ON chat_sessions (last_seen_at);

-- Give existing accounts the same 50-coin welcome bonus as new signups.
-- The ledger row is the marker: once it exists this statement is a no-op.
WITH eligible AS (
  SELECT u.id
  FROM users u
  WHERE NOT EXISTS (
    SELECT 1 FROM token_ledger l
    WHERE l.user_id = u.id AND l.reason = 'signup_bonus'
  )
),
updated AS (
  UPDATE users u
  SET token_balance = u.token_balance + 50
  FROM eligible e
  WHERE u.id = e.id
  RETURNING u.id, u.token_balance
)
INSERT INTO token_ledger (user_id, delta, reason, balance_after)
SELECT id, 50, 'signup_bonus', token_balance FROM updated;
