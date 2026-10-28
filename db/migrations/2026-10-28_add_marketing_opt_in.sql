-- Marketing opt-in for WhatsApp follow-up about Pro plans.
-- Defaults to true so free readers receive Pro plan info unless they uncheck.

ALTER TABLE readings ADD COLUMN IF NOT EXISTS marketing_opt_in boolean NOT NULL DEFAULT true;
