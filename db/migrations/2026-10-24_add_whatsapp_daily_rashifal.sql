-- Daily WhatsApp rashifal: explicit opt-ins and idempotent send log.
--
-- Safe to run more than once: every statement is IF NOT EXISTS / inline UNIQUE.

CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE, -- normalized 10-digit Indian mobile
  name text,
  rashi_key varchar(20) NOT NULL,
  reading_id uuid REFERENCES readings(id) ON DELETE SET NULL,
  source varchar(30) NOT NULL DEFAULT 'reading_form',
  status varchar(20) NOT NULL DEFAULT 'opted_in', -- opted_in | opted_out
  opted_in_at timestamptz,
  opted_out_at timestamptz,
  last_sent_at timestamptz,
  send_count integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS whatsapp_subscribers_status_idx ON whatsapp_subscribers (status);

CREATE TABLE IF NOT EXISTS whatsapp_daily_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL REFERENCES whatsapp_subscribers(id) ON DELETE CASCADE,
  phone text NOT NULL,
  send_date varchar(10) NOT NULL, -- YYYY-MM-DD in Asia/Kolkata
  status varchar(20) NOT NULL,    -- sent | failed
  provider_message_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscriber_id, send_date)
);
CREATE INDEX IF NOT EXISTS whatsapp_daily_sends_date_idx ON whatsapp_daily_sends (send_date);
