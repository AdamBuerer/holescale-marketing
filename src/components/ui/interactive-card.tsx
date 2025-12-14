import { ReactNode, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

interface InteractiveCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function InteractiveCard({
  title,
  description,
  children,
  icon,
  collapsible = false,
  defaultOpen = true,
  hover = true,
  onClick,
  className,
  badge,
  actions,
}: InteractiveCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card
          className={cn(
            'transition-all duration-200',
            hover && 'hover:shadow-md hover:border-primary/50',
            className
          )}
        >
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {icon && (
                    <div className="mt-0.5 text-primary transition-transform duration-200 group-hover:scale-110">
                      {icon}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{title}</CardTitle>
                      {badge}
                    </div>
                    {description && (
                      <CardDescription className="mt-1.5">
                        {description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {actions}
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 animate-accordion-down">
              {children}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'transition-all duration-200',
        hover && 'hover:shadow-md hover:border-primary/50',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {icon && <div className="mt-0.5 text-primary">{icon}</div>}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {badge}
              </div>
              {description && (
                <CardDescription className="mt-1.5">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
