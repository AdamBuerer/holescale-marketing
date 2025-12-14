/**
 * ResponsiveContainer - Standardized responsive layout component
 * Use this instead of manual div + className combinations
 */

import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Layout mode:
   * - 'stack': Always stacked (flex-col)
   * - 'stack-sm': Stacked on mobile, row on sm+ (default)
   * - 'stack-md': Stacked on mobile/tablet, row on md+
   * - 'stack-lg': Stacked on mobile/tablet/small desktop, row on lg+
   */
  mode?: 'stack' | 'stack-sm' | 'stack-md' | 'stack-lg';
  /**
   * Gap between items (uses Tailwind spacing)
   */
  gap?: '2' | '3' | '4' | '6' | '8';
  /**
   * Vertical alignment
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * Horizontal distribution
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function ResponsiveContainer({
  children,
  className,
  mode = 'stack-sm',
  gap = '4',
  align = 'start',
  justify = 'start',
}: ResponsiveContainerProps) {
  const modeClasses = {
    'stack': 'flex-col',
    'stack-sm': 'flex-col sm:flex-row',
    'stack-md': 'flex-col md:flex-row',
    'stack-lg': 'flex-col lg:flex-row',
  };

  const alignClasses = {
    'start': 'items-start',
    'center': 'items-center',
    'end': 'items-end',
    'stretch': 'items-stretch',
  };

  const justifyClasses = {
    'start': 'justify-start',
    'center': 'justify-center',
    'end': 'justify-end',
    'between': 'justify-between',
    'around': 'justify-around',
  };

  return (
    <div
      className={cn(
        'flex',
        modeClasses[mode],
        `gap-${gap}`,
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveGrid - Standardized responsive grid component
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Number of columns at different breakpoints
   */
  cols?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 2 | 3 | 4 | 6;
  };
  gap?: '2' | '3' | '4' | '6' | '8';
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '4',
}: ResponsiveGridProps) {
  const colClasses = `grid-cols-${cols.mobile || 1} sm:grid-cols-${cols.tablet || 2} lg:grid-cols-${cols.desktop || 3}`;

  return (
    <div
      className={cn(
        'grid',
        colClasses,
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * TouchTarget - Ensures WCAG AAA compliance (44px minimum)
 */
interface TouchTargetProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'button' | 'icon' | 'link';
}

export function TouchTarget({
  children,
  className,
  variant = 'button',
  ...props
}: TouchTargetProps) {
  const baseClasses = 'min-h-[44px] min-w-[44px] inline-flex items-center justify-center';

  const variantClasses = {
    'button': 'px-4',
    'icon': 'p-2',
    'link': 'px-2',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
