import { ReactNode } from 'react';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { cn } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  emptyState?: ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight = 600,
  overscan = 3,
  renderItem,
  className,
  emptyState,
}: VirtualListProps<T>) {
  const { virtualItems, totalHeight, scrollRef } = useVirtualScroll({
    itemHeight,
    itemCount: items.length,
    overscan,
    containerHeight,
  });

  if (items.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div
      ref={scrollRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: itemHeight,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(items[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
