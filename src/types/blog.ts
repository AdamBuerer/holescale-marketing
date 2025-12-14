// ============================================================================
// HOLESCALE BLOG - TYPE DEFINITIONS
// ============================================================================

// -----------------------------------------------------------------------------
// Content Types
// -----------------------------------------------------------------------------

export type ContentType =
  | 'article'
  | 'guide'
  | 'case-study'
  | 'industry-news'
  | 'product-update'
  | 'whitepaper'
  | 'video'
  | 'podcast'
  | 'infographic';

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  role: string;
  company?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  articlesCount: number;
  isGuest?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount: number;
  parentId?: string;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description?: string;
  totalParts: number;
  completedParts: number;
}

// -----------------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------------

export interface FeaturedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurHash?: string;
  caption?: string;
  credit?: string;
  creditUrl?: string;
}

// -----------------------------------------------------------------------------
// Reading & Engagement
// -----------------------------------------------------------------------------

export interface ReadingProgress {
  estimatedReadTime: number;
  wordCount: number;
  currentProgress?: number;
}

export interface Engagement {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks?: number;
}

// -----------------------------------------------------------------------------
// SEO
// -----------------------------------------------------------------------------

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Table of Contents
// -----------------------------------------------------------------------------

export interface TOCItem {
  id: string;
  title: string;
  level: number;
  parentId?: string;
  children?: TOCItem[];
}

// -----------------------------------------------------------------------------
// Blog Post Types
// -----------------------------------------------------------------------------

export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: FeaturedImage;
  category: Category;
  tags: Tag[];
  author: Author;
  publishedAt: string;
  contentType: ContentType;
  readingProgress: ReadingProgress;
  engagement: Engagement;
  series?: Series;
  seriesOrder?: number;
  isFeatured?: boolean;
  isPinned?: boolean;
}

export interface BlogPost extends BlogPostCard {
  subtitle?: string;
  content: string;
  tableOfContents: TOCItem[];
  views: number;
  likes: number;
  commentsCount: number;
  commentsEnabled: boolean;
  seo: SEOMetadata;
  relatedPostIds?: string[];
  previousPost?: { slug: string; title: string };
  nextPost?: { slug: string; title: string };
  updatedAt?: string;
  status: PostStatus;
}

// -----------------------------------------------------------------------------
// Comments
// -----------------------------------------------------------------------------

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  replyCount?: number;
  isEdited?: boolean;
  isPinned?: boolean;
  status: 'visible' | 'hidden' | 'flagged';
}

// -----------------------------------------------------------------------------
// Filtering & Search
// -----------------------------------------------------------------------------

export interface BlogFilters {
  category?: string;
  tag?: string;
  tags?: string[];
  author?: string;
  contentType?: ContentType;
  dateRange?: { start: string; end: string };
  search?: string;
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
}

export interface SearchResult {
  posts: BlogPostCard[];
  totalCount: number;
  query: string;
  suggestions?: string[];
  facets?: {
    categories: { slug: string; count: number }[];
    tags: { slug: string; count: number }[];
    contentTypes: { type: ContentType; count: number }[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// -----------------------------------------------------------------------------
// User Interactions
// -----------------------------------------------------------------------------

export interface UserBookmark {
  postId: string;
  createdAt: string;
  post?: BlogPostCard;
}

export interface ReadingHistory {
  postId: string;
  lastReadAt: string;
  progress: number;
  completed: boolean;
  post?: BlogPostCard;
}

export interface UserPreferences {
  preferredCategories?: string[];
  preferredTags?: string[];
  emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  interests?: string[];
}

// -----------------------------------------------------------------------------
// Newsletter
// -----------------------------------------------------------------------------

export interface NewsletterSubscription {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  subscribedAt: string;
  confirmed: boolean;
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------

export interface PostAnalytics {
  postId: string;
  views: number;
  uniqueViews: number;
  avgReadTime: number;
  completionRate: number;
  bounceRate: number;
  scrollDepth: {
    '25%': number;
    '50%': number;
    '75%': number;
    '100%': number;
  };
  sources: { source: string; count: number }[];
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
}
