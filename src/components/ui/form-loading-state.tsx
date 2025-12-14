import { cn } from "@/lib/utils";
import { BrandedLoadingSimple } from "@/components/ui/BrandedLoadingSimple";

interface FormLoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Accessible form loading state component
 * Announces loading status to screen readers
 */
export function FormLoadingState({ 
  message = "Submitting form...", 
  className 
}: FormLoadingStateProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center gap-2 py-8", className)}
      role="status"
      aria-live="assertive"
      aria-busy="true"
    >
      <BrandedLoadingSimple
        size="sm"
        message={undefined}
        variant="default"
      />
      <span className="text-sm text-muted-foreground">{message}</span>
      <span className="sr-only">{message}</span>
    </div>
  );
}

interface ButtonLoadingStateProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Button with accessible loading state
 */
export function ButtonLoadingState({ 
  children, 
  isLoading = false,
  loadingText = "Loading..."
}: ButtonLoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <span>{loadingText}</span>
      <span className="sr-only">{loadingText}</span>
    </span>
  );
}
