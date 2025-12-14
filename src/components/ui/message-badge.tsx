import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MessageBadgeProps {
  count: number;
  className?: string;
}

export function MessageBadge({ count, className }: MessageBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-semibold rounded-full",
        "bg-[#EF4444] text-white",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
}
