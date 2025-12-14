import { cn } from "@/lib/utils";

interface PresenceIndicatorProps {
  status: "online" | "away" | "offline";
  className?: string;
  showLabel?: boolean;
}

export function PresenceIndicator({ 
  status, 
  className,
  showLabel = false 
}: PresenceIndicatorProps) {
  const statusConfig = {
    online: {
      color: "bg-green-500",
      label: "Online",
      ring: "ring-green-500/20",
    },
    away: {
      color: "bg-yellow-500",
      label: "Away",
      ring: "ring-yellow-500/20",
    },
    offline: {
      color: "bg-gray-400",
      label: "Offline",
      ring: "ring-gray-400/20",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            config.color,
            status === "online" && "animate-pulse"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 h-2.5 w-2.5 rounded-full ring-2",
            config.ring
          )}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}
