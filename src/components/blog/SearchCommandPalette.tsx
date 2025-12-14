// ============================================================================
// HOLESCALE BLOG - SEARCH COMMAND PALETTE
// ============================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
  Loader2,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPostCard, Category, Tag } from '@/types/blog';
import { useBlogSearch, useScrollLock } from '@/hooks/useBlog';
import {
  getBlogPostUrl,
  getCategoryUrl,
  getTagUrl,
  formatRelativeDate,
  highlightSearchTerm,
} from '@/lib/blog-utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  posts?: BlogPostCard[];
  categories?: Category[];
  tags?: Tag[];
  placeholder?: string;
  className?: string;
}

interface SearchSection {
  title: string;
  items: SearchItem[];
}

interface SearchItem {
  id: string;
  type: 'post' | 'category' | 'tag' | 'recent';
  title: string;
  subtitle?: string;
  url: string;
  icon?: React.ReactNode;
  image?: string;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function SearchCommandPalette({
  isOpen,
  onClose,
  posts = [],
  categories = [],
  tags = [],
  placeholder = 'Search articles, categories, tags...',
  className,
}: SearchCommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    isSearching,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
  } = useBlogSearch();

  const [selectedIndex, setSelectedIndex] = useState(0);

  useScrollLock(isOpen);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen, setQuery]);

  // Filter results based on query
  const filteredPosts = query.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredCategories = query.trim()
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredTags = query.trim()
    ? tags.filter((tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  // Build sections for display
  const sections: SearchSection[] = [];

  if (!query.trim()) {
    // Show recent searches and trending when no query
    if (recentSearches.length > 0) {
      sections.push({
        title: 'Recent Searches',
        items: recentSearches.map((search, index) => ({
          id: `recent-${index}`,
          type: 'recent' as const,
          title: search,
          url: `/blog?search=${encodeURIComponent(search)}`,
          icon: <Clock className="w-4 h-4" />,
        })),
      });
    }

    // Trending/Popular posts
    const trendingPosts = [...posts]
      .sort((a, b) => b.engagement.views - a.engagement.views)
      .slice(0, 4);

    if (trendingPosts.length > 0) {
      sections.push({
        title: 'Trending',
        items: trendingPosts.map((post) => ({
          id: post.id,
          type: 'post' as const,
          title: post.title,
          subtitle: `${post.readingProgress.estimatedReadTime} min read`,
          url: getBlogPostUrl(post.slug),
          image: post.featuredImage.src,
        })),
      });
    }
  } else {
    // Show search results
    if (filteredPosts.length > 0) {
      sections.push({
        title: 'Articles',
        items: filteredPosts.map((post) => ({
          id: post.id,
          type: 'post' as const,
          title: post.title,
          subtitle: `${post.category.name} • ${formatRelativeDate(post.publishedAt)}`,
          url: getBlogPostUrl(post.slug),
          image: post.featuredImage.src,
        })),
      });
    }

    if (filteredCategories.length > 0) {
      sections.push({
        title: 'Categories',
        items: filteredCategories.map((cat) => ({
          id: cat.id,
          type: 'category' as const,
          title: cat.name,
          subtitle: `${cat.postCount} articles`,
          url: getCategoryUrl(cat.slug),
          icon: <FileText className="w-4 h-4" />,
        })),
      });
    }

    if (filteredTags.length > 0) {
      sections.push({
        title: 'Tags',
        items: filteredTags.map((tag) => ({
          id: tag.id,
          type: 'tag' as const,
          title: tag.name,
          subtitle: `${tag.postCount} articles`,
          url: getTagUrl(tag.slug),
          icon: <TrendingUp className="w-4 h-4" />,
        })),
      });
    }
  }

  // Flatten items for keyboard navigation
  const allItems = sections.flatMap((section) => section.items);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (allItems[selectedIndex]) {
            const item = allItems[selectedIndex];
            if (query.trim()) {
              addToRecentSearches(query);
            }
            navigate(item.url);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [allItems, selectedIndex, query, addToRecentSearches, navigate, onClose]
  );

  // Handle item click
  const handleItemClick = (item: SearchItem) => {
    if (query.trim()) {
      addToRecentSearches(query);
    }
    navigate(item.url);
    onClose();
  };

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'fixed left-1/2 top-[15%] z-50 -translate-x-1/2',
              'w-full max-w-2xl mx-4',
              'rounded-2xl bg-white shadow-2xl overflow-hidden',
              'border border-neutral-200',
              className
            )}
          >
            {/* Search Input */}
            <div className="relative border-b border-neutral-200">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                  'w-full h-16 pl-14 pr-14',
                  'text-lg text-neutral-900 placeholder:text-neutral-400',
                  'bg-transparent border-0 outline-none',
                  'focus:ring-0'
                )}
              />
              {isSearching && (
                <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 animate-spin" />
              )}
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
              {sections.length === 0 && query.trim() ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 font-medium mb-1">No results found</p>
                  <p className="text-sm text-neutral-500">
                    Try different keywords or browse categories
                  </p>
                </div>
              ) : (
                sections.map((section, sectionIndex) => {
                  const sectionStartIndex = sections
                    .slice(0, sectionIndex)
                    .reduce((acc, s) => acc + s.items.length, 0);

                  return (
                    <div key={section.title} className="py-2">
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          {section.title}
                        </span>
                        {section.title === 'Recent Searches' && (
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-neutral-400 hover:text-neutral-600"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {section.items.map((item, itemIndex) => {
                        const globalIndex = sectionStartIndex + itemIndex;
                        const isSelected = selectedIndex === globalIndex;

                        return (
                          <button
                            key={item.id}
                            data-index={globalIndex}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'w-full flex items-center gap-4 px-4 py-3',
                              'text-left transition-colors',
                              isSelected
                                ? 'bg-primary/10'
                                : 'hover:bg-neutral-50'
                            )}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : item.icon ? (
                              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">
                                {item.icon}
                              </div>
                            ) : null}

                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  'font-medium truncate',
                                  isSelected ? 'text-primary' : 'text-neutral-900'
                                )}
                                dangerouslySetInnerHTML={{
                                  __html: query
                                    ? highlightSearchTerm(item.title, query)
                                    : item.title,
                                }}
                              />
                              {item.subtitle && (
                                <p className="text-sm text-neutral-500 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>

                            {isSelected && (
                              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 font-mono">↓</kbd>
                    <span className="ml-1">Navigate</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 font-mono flex items-center">
                      <CornerDownLeft className="w-3 h-3" />
                    </kbd>
                    <span className="ml-1">Select</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 font-mono">Esc</kbd>
                    <span className="ml-1">Close</span>
                  </span>
                </div>
                <span className="flex items-center gap-2">
                  <Command className="w-3 h-3" />
                  <span>K to search</span>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// -----------------------------------------------------------------------------
// Keyboard Shortcut Hook
// -----------------------------------------------------------------------------

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}

export default SearchCommandPalette;
