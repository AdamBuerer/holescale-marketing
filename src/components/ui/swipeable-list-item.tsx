import { useState, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwipeAction {
  label: string;
  color: "bg-primary" | "bg-destructive" | "bg-green-500" | "bg-blue-500" | "bg-purple-500" | "bg-yellow-500";
  onClick: () => void;
}

interface SwipeableListItemProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
}

export function SwipeableListItem({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 80,
}: SwipeableListItemProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
    setIsHorizontalSwipe(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX.current - startX.current;
    const diffY = currentY - startY.current;
    
    // Determine if this is a horizontal or vertical swipe
    if (!isHorizontalSwipe && Math.abs(diffX) > 10) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        setIsHorizontalSwipe(true);
      }
    }

    // Only handle horizontal swipes, let vertical scrolling work normally
    if (isHorizontalSwipe) {
      e.preventDefault(); // Prevent scroll only for horizontal swipes
      
      // Limit swipe range
      const maxLeft = leftActions.length > 0 ? 100 : 0;
      const maxRight = rightActions.length > 0 ? -100 : 0;
      
      if (diffX > 0 && diffX <= maxLeft) {
        setOffset(diffX);
      } else if (diffX < 0 && diffX >= maxRight) {
        setOffset(diffX);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsHorizontalSwipe(false);

    if (Math.abs(offset) < threshold) {
      // Snap back
      setOffset(0);
    } else {
      // Snap to action position
      if (offset > 0) {
        setOffset(100);
      } else {
        setOffset(-100);
      }
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    action.onClick();
    setOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.length > 0 && offset > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action, index) => (
            <button
              key={index}
              className={cn(
                "px-4 text-white font-medium flex items-center justify-center transition-all",
                action.color
              )}
              style={{ width: `${offset}px` }}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && offset < 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action, index) => (
            <button
              key={index}
              className={cn(
                "px-4 text-white font-medium flex items-center justify-center transition-all",
                action.color
              )}
              style={{ width: `${Math.abs(offset)}px` }}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className="transition-transform touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
