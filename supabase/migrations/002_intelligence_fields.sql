-- Add deep intelligence JSONB columns to meeting_insights
-- Safe: additive only, no existing data modified

ALTER TABLE meeting_insights
  ADD COLUMN IF NOT EXISTS commitments    JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS risks          JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS buying_signals JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS objections     JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS open_issues    JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS next_steps     JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS meeting_sentiment TEXT DEFAULT 'neutral';

-- Index for cross-meeting commitment queries
CREATE INDEX IF NOT EXISTS idx_meeting_insights_meeting_id ON meeting_insights(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_insights_user_id    ON meeting_insights(user_id);

-- GIN indexes for JSONB intelligence fields (enables fast cross-meeting queries)
CREATE INDEX IF NOT EXISTS idx_insights_commitments    ON meeting_insights USING gin(commitments);
CREATE INDEX IF NOT EXISTS idx_insights_risks          ON meeting_insights USING gin(risks);
