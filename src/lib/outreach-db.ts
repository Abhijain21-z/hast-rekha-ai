import { pool } from "@/db";

/**
 * The two outreach audit tables are created at runtime as well as by
 * `scripts/migrate.mjs`. That keeps the feature working on a deployment whose
 * build did not run migrations, without requiring a manual SQL step.
 *
 * The `ready` flag is per serverless instance; `CREATE TABLE IF NOT EXISTS` is
 * idempotent, so a cold start simply runs the (cheap) DDL again.
 */
let ready = false;

export async function ensureOutreachTables(): Promise<void> {
  if (ready) return;

  await pool.query(`
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
  `);

  ready = true;
}
