import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  helpText?: string;
  illustration?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

export function EnhancedEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  helpText,
  illustration,
  className,
  variant = "default",
}: EnhancedEmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <Card className={cn("border-dashed", className)} role="status" aria-live="polite">
      <CardContent className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        isCompact ? "py-8 px-4" : "py-12 px-6"
      )}>
        {illustration || (
          <div className={cn(
            "rounded-full bg-muted flex items-center justify-center mb-4",
            isCompact ? "w-12 h-12" : "w-16 h-16"
          )}>
            <Icon className={cn(
              "text-muted-foreground",
              isCompact ? "h-6 w-6" : "h-8 w-8"
            )} aria-hidden="true" />
          </div>
        )}
        
        <h3 className={cn(
          "font-semibold mb-2",
          isCompact ? "text-base" : "text-lg"
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-muted-foreground mb-6 w-full max-w-2xl break-words whitespace-normal",
          isCompact ? "text-xs" : "text-sm"
        )}>
          {description}
        </p>
        
        {(actionLabel || secondaryActionLabel) && (
          <div className="flex gap-3 flex-wrap justify-center">
            {actionLabel && onAction && (
              <Button onClick={onAction} size={isCompact ? "sm" : "default"}>
                {actionLabel}
              </Button>
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button 
                variant="outline" 
                onClick={onSecondaryAction}
                size={isCompact ? "sm" : "default"}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
        
        {helpText && (
          <p className="text-xs text-muted-foreground mt-4 w-full max-w-2xl break-words whitespace-normal">
            {helpText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
