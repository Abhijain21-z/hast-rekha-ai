-- Cashfree payment attempts (one row per order).
-- Applied by scripts/migrate.mjs on every build; safe to run repeatedly.

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
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_reading_idx ON payments (reading_id);
