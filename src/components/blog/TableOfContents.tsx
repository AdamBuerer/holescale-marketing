// ============================================================================
// HOLESCALE BLOG - TABLE OF CONTENTS COMPONENT
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TOCItem } from '@/types/blog';
import { useActiveHeading, useIsMobile } from '@/hooks/useBlog';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
  variant?: 'default' | 'sticky' | 'floating' | 'inline';
  title?: string;
  showProgress?: boolean;
  collapsible?: boolean;
  maxDepth?: number;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function TableOfContents({
  items,
  className,
  variant = 'default',
  title = 'On This Page',
  showProgress = true,
  collapsible = true,
  maxDepth = 3,
}: TableOfContentsProps) {
  const headingIds = items.map((item) => item.id);
  const activeId = useActiveHeading(headingIds);
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const filteredItems = items.filter((item) => item.level <= maxDepth);

  if (filteredItems.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      if (isMobile) setIsExpanded(false);
    }
  };

  switch (variant) {
    case 'sticky':
      return (
        <StickyTOC
          items={filteredItems}
          activeId={activeId}
          title={title}
          showProgress={showProgress}
          onItemClick={scrollToHeading}
          className={className}
        />
      );
    case 'floating':
      return (
        <FloatingTOC
          items={filteredItems}
          activeId={activeId}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onItemClick={scrollToHeading}
          className={className}
        />
      );
    case 'inline':
      return (
        <InlineTOC
          items={filteredItems}
          activeId={activeId}
          title={title}
          collapsible={collapsible}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onItemClick={scrollToHeading}
          className={className}
        />
      );
    default:
      return (
        <DefaultTOC
          items={filteredItems}
          activeId={activeId}
          title={title}
          onItemClick={scrollToHeading}
          className={className}
        />
      );
  }
}

// -----------------------------------------------------------------------------
// Default Variant
// -----------------------------------------------------------------------------

interface DefaultTOCProps {
  items: TOCItem[];
  activeId: string;
  title: string;
  onItemClick: (id: string) => void;
  className?: string;
}

function DefaultTOC({ items, activeId, title, onItemClick, className }: DefaultTOCProps) {
  return (
    <nav className={cn('space-y-3', className)} aria-label="Table of contents">
      <h4 className="font-semibold text-neutral-900 text-sm uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <TOCListItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </ul>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// Sticky Variant
// -----------------------------------------------------------------------------

interface StickyTOCProps {
  items: TOCItem[];
  activeId: string;
  title: string;
  showProgress: boolean;
  onItemClick: (id: string) => void;
  className?: string;
}

function StickyTOC({ items, activeId, title, showProgress, onItemClick, className }: StickyTOCProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const updateProgress = () => {
      const activeIndex = items.findIndex((item) => item.id === activeId);
      if (activeIndex !== -1) {
        setProgress(((activeIndex + 1) / items.length) * 100);
      }
    };

    updateProgress();
  }, [activeId, items, showProgress]);

  return (
    <nav
      className={cn(
        'sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto',
        'rounded-xl border border-neutral-200 bg-white p-5',
        'scrollbar-thin',
        className
      )}
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-neutral-900 text-sm">
          {title}
        </h4>
        {showProgress && (
          <span className="text-xs text-neutral-500">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {showProgress && (
        <div className="h-1 bg-neutral-100 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <ul className="space-y-1">
        {items.map((item) => (
          <TOCListItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onItemClick(item.id)}
            showIndicator
          />
        ))}
      </ul>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// Floating Variant (Mobile)
// -----------------------------------------------------------------------------

interface FloatingTOCProps {
  items: TOCItem[];
  activeId: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onItemClick: (id: string) => void;
  className?: string;
}

function FloatingTOC({
  items,
  activeId,
  isExpanded,
  setIsExpanded,
  onItemClick,
  className,
}: FloatingTOCProps) {
  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsExpanded(true)}
        className={cn(
          'fixed bottom-20 right-4 z-40',
          'w-12 h-12 rounded-full',
          'bg-neutral-900 text-white shadow-lg',
          'flex items-center justify-center',
          'hover:bg-neutral-800 transition-colors',
          isExpanded && 'hidden',
          className
        )}
        aria-label="Open table of contents"
      >
        <List className="w-5 h-5" />
      </motion.button>

      {/* Floating Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] rounded-t-2xl bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                <h4 className="font-semibold text-neutral-900">
                  Table of Contents
                </h4>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <nav className="overflow-y-auto max-h-[calc(70vh-60px)] p-4">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <TOCListItem
                      key={item.id}
                      item={item}
                      isActive={activeId === item.id}
                      onClick={() => onItemClick(item.id)}
                      variant="mobile"
                    />
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// -----------------------------------------------------------------------------
// Inline Variant
// -----------------------------------------------------------------------------

interface InlineTOCProps {
  items: TOCItem[];
  activeId: string;
  title: string;
  collapsible: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onItemClick: (id: string) => void;
  className?: string;
}

function InlineTOC({
  items,
  activeId,
  title,
  collapsible,
  isExpanded,
  setIsExpanded,
  onItemClick,
  className,
}: InlineTOCProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          collapsible && 'cursor-pointer hover:bg-neutral-100 transition-colors'
        )}
        disabled={!collapsible}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-neutral-500" />
          <span className="font-semibold text-neutral-900">{title}</span>
          <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">
            {items.length} sections
          </span>
        </div>
        {collapsible && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-1">
              {items.map((item) => (
                <TOCListItem
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => onItemClick(item.id)}
                />
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// List Item Component
// -----------------------------------------------------------------------------

interface TOCListItemProps {
  item: TOCItem;
  isActive: boolean;
  onClick: () => void;
  showIndicator?: boolean;
  variant?: 'default' | 'mobile';
}

function TOCListItem({
  item,
  isActive,
  onClick,
  showIndicator = false,
  variant = 'default',
}: TOCListItemProps) {
  const getIndentClass = (level: number) => {
    const indentLevel = level - 2;
    switch (indentLevel) {
      case 0: return '';
      case 1: return 'pl-3'; // 12px
      case 2: return 'pl-6'; // 24px
      case 3: return 'pl-9'; // 36px
      case 4: return 'pl-12'; // 48px
      default: return indentLevel > 4 ? 'pl-12' : '';
    }
  };

  return (
    <li className={getIndentClass(item.level)}>
      <button
        onClick={onClick}
        className={cn(
          'group w-full text-left py-2 px-3 rounded-lg',
          'text-sm transition-all duration-200',
          'flex items-center gap-2',
          variant === 'mobile' && 'py-3',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
        )}
      >
        {showIndicator && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors',
              isActive ? 'bg-primary' : 'bg-neutral-300 group-hover:bg-neutral-400'
            )}
          />
        )}
        <span className="line-clamp-1">{item.title}</span>
      </button>

      {item.children && item.children.length > 0 && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child) => (
            <TOCListItem
              key={child.id}
              item={child}
              isActive={isActive}
              onClick={onClick}
              showIndicator={showIndicator}
              variant={variant}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default TableOfContents;
