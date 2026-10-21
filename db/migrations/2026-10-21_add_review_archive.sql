-- Negative-review auto-hide + owner-only archive.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_negative boolean NOT NULL DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE INDEX IF NOT EXISTS reviews_visibility_idx ON reviews (is_negative, expires_at);

-- Existing low-star reviews are already older than one hour; hide them from the
-- public list and let the cleanup job move them into the archive.
UPDATE reviews
SET is_negative = true,
    expires_at = COALESCE(expires_at, created_at + interval '1 hour')
WHERE is_negative = false
  AND rating <= 3;

CREATE TABLE IF NOT EXISTS review_archive (
  review_id uuid PRIMARY KEY,
  user_id uuid,
  name varchar(80) NOT NULL,
  rating real NOT NULL,
  text text NOT NULL,
  lang varchar(2) NOT NULL DEFAULT 'hi',
  interface_rating varchar(20),
  agrees boolean,
  created_at timestamptz NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT now(),
  reason varchar(40) NOT NULL DEFAULT 'negative_auto_hide'
);
CREATE INDEX IF NOT EXISTS review_archive_created_idx ON review_archive (created_at);
CREATE INDEX IF NOT EXISTS review_archive_archived_idx ON review_archive (archived_at);
