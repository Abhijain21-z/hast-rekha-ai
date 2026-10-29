-- Tracks when a free reader was last sent a Pro-plan follow-up on WhatsApp.
-- Used to avoid messaging the same person again and again.

ALTER TABLE readings ADD COLUMN IF NOT EXISTS followup_sent_at timestamptz;
