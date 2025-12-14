import { useState, useCallback, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [canPull, setCanPull] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    if (scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setCanPull(true);
    } else {
      setCanPull(false);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canPull) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Only handle pull down when scrolled to top
      const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
      if (scrollTop === 0 && distance > 0 && distance < threshold * 2) {
        // Only prevent default if we're actively pulling
        if (distance > 5) {
          e.preventDefault();
        }
        setPullDistance(distance);
      }
    },
    [startY, threshold, canPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!canPull) return;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setCanPull(false);
  }, [pullDistance, threshold, isRefreshing, onRefresh, canPull]);

  const rotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={cn("relative overflow-auto h-full", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none transition-all"
        style={{
          height: `${Math.min(pullDistance, threshold)}px`,
          opacity,
        }}
      >
        <div className="bg-card rounded-full p-2 shadow-lg">
          <RefreshCw
            className={cn(
              "h-5 w-5 text-primary transition-transform",
              isRefreshing && "animate-spin"
            )}
            style={{
              transform: `rotate(${isRefreshing ? 0 : rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform"
        style={{
          transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
