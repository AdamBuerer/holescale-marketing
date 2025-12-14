import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  PackageCheck,
  AlertCircle,
  CircleDashed,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = 
  | "pending"
  | "approved" 
  | "rejected"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "processing"
  | "awaiting_payment"
  | "paid";

interface StatusConfig {
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
  icon: LucideIcon;
  label: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  pending: {
    variant: "warning",
    icon: Clock,
    label: "Pending"
  },
  approved: {
    variant: "success",
    icon: CheckCircle2,
    label: "Approved"
  },
  rejected: {
    variant: "destructive",
    icon: XCircle,
    label: "Rejected"
  },
  shipped: {
    variant: "info",
    icon: Truck,
    label: "Shipped"
  },
  delivered: {
    variant: "success",
    icon: PackageCheck,
    label: "Delivered"
  },
  cancelled: {
    variant: "destructive",
    icon: XCircle,
    label: "Cancelled"
  },
  processing: {
    variant: "secondary",
    icon: CircleDashed,
    label: "Processing"
  },
  awaiting_payment: {
    variant: "warning",
    icon: AlertCircle,
    label: "Awaiting Payment"
  },
  paid: {
    variant: "success",
    icon: CheckCircle2,
    label: "Paid"
  }
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
  customLabel?: string;
}

/**
 * Accessible status badge with color independence
 * Uses both color AND icon to convey status (WCAG 2.1 AA)
 */
export function StatusBadge({ 
  status, 
  className, 
  showIcon = true,
  customLabel 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const label = customLabel || config.label;

  return (
    <Badge 
      variant={config.variant} 
      className={cn("gap-1", className)}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      <span>{label}</span>
    </Badge>
  );
}

/**
 * Get status configuration without rendering
 */
export function getStatusConfig(status: StatusType) {
  return statusConfig[status];
}
