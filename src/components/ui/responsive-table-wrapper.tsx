import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTableWrapper({ children, className }: ResponsiveTableWrapperProps) {
  return (
    <div className={cn("w-full overflow-x-auto -mx-4 sm:mx-0", className)}>
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        <div className="overflow-hidden border border-border rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ResponsiveMobileCardProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveMobileCard({ children, className }: ResponsiveMobileCardProps) {
  return (
    <div className={cn(
      "block lg:hidden p-4 border border-border rounded-lg bg-card space-y-3",
      className
    )}>
      {children}
    </div>
  );
}
