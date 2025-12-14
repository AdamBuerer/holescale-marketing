import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-tight ring-offset-background transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 hover:shadow-md active:scale-[0.98] min-h-[44px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Solid navy, white text (primary actions)
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
        // Secondary: White bg, navy border (secondary actions)
        secondary: "border-2 border-primary bg-background text-primary hover:bg-primary/5 hover:border-primary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Ghost: Transparent, navy text (tertiary actions)
        ghost: "hover:bg-accent hover:text-accent-foreground text-primary",
        // Danger: Red (destructive actions)
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm hover:shadow",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
