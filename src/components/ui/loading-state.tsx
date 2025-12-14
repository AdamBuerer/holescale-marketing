import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandedLoadingBox } from "@/components/ui/BrandedLoadingBox";
import { BrandedLoadingSimple } from "@/components/ui/BrandedLoadingSimple";

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  progress?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton" | "dots" | "box" | "simple";
  rows?: number;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Loading...",
  submessage,
  progress,
  className,
  size = "md",
  variant = "spinner",
  rows = 3,
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  // Skeleton variant
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Dots variant
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", sizeClasses[size], className)}>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
        {message && (
          <p className="ml-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  // Spinner variant (default) - simple spinner
  if (variant === "spinner" || variant === "box" || variant === "simple") {
    if (fullScreen) {
      return (
        <BrandedLoadingBox
          size={size === "sm" ? "md" : size === "lg" ? "xl" : "lg"}
          message={message}
          fullScreen={fullScreen}
          className={className}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center",
          sizeClasses[size],
          className
        )}
      >
        <BrandedLoadingSimple
          size={size}
          message={undefined}
        />

        {(message || submessage) && (
          <div className="mt-6 space-y-2 max-w-md">
            {message && (
              <p className="text-base font-medium text-foreground">{message}</p>
            )}
            {submessage && (
              <p className="text-sm text-muted-foreground">{submessage}</p>
            )}
          </div>
        )}

        {progress !== undefined && (
          <div className="w-64 mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback to spinner
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size],
        className
      )}
    >
      <BrandedLoadingSimple
        size={size}
        message={undefined}
      />

      {message && (
        <div className="mt-6 space-y-2 max-w-md">
          <p className="text-base font-medium text-foreground">{message}</p>
          {submessage && (
            <p className="text-sm text-muted-foreground">{submessage}</p>
          )}
        </div>
      )}

      {progress !== undefined && (
        <div className="w-64 mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
        </div>
      )}
    </div>
  );
}
