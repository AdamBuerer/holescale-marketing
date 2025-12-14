// ============================================================================
// HOLESCALE BLOG - SUPABASE API
// Data access layer for blog content from Supabase
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import type {
  BlogPost,
  BlogPostCard,
  Author,
  Category,
  Tag,
  PaginatedResponse,
  ContentType,
} from '@/types/blog';

// -----------------------------------------------------------------------------
// Database Types (snake_case from Supabase)
// -----------------------------------------------------------------------------

interface DbAuthor {
  id: string;
  name: string;
  slug: string;
  avatar: string | null;
  bio: string | null;
  role: string | null;
  company: string | null;
  social: Record<string, string> | null;
  articles_count: number;
  created_at: string;
  updated_at: string;
}

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  post_count: number;
  created_at: string;
  updated_at: string;
}

interface DbTag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
  created_at: string;
  updated_at: string;
}

interface DbPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string | null;
  featured_image: { src: string; alt: string } | null;
  author_id: string | null;
  category_id: string | null;
  content_type: string;
  status: string;
  is_featured: boolean;
  reading_time: number;
  word_count: number;
  table_of_contents: Array<{ id: string; title: string; level: number }> | null;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
  } | null;
  views: number;
  likes: number;
  comments_count: number;
  shares: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  blog_authors?: DbAuthor | null;
  blog_categories?: DbCategory | null;
  blog_post_tags?: Array<{ blog_tags: DbTag }>;
}

// -----------------------------------------------------------------------------
// Transformers (DB -> Frontend Types)
// -----------------------------------------------------------------------------

function transformAuthor(db: DbAuthor): Author {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    avatar: db.avatar || '/images/default-avatar.png',
    bio: db.bio || '',
    role: db.role || '',
    company: db.company,
    social: {
      twitter: db.social?.twitter,
      linkedin: db.social?.linkedin,
      website: db.social?.website,
    },
    articlesCount: db.articles_count,
  };
}

function transformCategory(db: DbCategory): Category {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: db.description || undefined,
    color: db.color || '#3B82F6',
    postCount: db.post_count,
  };
}

function transformTag(db: DbTag): Tag {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    postCount: db.post_count,
  };
}

function transformPostCard(db: DbPost): BlogPostCard {
  const author = db.blog_authors
    ? transformAuthor(db.blog_authors)
    : {
        id: '',
        name: 'HoleScale Team',
        slug: 'holescale-team',
        avatar: '/images/default-avatar.png',
        bio: '',
        role: 'Content Team',
        social: {},
        articlesCount: 0,
      };

  const category = db.blog_categories
    ? transformCategory(db.blog_categories)
    : {
        id: '',
        name: 'Uncategorized',
        slug: 'uncategorized',
        postCount: 0,
      };

  const tags = db.blog_post_tags?.map((pt) => transformTag(pt.blog_tags)) || [];

  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    excerpt: db.excerpt || '',
    featuredImage: {
      src: db.featured_image?.src || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
      alt: db.featured_image?.alt || db.title,
    },
    category,
    tags,
    author,
    publishedAt: db.published_at || db.created_at,
    contentType: db.content_type as ContentType,
    readingProgress: {
      estimatedReadTime: db.reading_time,
      wordCount: db.word_count,
    },
    engagement: {
      views: db.views,
      likes: db.likes,
      comments: db.comments_count,
      shares: db.shares,
    },
    isFeatured: db.is_featured,
  };
}

function transformPost(db: DbPost): BlogPost {
  const card = transformPostCard(db);
  return {
    ...card,
    subtitle: db.subtitle || undefined,
    content: db.content || '',
    tableOfContents: db.table_of_contents || [],
    views: db.views,
    likes: db.likes,
    commentsCount: db.comments_count,
    commentsEnabled: true,
    seo: {
      metaTitle: db.seo?.metaTitle,
      metaDescription: db.seo?.metaDescription,
      keywords: db.seo?.keywords,
      canonicalUrl: db.seo?.canonicalUrl,
      ogImage: db.seo?.ogImage,
    },
    updatedAt: db.updated_at,
    status: db.status as 'draft' | 'published' | 'scheduled' | 'archived',
  };
}

// -----------------------------------------------------------------------------
// Query Options
// -----------------------------------------------------------------------------

export interface GetPostsOptions {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  contentType?: ContentType;
  featured?: boolean;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
}

// -----------------------------------------------------------------------------
// API Functions
// -----------------------------------------------------------------------------

/**
 * Get all published blog posts with pagination and filtering
 */
