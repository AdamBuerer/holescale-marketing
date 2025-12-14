import { Button } from "@/components/ui/button";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface HapticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hapticStyle?: "light" | "medium" | "heavy" | "success" | "warning" | "error";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const HapticButton = forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ hapticStyle = "light", onClick, className, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      haptic.trigger(hapticStyle);
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        className={cn("active:scale-95 transition-transform", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HapticButton.displayName = "HapticButton";
