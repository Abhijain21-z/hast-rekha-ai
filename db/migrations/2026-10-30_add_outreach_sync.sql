-- Owner-only WhatsApp outreach audit + Google Sheet sync status.
--
-- `readings.followup_sent_at` remains the source of truth for who has already
-- received the Pro follow-up. `outreach_sends` is the audit trail (provider
-- message id, errors) and `outreach_sync_runs` powers the dashboard status.
--
-- Applied by scripts/migrate.mjs on every build; safe to run repeatedly.

CREATE TABLE IF NOT EXISTS outreach_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  name text,
  template text NOT NULL,
  provider_message_id text,
  status varchar(20) NOT NULL,
  error text,
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS outreach_sends_phone_idx ON outreach_sends (phone);
CREATE INDEX IF NOT EXISTS outreach_sends_sent_idx ON outreach_sends (sent_at);

CREATE TABLE IF NOT EXISTS outreach_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  row_count integer NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'running',
  error text
);
CREATE INDEX IF NOT EXISTS outreach_sync_runs_started_idx ON outreach_sync_runs (started_at);