export async function getAllPosts(
  options: GetPostsOptions = {}
): Promise<PaginatedResponse<BlogPostCard>> {
  const {
    page = 1,
    pageSize = 12,
    categorySlug,
    tagSlug,
    authorSlug,
    contentType,
    featured,
    search,
    sortBy = 'newest',
  } = options;

  if (!supabase) {
    return {
      data: [],
      pagination: {
        page,
        pageSize,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('blog_posts')
    .select(
      `
      *,
      blog_authors (*),
      blog_categories (*),
      blog_post_tags (
        blog_tags (*)
      )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published');

  // Apply filters
  if (categorySlug) {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (authorSlug) {
    const { data: author } = await supabase
      .from('blog_authors')
      .select('id')
      .eq('slug', authorSlug)
      .single();
    if (author) {
      query = query.eq('author_id', author.id);
    }
  }

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  // Apply sorting
  switch (sortBy) {
    case 'oldest':
      query = query.order('published_at', { ascending: true });
      break;
    case 'popular':
      query = query.order('views', { ascending: false });
      break;
    case 'trending':
      query = query.order('views', { ascending: false }).order('published_at', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('published_at', { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  // Handle tag filtering (requires post-query filtering due to junction table)
  let posts = (data as DbPost[]) || [];
  if (tagSlug) {
    const { data: tag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();
    if (tag) {
      posts = posts.filter((post) =>
        post.blog_post_tags?.some((pt) => pt.blog_tags.id === tag.id)
      );
    }
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: posts.map(transformPostCard),
    pagination: {
      page,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      blog_authors (*),
      blog_categories (*),
      blog_post_tags (
        blog_tags (*)
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching post:', error);
    throw error;
  }

  return transformPost(data as DbPost);
}

/**
 * Get featured posts for hero section
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPostCard[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      blog_authors (*),
      blog_categories (*),
      blog_post_tags (
        blog_tags (*)
      )
    `
    )
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured posts:', error);
    throw error;
  }

  return ((data as DbPost[]) || []).map(transformPostCard);
}

/**
 * Get related posts by category
 */
export async function getRelatedPosts(
  postId: string,
  categoryId: string,
  limit: number = 3
): Promise<BlogPostCard[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      blog_authors (*),
      blog_categories (*),
      blog_post_tags (
        blog_tags (*)
      )
    `
    )
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', error);
    throw error;
  }

  return ((data as DbPost[]) || []).map(transformPostCard);
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .gt('post_count', 0)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return ((data as DbCategory[]) || []).map(transformCategory);
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching category:', error);
    throw error;
  }

  return transformCategory(data as DbCategory);
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .gt('post_count', 0)
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }

  return ((data as DbTag[]) || []).map(transformTag);
}

/**
 * Get a tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching tag:', error);
    throw error;
  }

  return transformTag(data as DbTag);
}

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .gt('articles_count', 0)
    .order('name');

  if (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }

  return ((data as DbAuthor[]) || []).map(transformAuthor);
}

/**
 * Get an author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching author:', error);
    throw error;
  }

  return transformAuthor(data as DbAuthor);
}

/**
 * Increment post views
 */
export async function incrementPostViews(postId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.rpc('increment_blog_post_views', {
    post_id: postId,
  });

  if (error) {
    // Don't throw - views increment is non-critical
    console.error('Error incrementing views:', error);
  }
}

/**
 * Get posts by tag slug
 */
export async function getPostsByTag(
  tagSlug: string,
  options: Omit<GetPostsOptions, 'tagSlug'> = {}
): Promise<PaginatedResponse<BlogPostCard>> {
  return getAllPosts({ ...options, tagSlug });
}

/**
 * Get posts by category slug
 */
export async function getPostsByCategory(
  categorySlug: string,
  options: Omit<GetPostsOptions, 'categorySlug'> = {}
): Promise<PaginatedResponse<BlogPostCard>> {
  return getAllPosts({ ...options, categorySlug });
}

/**
 * Get posts by author slug
 */
export async function getPostsByAuthor(
  authorSlug: string,
  options: Omit<GetPostsOptions, 'authorSlug'> = {}
): Promise<PaginatedResponse<BlogPostCard>> {
  return getAllPosts({ ...options, authorSlug });
}

/**
 * Search posts
 */
export async function searchPosts(
  query: string,
  options: Omit<GetPostsOptions, 'search'> = {}
): Promise<PaginatedResponse<BlogPostCard>> {
  return getAllPosts({ ...options, search: query });
}
