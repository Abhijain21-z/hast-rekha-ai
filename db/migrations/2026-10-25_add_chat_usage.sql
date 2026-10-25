-- AI Panditji chat usage.
--
-- `chat_usage` now stores the 50 included minutes that come with a Pro report
-- (`plan = 'pro'`). Free/guest coin spending lives in `chat_wallets` and
-- `users.token_balance`; the old per-message free counter is no longer used.
--
-- Subjects are `user:<uuid>` for signed-in readers and `anon:<uuid>` for guests
-- (the anon id lives in the HttpOnly `hr_chat_id` cookie).
--
-- Applied by scripts/migrate.mjs on every build; safe to run repeatedly.

CREATE TABLE IF NOT EXISTS chat_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  plan varchar(10) NOT NULL DEFAULT 'free',
  used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chat_usage_plan_check CHECK (plan IN ('free', 'pro')),
  CONSTRAINT chat_usage_used_nonnegative CHECK (used >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS chat_usage_subject_plan_idx ON chat_usage (subject, plan);
