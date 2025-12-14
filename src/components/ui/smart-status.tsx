import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, AlertCircle, Package, Truck, Loader2 } from "lucide-react";

interface TimelineStep {
  label: string;
  completed: boolean;
  active?: boolean;
  estimatedDays?: number;
  completedAt?: string;
}

interface SmartStatusProps {
  status: string;
  details?: {
    message: string;
    timeRemaining?: string;
    nextStep?: string;
    trackingAvailable?: boolean;
    contact?: string;
  };
  timeline?: TimelineStep[];
  className?: string;
  variant?: "compact" | "detailed";
}

export function SmartStatus({
  status,
  details,
  timeline,
  className,
  variant = "compact",
}: SmartStatusProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { 
      icon: React.ReactNode; 
      color: string; 
      label: string;
      description: string;
    }> = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
        description: "Awaiting review"
      },
      in_production: {
        icon: <Package className="h-4 w-4" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "In Production",
        description: "Your order is being manufactured"
      },
      processing: {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Processing",
        description: "Order is being prepared"
      },
      shipped: {
        icon: <Truck className="h-4 w-4" />,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Shipped",
        description: "On the way to you"
      },
      delivered: {
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Delivered",
        description: "Successfully completed"
      },
      completed: {
        icon: <CheckCircle className="h-4 w-4" />,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Completed",
        description: "Successfully finished"
      },
      cancelled: {
        icon: <XCircle className="h-4 w-4" />,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelled",
        description: "This has been cancelled"
      },
      quoted: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Quoted",
        description: "Quotes received"
      },
    };

    return configs[status] || {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: status,
      description: ""
    };
  };

  const config = getStatusConfig(status);

  if (variant === "compact") {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "gap-1.5 py-1",
          config.color,
          className
        )}
      >
        {config.icon}
        <span>{config.label}</span>
      </Badge>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn("gap-1.5", config.color)}
                >
                  {config.icon}
                  <span>{config.label}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {details?.message || config.description}
              </p>
            </div>
            {details?.timeRemaining && (
              <div className="text-right">
                <p className="text-sm font-medium">{details.timeRemaining}</p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </div>
            )}
          </div>

          {/* Next Step */}
          {details?.nextStep && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-1">Next Step</p>
              <p className="text-sm text-muted-foreground">{details.nextStep}</p>
            </div>
          )}

          {/* Timeline */}
          {timeline && timeline.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Progress</p>
              <div className="space-y-2">
                {timeline.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors flex-shrink-0",
                      step.completed 
                        ? "bg-primary border-primary" 
                        : step.active
                        ? "border-primary bg-background"
                        : "border-muted bg-background"
                    )}>
                      {step.completed && (
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      )}
                      {step.active && !step.completed && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className={cn(
                        "text-sm",
                        step.completed || step.active ? "font-medium" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      {step.completedAt && (
                        <p className="text-xs text-muted-foreground">{step.completedAt}</p>
                      )}
                      {!step.completed && step.estimatedDays !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Est. {step.estimatedDays} {step.estimatedDays === 1 ? 'day' : 'days'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          {details?.contact && (
            <p className="text-xs text-muted-foreground">
              Questions? Contact {details.contact}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
