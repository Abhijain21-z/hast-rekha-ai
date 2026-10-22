-- Owner-generated PDF copies of paid reports.
-- Stored as base64 chunks so a large print PDF can be uploaded through the
-- normal serverless request limit, then downloaded from a private long link.
CREATE TABLE IF NOT EXISTS reading_report_chunks (
  reading_id uuid NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  token text NOT NULL,
  chunk_index integer NOT NULL,
  chunk_count integer NOT NULL,
  data text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (reading_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS reading_report_chunks_token_idx ON reading_report_chunks (token);
