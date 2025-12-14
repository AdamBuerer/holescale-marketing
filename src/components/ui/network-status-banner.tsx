import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";

export function NetworkStatusBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
        <WifiOff className="h-4 w-4" />
        <p className="text-sm font-medium">
          You're currently offline. Some features may not work.
        </p>
      </div>
    </div>
  );
}
