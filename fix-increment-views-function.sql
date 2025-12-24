-- =====================================================
-- Fix increment_blog_post_views function to use 'views' column
-- =====================================================
-- Run this in your Supabase SQL Editor to update the function

-- Function to increment blog post views
-- Updated to use 'views' column (not 'view_count')
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_blog_post_views(UUID) TO anon, authenticated;

