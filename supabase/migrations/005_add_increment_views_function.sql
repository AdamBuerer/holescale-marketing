-- =====================================================
-- Add increment_blog_post_views RPC function
-- =====================================================

-- Function to increment blog post views
-- This allows safe atomic incrementing of view counts
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_blog_post_views(UUID) TO anon, authenticated;

