// ============================================================================
// HOLESCALE BLOG - UTILITY FUNCTIONS
// ============================================================================

import type { BlogPostCard, TOCItem, ContentType } from '@/types/blog';

// -----------------------------------------------------------------------------
// Reading Time Calculation
// -----------------------------------------------------------------------------

const WORDS_PER_MINUTE = 238;
const CODE_BLOCK_SECONDS = 30;
const IMAGE_SECONDS = 12;

export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const codeBlocks = (content.match(/<pre/g) || []).length;
  const images = (content.match(/<img/g) || []).length;

  const readingMinutes = words / WORDS_PER_MINUTE;
  const codeMinutes = (codeBlocks * CODE_BLOCK_SECONDS) / 60;
  const imageMinutes = (images * IMAGE_SECONDS) / 60;

  return Math.ceil(readingMinutes + codeMinutes + imageMinutes);
}

export function calculateWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).length;
}

// -----------------------------------------------------------------------------
// Table of Contents
// -----------------------------------------------------------------------------

export function extractHeadings(content: string): TOCItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-4]>/gi;
  const headings: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      id: match[2],
      title: match[3].trim(),
      level: parseInt(match[1], 10),
    });
  }

  return headings;
}

export function buildNestedTOC(flatItems: TOCItem[]): TOCItem[] {
  const result: TOCItem[] = [];
  const stack: TOCItem[] = [];

  flatItems.forEach((item) => {
    const newItem: TOCItem = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(newItem);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(newItem);
      newItem.parentId = parent.id;
    }

    stack.push(newItem);
  });

  return result;
}

// -----------------------------------------------------------------------------
// Slug Generation
// -----------------------------------------------------------------------------

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// -----------------------------------------------------------------------------
// Content Type Helpers
// -----------------------------------------------------------------------------

const contentTypeConfig: Record<ContentType, { label: string; color: string; icon: string }> = {
  article: { label: 'Article', color: '#3B82F6', icon: 'FileText' },
  guide: { label: 'Guide', color: '#10B981', icon: 'BookOpen' },
  'case-study': { label: 'Case Study', color: '#8B5CF6', icon: 'Briefcase' },
  'industry-news': { label: 'Industry News', color: '#F59E0B', icon: 'Newspaper' },
  'product-update': { label: 'Product Update', color: '#EC4899', icon: 'Rocket' },
  whitepaper: { label: 'Whitepaper', color: '#6366F1', icon: 'FileText' },
  video: { label: 'Video', color: '#EF4444', icon: 'Play' },
  podcast: { label: 'Podcast', color: '#14B8A6', icon: 'Headphones' },
  infographic: { label: 'Infographic', color: '#F97316', icon: 'BarChart' },
};

export function getContentTypeLabel(type: ContentType): string {
  return contentTypeConfig[type]?.label || type;
}

export function getContentTypeColor(type: ContentType): string {
  return contentTypeConfig[type]?.color || '#6B7280';
}

export function getContentTypeIcon(type: ContentType): string {
  return contentTypeConfig[type]?.icon || 'FileText';
}

// -----------------------------------------------------------------------------
// Text Processing
// -----------------------------------------------------------------------------

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncateText(text, maxLength);
}

export function highlightSearchTerm(text: string, term: string): string {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
}

// -----------------------------------------------------------------------------
// URL Builders
// -----------------------------------------------------------------------------

export function getBlogPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function getCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

export function getTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

export function getAuthorUrl(slug: string): string {
  return `/blog/author/${slug}`;
}

export function getSeriesUrl(slug: string): string {
  return `/blog/series/${slug}`;
}

// -----------------------------------------------------------------------------
// Share URLs
// -----------------------------------------------------------------------------

export function generateShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
  };
}

// -----------------------------------------------------------------------------
// Sorting
// -----------------------------------------------------------------------------

export function sortPosts(
  posts: BlogPostCard[],
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
): BlogPostCard[] {
  const sorted = [...posts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case 'oldest':
      return sorted.sort((a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.engagement.views - a.engagement.views);
    case 'trending':
      return sorted.sort((a, b) => {
        const scoreA = a.engagement.views * 0.4 + a.engagement.likes * 0.3 +
                       a.engagement.comments * 0.2 + a.engagement.shares * 0.1;
        const scoreB = b.engagement.views * 0.4 + b.engagement.likes * 0.3 +
                       b.engagement.comments * 0.2 + b.engagement.shares * 0.1;
        return scoreB - scoreA;
      });
    default:
      return sorted;
  }
}

// -----------------------------------------------------------------------------
// Local Storage
// -----------------------------------------------------------------------------

const STORAGE_KEYS = {
  readHistory: 'holescale_blog_read_history',
  bookmarks: 'holescale_blog_bookmarks',
  preferences: 'holescale_blog_preferences',
};

export const blogStorage = {
  getReadHistory(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.readHistory);
    return data ? JSON.parse(data) : [];
  },

  addToReadHistory(postId: string): void {
    if (typeof window === 'undefined') return;
    const history = this.getReadHistory();
    const filtered = history.filter((id) => id !== postId);
    filtered.unshift(postId);
    localStorage.setItem(STORAGE_KEYS.readHistory, JSON.stringify(filtered.slice(0, 50)));
  },

  getBookmarks(): string[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.bookmarks);
    return data ? JSON.parse(data) : [];
  },

  toggleBookmark(postId: string): boolean {
    if (typeof window === 'undefined') return false;
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(postId);

    if (index > -1) {
      bookmarks.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
      return false;
    } else {
      bookmarks.unshift(postId);
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
      return true;
    }
  },

  isBookmarked(postId: string): boolean {
    return this.getBookmarks().includes(postId);
  },
};

// -----------------------------------------------------------------------------
// Clipboard
// -----------------------------------------------------------------------------

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Accessibility
// -----------------------------------------------------------------------------

export function getAriaLabel(post: BlogPostCard): string {
  return `${post.title}. ${getContentTypeLabel(post.contentType)} by ${post.author.name}. ${post.readingProgress.estimatedReadTime} minute read.`;
}
