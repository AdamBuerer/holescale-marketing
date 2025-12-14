import { ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

/**
 * Fade-in animation component that respects reduced motion preferences
 * Animates elements as they enter the viewport
 */
export const FadeIn = ({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 600,
}: FadeInProps) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDirectionClasses = () => {
    if (!hasIntersected) {
      switch (direction) {
        case "up":
          return "translate-y-8";
        case "down":
          return "-translate-y-8";
        case "left":
          return "translate-x-8";
        case "right":
          return "-translate-x-8";
        default:
          return "";
      }
    }
    return "translate-y-0 translate-x-0";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all",
        hasIntersected ? "opacity-100" : "opacity-0",
        getDirectionClasses(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
