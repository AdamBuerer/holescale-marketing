import { cn } from "@/lib/utils";
import { getTouchTargetSize } from "@/lib/mobile-utils";

interface TouchFriendlyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Button component with minimum 44x44px touch target
 * Meets WCAG 2.1 AA accessibility standards
 */
export function TouchFriendlyButton({
  children,
  className,
  variant = 'default',
  ...props
}: TouchFriendlyButtonProps) {
  return (
    <button
      className={cn(
        getTouchTargetSize(),
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
