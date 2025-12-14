import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  dataUiId?: string;
}

interface ContextualFABProps {
  primaryAction?: QuickAction;
  secondaryActions?: QuickAction[];
  className?: string;
}

export function ContextualFAB({
  primaryAction,
  secondaryActions = [],
  className,
}: ContextualFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!primaryAction && secondaryActions.length === 0) {
    return null;
  }

  // If only one action, show simple button
  if (!primaryAction && secondaryActions.length === 1) {
    const action = secondaryActions[0];
    return (
      <Button
        onClick={action.onClick}
        size="lg"
        className={cn(
          'fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg z-[45] md:bottom-6 md:right-6 md:z-50 hover:scale-105 transition-transform',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          className
        )}
        aria-label={action.label}
        data-ui-id={action.dataUiId}
      >
        {action.icon}
      </Button>
    );
  }

  // If primary action and no secondary, show simple button
  if (primaryAction && secondaryActions.length === 0) {
    return (
      <Button
        onClick={primaryAction.onClick}
        size="lg"
        className={cn(
          'fixed bottom-20 right-4 h-12 gap-2 rounded-full shadow-lg z-[45] md:bottom-6 md:right-6 md:z-50 hover:scale-105 transition-transform',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          className
        )}
        data-ui-id={primaryAction.dataUiId}
      >
        {primaryAction.icon}
        <span className="font-semibold">{primaryAction.label}</span>
      </Button>
    );
  }

  // Multiple actions - show dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className={cn(
            'fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg z-[45] md:bottom-6 md:right-6 md:z-50',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'transition-all duration-200',
            isOpen && 'rotate-45 scale-110',
            className
          )}
          aria-label="Quick actions"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-56 mb-2"
      >
        {primaryAction && (
          <>
            <DropdownMenuItem
              onClick={() => {
                primaryAction.onClick();
                setIsOpen(false);
              }}
              className="py-3 cursor-pointer focus:bg-muted/70 focus:text-foreground hover:bg-muted/70 hover:text-foreground"
              data-ui-id={primaryAction.dataUiId}
            >
              <div className="flex items-center gap-3">
                {primaryAction.icon}
                <span className="font-medium">{primaryAction.label}</span>
              </div>
            </DropdownMenuItem>
            {secondaryActions.length > 0 && <DropdownMenuSeparator />}
          </>
        )}
        {secondaryActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className="py-3 cursor-pointer focus:bg-muted/70 focus:text-foreground hover:bg-muted/70 hover:text-foreground"
            data-ui-id={action.dataUiId}
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <span>{action.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
