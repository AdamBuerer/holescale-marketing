// ============================================================================
// HOLESCALE BLOG - CUSTOM HOOKS
// ============================================================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { BlogFilters, BlogPostCard, Comment } from '@/types/blog';
import { blogStorage } from '@/lib/blog-utils';

// -----------------------------------------------------------------------------
// Infinite Scroll Hook
// -----------------------------------------------------------------------------

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  threshold: number = 200
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, threshold]);

  return { sentinelRef };
}

// -----------------------------------------------------------------------------
// Reading Progress Hook
// -----------------------------------------------------------------------------

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 100) {
        setHasScrolled(true);
      }

      const article = articleRef.current;
      if (!article) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrolled)));
        return;
      }

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const start = articleTop - windowHeight;
      const end = articleTop + articleHeight - windowHeight;
      const current = scrollY - start;
      const total = end - start;

      const percentage = (current / total) * 100;
      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  return { progress, hasScrolled, articleRef };
}

// -----------------------------------------------------------------------------
// Active Heading Hook (for TOC)
// -----------------------------------------------------------------------------

export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
}

// -----------------------------------------------------------------------------
// Blog Search Hook
// -----------------------------------------------------------------------------

export function useBlogSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<BlogPostCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('holescale_recent_searches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Placeholder for API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const addToRecentSearches = useCallback((searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('holescale_recent_searches', JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('holescale_recent_searches');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
  };
}

// -----------------------------------------------------------------------------
// Blog Filters Hook
// -----------------------------------------------------------------------------

export function useBlogFilters(initialFilters?: Partial<BlogFilters>) {
  const [filters, setFilters] = useState<BlogFilters>({
    sortBy: 'newest',
    ...initialFilters,
  });

  const updateFilter = useCallback(<K extends keyof BlogFilters>(
    key: K,
    value: BlogFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ sortBy: 'newest' });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(filters.category || filters.contentType || filters.tag ||
              filters.author || filters.search || (filters.tags && filters.tags.length > 0));
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.contentType) count++;
    if (filters.tag) count++;
    if (filters.author) count++;
    if (filters.tags) count += filters.tags.length;
    return count;
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}

// -----------------------------------------------------------------------------
// Bookmark Hook
// -----------------------------------------------------------------------------

export function useBookmark(postId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(blogStorage.isBookmarked(postId));
  }, [postId]);

  const toggleBookmark = useCallback(async () => {
    setIsLoading(true);
    try {
      const newState = blogStorage.toggleBookmark(postId);
      setIsBookmarked(newState);
      
      // Track bookmark action
      const { trackBlogEngagement } = await import('@/lib/analytics');
      trackBlogEngagement(postId, newState ? 'bookmark' : 'unbookmark');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  return { isBookmarked, toggleBookmark, isLoading };
}

// -----------------------------------------------------------------------------
// Reading Session Hook
// -----------------------------------------------------------------------------

export function useReadingSession(postId: string) {
  const startTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const interactions = useRef<Array<{ type: string; timestamp: number; data?: unknown }>>([]);

  const trackInteraction = useCallback((type: string, data?: unknown) => {
    interactions.current.push({ type, timestamp: Date.now(), data });
  }, []);

  const updateScrollDepth = useCallback((depth: number) => {
    maxScrollDepth.current = Math.max(maxScrollDepth.current, depth);
  }, []);

  useEffect(() => {
    blogStorage.addToReadHistory(postId);

    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      const sessionData = {
        postId,
        duration,
        maxScrollDepth: Math.round(maxScrollDepth.current),
        interactions: interactions.current,
        completedAt: new Date().toISOString(),
      };

      // Send analytics (placeholder)
      console.log('Reading session:', sessionData);
    };
  }, [postId]);

  return { trackInteraction, updateScrollDepth };
}

// -----------------------------------------------------------------------------
// Share Hook
// -----------------------------------------------------------------------------

export function useShare(url: string, title: string, text?: string) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const share = useCallback(async () => {
    if (!isSupported) return false;

    try {
      await navigator.share({ url, title, text });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }, [url, title, text, isSupported]);

  return { share, isSupported };
}

// -----------------------------------------------------------------------------
// Like Hook
// -----------------------------------------------------------------------------

export function useLike(postId: string, initialLikes: number = 0) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('holescale_liked_posts') || '[]');
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const toggleLike = useCallback(async () => {
    setIsLoading(true);
    const newIsLiked = !isLiked;

    setIsLiked(newIsLiked);
    setLikes((prev) => prev + (newIsLiked ? 1 : -1));

    try {
      const likedPosts = JSON.parse(localStorage.getItem('holescale_liked_posts') || '[]');
      if (newIsLiked) {
        likedPosts.push(postId);
      } else {
        const index = likedPosts.indexOf(postId);
        if (index > -1) likedPosts.splice(index, 1);
      }
      localStorage.setItem('holescale_liked_posts', JSON.stringify(likedPosts));
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLiked]);

  return { likes, isLiked, toggleLike, isLoading };
}

// -----------------------------------------------------------------------------
// Newsletter Hook
// -----------------------------------------------------------------------------

interface UseNewsletterOptions {
  source?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useNewsletter(options: UseNewsletterOptions = {}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Placeholder for API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail('');
      options.onSuccess?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to subscribe. Please try again.');
      options.onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, options]);

  const reset = useCallback(() => {
    setEmail('');
    setIsSuccess(false);
    setError(null);
  }, []);

  return { email, setEmail, subscribe, isSubmitting, isSuccess, error, reset };
}

// -----------------------------------------------------------------------------
// Comments Hook
// -----------------------------------------------------------------------------

export function useComments(postId: string, pageSize: number = 10) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadComments = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);
    try {
      // Placeholder for API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setComments([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [postId, pageSize]);

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadComments(nextPage);
    }
  }, [isLoading, hasMore, page, loadComments]);

  return { comments, isLoading, hasMore, loadMore, refresh: () => loadComments(1) };
}

// -----------------------------------------------------------------------------
// Copy Code Hook
// -----------------------------------------------------------------------------

export function useCopyCode() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  const isCopied = useCallback((id: string) => copiedId === id, [copiedId]);

  return { copyCode, isCopied };
}

// -----------------------------------------------------------------------------
// Media Query Hooks
// -----------------------------------------------------------------------------

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

// -----------------------------------------------------------------------------
// Scroll Lock Hook
// -----------------------------------------------------------------------------

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
