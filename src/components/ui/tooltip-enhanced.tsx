import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { cn } from '@/lib/utils';

interface TooltipEnhancedProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  shortcut?: string;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  default: '',
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-red-600 text-white',
};

export function TooltipEnhanced({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  shortcut,
  variant = 'default',
}: TooltipEnhancedProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            'animate-fade-in max-w-xs',
            variantStyles[variant]
          )}
        >
          <div className="flex items-center gap-2">
            <span>{content}</span>
            {shortcut && (
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-background/20 rounded border border-white/20">
                {shortcut}
              </kbd>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
