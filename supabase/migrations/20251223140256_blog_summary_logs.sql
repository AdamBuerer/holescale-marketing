-- =====================================================
-- Blog Summary Logs Table
-- For caching AI-generated blog summaries
-- =====================================================

-- Drop table if it exists (to avoid conflicts)
DROP TABLE IF EXISTS blog_summary_logs CASCADE;

-- Create blog_summary_logs table
CREATE TABLE blog_summary_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL DEFAULT 'summary_generated',
  summary_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint to ensure action is valid
  CONSTRAINT valid_action CHECK (action IN ('summary_generated', 'summary_requested', 'summary_failed'))
);

-- Create index for fast lookups by post_id
CREATE INDEX IF NOT EXISTS idx_blog_summary_logs_post_id ON blog_summary_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_summary_logs_created_at ON blog_summary_logs(created_at DESC);

-- Enable RLS
ALTER TABLE blog_summary_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to summary logs (for cached summaries)
-- This allows the frontend to check for cached summaries
DROP POLICY IF EXISTS "Public can read summary logs" ON blog_summary_logs;
CREATE POLICY "Public can read summary logs"
  ON blog_summary_logs FOR SELECT
  USING (true);

-- Note: Service role (used by edge functions) bypasses RLS by default,
-- so it can insert/update without explicit policies

