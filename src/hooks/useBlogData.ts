// ============================================================================
// HOLESCALE BLOG - DATA HOOKS
// React Query hooks for blog data fetching
// ============================================================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllPosts,
  getPostBySlug,
  getFeaturedPosts,
  getRelatedPosts,
  getAllCategories,
  getCategoryBySlug,
  getAllTags,
  getTagBySlug,
  getAllAuthors,
  getAuthorBySlug,
  getPostsByCategory,
  getPostsByTag,
  getPostsByAuthor,
  searchPosts,
  incrementPostViews,
  type GetPostsOptions,
} from '@/lib/blog-api';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const blogQueryKeys = {
  all: ['blog'] as const,
  posts: () => [...blogQueryKeys.all, 'posts'] as const,
  postsList: (options: GetPostsOptions) =>
    [...blogQueryKeys.posts(), 'list', options] as const,
  postDetail: (slug: string) => [...blogQueryKeys.posts(), 'detail', slug] as const,
  featuredPosts: (limit?: number) =>
    [...blogQueryKeys.posts(), 'featured', limit] as const,
  relatedPosts: (postId: string, categoryId: string, limit?: number) =>
    [...blogQueryKeys.posts(), 'related', postId, categoryId, limit] as const,
  categories: () => [...blogQueryKeys.all, 'categories'] as const,
  categoryDetail: (slug: string) => [...blogQueryKeys.categories(), slug] as const,
  categoryPosts: (slug: string, options: Omit<GetPostsOptions, 'categorySlug'>) =>
    [...blogQueryKeys.categories(), slug, 'posts', options] as const,
  tags: () => [...blogQueryKeys.all, 'tags'] as const,
  tagDetail: (slug: string) => [...blogQueryKeys.tags(), slug] as const,
  tagPosts: (slug: string, options: Omit<GetPostsOptions, 'tagSlug'>) =>
    [...blogQueryKeys.tags(), slug, 'posts', options] as const,
  authors: () => [...blogQueryKeys.all, 'authors'] as const,
  authorDetail: (slug: string) => [...blogQueryKeys.authors(), slug] as const,
  authorPosts: (slug: string, options: Omit<GetPostsOptions, 'authorSlug'>) =>
    [...blogQueryKeys.authors(), slug, 'posts', options] as const,
  search: (query: string, options: Omit<GetPostsOptions, 'search'>) =>
    [...blogQueryKeys.posts(), 'search', query, options] as const,
};

// -----------------------------------------------------------------------------
// Posts Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to fetch paginated blog posts with filtering
 */
export function useBlogPosts(options: GetPostsOptions = {}) {
  return useQuery({
    queryKey: blogQueryKeys.postsList(options),
    queryFn: () => getAllPosts(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlogPost(slug: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: blogQueryKeys.postDetail(slug),
    queryFn: async () => {
      const post = await getPostBySlug(slug);
      // Track view (fire and forget)
      if (post) {
        incrementPostViews(post.id).catch(() => {});
      }
      return post;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch featured posts
 */
export function useFeaturedPosts(limit: number = 3) {
  return useQuery({
    queryKey: blogQueryKeys.featuredPosts(limit),
    queryFn: () => getFeaturedPosts(limit),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch related posts
 */
export function useRelatedPosts(
  postId: string,
  categoryId: string,
  limit: number = 3
) {
  return useQuery({
    queryKey: blogQueryKeys.relatedPosts(postId, categoryId, limit),
    queryFn: () => getRelatedPosts(postId, categoryId, limit),
    enabled: !!postId && !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

// -----------------------------------------------------------------------------
// Categories Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to fetch all categories
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: blogQueryKeys.categories(),
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a single category by slug
 */
export function useBlogCategory(slug: string) {
  return useQuery({
    queryKey: blogQueryKeys.categoryDetail(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch posts by category
 */
export function useCategoryPosts(
  categorySlug: string,
  options: Omit<GetPostsOptions, 'categorySlug'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.categoryPosts(categorySlug, options),
    queryFn: () => getPostsByCategory(categorySlug, options),
    enabled: !!categorySlug,
    staleTime: 1000 * 60 * 5,
  });
}

// -----------------------------------------------------------------------------
// Tags Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to fetch all tags
 */
export function useBlogTags() {
  return useQuery({
    queryKey: blogQueryKeys.tags(),
    queryFn: getAllTags,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch a single tag by slug
 */
export function useBlogTag(slug: string) {
  return useQuery({
    queryKey: blogQueryKeys.tagDetail(slug),
    queryFn: () => getTagBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch posts by tag
 */
export function useTagPosts(
  tagSlug: string,
  options: Omit<GetPostsOptions, 'tagSlug'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.tagPosts(tagSlug, options),
    queryFn: () => getPostsByTag(tagSlug, options),
    enabled: !!tagSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// -----------------------------------------------------------------------------
// Authors Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to fetch all authors
 */
export function useBlogAuthors() {
  return useQuery({
    queryKey: blogQueryKeys.authors(),
    queryFn: getAllAuthors,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch a single author by slug
 */
export function useBlogAuthor(slug: string) {
  return useQuery({
    queryKey: blogQueryKeys.authorDetail(slug),
    queryFn: () => getAuthorBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch posts by author
 */
export function useAuthorPosts(
  authorSlug: string,
  options: Omit<GetPostsOptions, 'authorSlug'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.authorPosts(authorSlug, options),
    queryFn: () => getPostsByAuthor(authorSlug, options),
    enabled: !!authorSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// -----------------------------------------------------------------------------
// Search Hook
// -----------------------------------------------------------------------------

/**
 * Hook to search blog posts
 */
export function useBlogSearch(
  query: string,
  options: Omit<GetPostsOptions, 'search'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.search(query, options),
    queryFn: () => searchPosts(query, options),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}

// -----------------------------------------------------------------------------
// Prefetch Utilities
// -----------------------------------------------------------------------------

/**
 * Prefetch a blog post (for hover/link prefetching)
 */
export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: blogQueryKeys.postDetail(slug),
      queryFn: () => getPostBySlug(slug),
      staleTime: 1000 * 60 * 5,
    });
  };
}

/**
 * Prefetch category posts
 */
export function usePrefetchCategoryPosts() {
  const queryClient = useQueryClient();

  return (categorySlug: string) => {
    queryClient.prefetchQuery({
      queryKey: blogQueryKeys.categoryPosts(categorySlug, {}),
      queryFn: () => getPostsByCategory(categorySlug),
      staleTime: 1000 * 60 * 5,
    });
  };
}
