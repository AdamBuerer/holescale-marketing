import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  estimateSize?: number;
  height?: string | number;
  className?: string;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * High-performance virtualized list component
 * Only renders visible items for optimal performance with large datasets
 * 
 * @example
 * <VirtualizedList
 *   items={products}
 *   estimateSize={200}
 *   height="600px"
 *   renderItem={(product) => <ProductCard product={product} />}
 * />
 */
export function VirtualizedList<T>({
  items,
  renderItem,
  estimateSize = 100,
  height = '600px',
  className,
  overscan = 5,
  getItemKey,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn("overflow-auto", className)}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          const key = getItemKey
            ? getItemKey(item, virtualRow.index)
            : virtualRow.index;

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Virtualized grid component for grid layouts
 */
interface VirtualizedGridProps<T> extends VirtualizedListProps<T> {
  columns?: number;
  gap?: number;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  columns = 3,
  gap = 24,
  estimateSize = 200,
  height = '600px',
  className,
  getItemKey,
}: VirtualizedGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate rows based on columns
  const rows = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn("overflow-auto", className)}
      style={{ height }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIdx = virtualRow.index * columns;
          const endIdx = Math.min(startIdx + columns, items.length);
          const rowItems = items.slice(startIdx, endIdx);

          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                  height: '100%',
                }}
              >
                {rowItems.map((item, idx) => {
                  const itemIndex = startIdx + idx;
                  const key = getItemKey
                    ? getItemKey(item, itemIndex)
                    : itemIndex;
                  return (
                    <div key={key}>
                      {renderItem(item, itemIndex)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
