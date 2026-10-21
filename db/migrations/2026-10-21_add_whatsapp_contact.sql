-- Optional WhatsApp contact captured before the reading, plus the payment-time
-- consent/reminder state. Applied by scripts/migrate.mjs on every build; safe
-- to run repeatedly.

ALTER TABLE readings ADD COLUMN IF NOT EXISTS whatsapp_phone text;

ALTER TABLE payments ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean NOT NULL DEFAULT false;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS whatsapp_opt_in_at timestamptz;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reminder_count integer NOT NULL DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS last_reminder_at timestamptz;
