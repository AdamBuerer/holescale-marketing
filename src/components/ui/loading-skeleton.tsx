import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

/**
 * Accessible loading skeleton component
 * Announces loading state to screen readers
 */
export function LoadingSkeleton({ className, rows = 3 }: LoadingSkeletonProps) {
  return (
    <div 
      className={cn("space-y-3", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading content, please wait...</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface TableLoadingSkeletonProps {
  columns?: number;
  rows?: number;
}

/**
 * Accessible table loading skeleton
 */
export function TableLoadingSkeleton({ columns = 4, rows = 5 }: TableLoadingSkeletonProps) {
  return (
    <div 
      className="w-full"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading table data, please wait...</span>
      <div className="space-y-2" aria-hidden="true">
        {/* Header */}
        <div className="flex gap-4 pb-2 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`header-${i}`}
              className="h-4 bg-muted rounded animate-pulse flex-1"
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 bg-muted rounded animate-pulse flex-1"
                style={{ width: `${Math.random() * 20 + 80}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
