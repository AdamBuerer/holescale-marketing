-- =====================================================
-- Blog Content System Schema
-- For HoleScale buyer and supplier education content
-- =====================================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content_html TEXT NOT NULL,
  excerpt TEXT,

  -- Categorization
  category VARCHAR(100), -- 'Buyer Education' or 'Supplier Education'
  persona VARCHAR(100), -- 'Procurement Officer', 'Marketing Manager', etc.
  funnel_stage VARCHAR(50), -- 'Top', 'Middle', 'Bottom'

  -- SEO
  target_keywords TEXT[], -- Array of keywords
  schema_type VARCHAR(50) DEFAULT 'Article',

  -- Media
  featured_image_url TEXT,
  featured_image_alt TEXT,

  -- Publishing
  publish_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMPTZ,
  author_name VARCHAR(255),

  -- Metadata
  estimated_word_count INTEGER,
  read_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog internal links (for tracking link structure)
CREATE TABLE IF NOT EXISTS blog_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  anchor_text TEXT NOT NULL,
  target_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog categories (for navigation)
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES blog_categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags (flexible tagging)
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: posts to tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, blog_tag_id)
);

-- Related posts (manually curated)
CREATE TABLE IF NOT EXISTS blog_related_posts (
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  related_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (blog_post_id, related_post_id)
);

-- Indexes for performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_persona ON blog_posts(persona);
CREATE INDEX idx_blog_posts_publish_status ON blog_posts(publish_status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_internal_links_post ON blog_internal_links(blog_post_id);
CREATE INDEX idx_blog_post_tags_post ON blog_post_tags(blog_post_id);
CREATE INDEX idx_blog_post_tags_tag ON blog_post_tags(blog_tag_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Function to calculate read time
CREATE OR REPLACE FUNCTION calculate_read_time(word_count INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Assuming 200 words per minute reading speed
  RETURN CEIL(word_count::DECIMAL / 200);
END;
$$ LANGUAGE plpgsql;

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, sort_order) VALUES
('Buyer Education', 'buyer-education', 'Educational content for packaging and promo buyers', 1),
('Supplier Education', 'supplier-education', 'Resources for manufacturers and suppliers', 2),
('Industry Trends', 'industry-trends', 'Market analysis and trends', 3),
('How-To Guides', 'how-to-guides', 'Step-by-step guides and tutorials', 4)
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_related_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (publish_status = 'published');

-- Allow public read access to categories and tags
CREATE POLICY "Public can read categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read tags"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Public can read published post tags"
  ON blog_post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE id = blog_post_id AND publish_status = 'published'
    )
  );

-- Allow authenticated users with admin role to manage all
-- (You'll need to adjust this based on your auth setup)
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
