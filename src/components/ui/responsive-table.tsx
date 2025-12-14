import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

/**
 * Responsive table component that shows table on desktop and cards on mobile
 * Usage:
 * <ResponsiveTable>
 *   <ResponsiveTable.Desktop>
 *     <Table>...</Table>
 *   </ResponsiveTable.Desktop>
 *   <ResponsiveTable.Mobile>
 *     {data.map(item => <MobileCard key={item.id} {...item} />)}
 *   </ResponsiveTable.Mobile>
 * </ResponsiveTable>
 */
export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

function Desktop({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("hidden md:block overflow-x-auto", className)}>
      {children}
    </div>
  );
}

function Mobile({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("md:hidden space-y-4", className)}>
      {children}
    </div>
  );
}

ResponsiveTable.Desktop = Desktop;
ResponsiveTable.Mobile = Mobile;

/**
 * Mobile card wrapper for table rows
 */
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileTableCard({ children, className, onClick }: MobileCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 space-y-3 touch-manipulation",
        onClick && "cursor-pointer hover:bg-accent transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}

/**
 * Mobile card row component
 */
interface MobileRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function MobileTableRow({ label, value, className }: MobileRowProps) {
  return (
    <div className={cn("flex justify-between items-start gap-4", className)}>
      <span className="text-sm font-medium text-muted-foreground min-w-[100px]">{label}</span>
      <span className="text-sm text-right flex-1">{value}</span>
    </div>
  );
}
