import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  // New API
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  helpText?: string;
  // Legacy API (backward compatible)
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Comprehensive empty state component with clear CTAs
 * Use this for all empty data views (no RFQs, no orders, no messages, etc.)
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  // New API
  primaryAction,
  secondaryAction,
  helpText,
  // Legacy API
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  className,
  children,
}: EmptyStateProps) {
  // Support both old and new API
  const effectivePrimaryAction = primaryAction || (actionLabel && onAction ? { label: actionLabel, onClick: onAction } : undefined);
  const effectiveSecondaryAction = secondaryAction || (secondaryLabel && onSecondaryAction ? { label: secondaryLabel, onClick: onSecondaryAction } : undefined);

  return (
    <Card className={cn("p-12 text-center w-full", className)}>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Icon className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold w-full">{title}</h3>
          <p className="text-muted-foreground w-full break-words whitespace-normal">{description}</p>
        </div>

        {/* Actions */}
        {(effectivePrimaryAction || effectiveSecondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {effectivePrimaryAction && (
              <Button onClick={effectivePrimaryAction.onClick} size="lg">
                {effectivePrimaryAction.label}
              </Button>
            )}
            {effectiveSecondaryAction && (
              <Button
                variant="outline"
                onClick={effectiveSecondaryAction.onClick}
                size="lg"
              >
                {effectiveSecondaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Help Text */}
        {helpText && (
          <p className="text-sm text-muted-foreground italic w-full break-words whitespace-normal">{helpText}</p>
        )}

        {/* Additional Content */}
        {children}
      </div>
    </Card>
  );
}
