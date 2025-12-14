/**
 * Layout Primitives - Bulletproof responsive layouts
 *
 * These components solve the responsive design chaos by providing
 * consistent, predictable layout patterns that work everywhere.
 *
 * NO MORE:
 * - Manual responsive breakpoints (sm:, md:, lg:)
 * - Arbitrary gap values
 * - Inconsistent spacing
 *
 * Created: December 4, 2025
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Stack - Vertical layout with consistent spacing
 *
 * Use this instead of: flex flex-col gap-X
 *
 * @example
 * <Stack spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 */
const stackVariants = cva('flex flex-col', {
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-1',      // 4px
      sm: 'gap-2',      // 8px
      md: 'gap-4',      // 16px
      lg: 'gap-6',      // 24px
      xl: 'gap-8',      // 32px
      '2xl': 'gap-12',  // 48px
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    spacing: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, align, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ spacing, align, justify }), className)}
      {...props}
    />
  )
);
Stack.displayName = 'Stack';

/**
 * Inline - Horizontal layout with consistent spacing
 *
 * Use this instead of: flex flex-row gap-X
 *
 * @example
 * <Inline spacing="sm" align="center">
 *   <Button>Cancel</Button>
 *   <Button>Submit</Button>
 * </Inline>
 */
const inlineVariants = cva('flex flex-row', {
  variants: {
    spacing: {
      none: 'gap-0',
      xs: 'gap-1',      // 4px
      sm: 'gap-2',      // 8px
      md: 'gap-4',      // 16px
      lg: 'gap-6',      // 24px
      xl: 'gap-8',      // 32px
      '2xl': 'gap-12',  // 48px
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    spacing: 'md',
    align: 'center',
    justify: 'start',
    wrap: 'nowrap',
  },
});

export interface InlineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineVariants> {}

export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ className, spacing, align, justify, wrap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(inlineVariants({ spacing, align, justify, wrap }), className)}
      {...props}
    />
  )
);
Inline.displayName = 'Inline';

/**
 * Grid - Responsive grid layout
 *
 * Automatically responsive - adapts to container width!
 *
 * @example
 * // 3-column grid that becomes 2-col on tablet, 1-col on mobile
 * <Grid cols={3} gap="lg">
 *   <Card>...</Card>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </Grid>
 */
const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      auto: 'grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',      // 4px
      sm: 'gap-2',      // 8px
      md: 'gap-4',      // 16px
      lg: 'gap-6',      // 24px
      xl: 'gap-8',      // 32px
      '2xl': 'gap-12',  // 48px
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridVariants({ cols, gap }), className)}
      {...props}
    />
  )
);
Grid.displayName = 'Grid';

/**
 * Container - Max-width container with responsive padding
 *
 * Centers content and adds consistent padding
 *
 * @example
 * <Container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content...</p>
 * </Container>
 */
const containerVariants = cva('mx-auto w-full px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',      // 768px
      md: 'max-w-5xl',      // 1024px
      lg: 'max-w-7xl',      // 1280px
      xl: 'max-w-[1600px]', // 1600px
      full: 'max-w-full',   // No limit
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
);
Container.displayName = 'Container';

/**
 * ResponsiveGrid - Auto-responsive grid (no breakpoints!)
 *
 * This is the future - grids that adapt to their container automatically
 *
 * @example
 * // Grid automatically creates as many columns as fit
 * <ResponsiveGrid minWidth="300px" gap="lg">
 *   <ProductCard />
 *   <ProductCard />
 *   <ProductCard />
 * </ResponsiveGrid>
 */
export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum width of each grid item */
  minWidth?: string;
  /** Maximum number of columns (optional) */
  maxCols?: number;
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ minWidth = '250px', maxCols, gap = 'md', className, style, children, ...props }, ref) => {
    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    };

    // Auto-fit creates as many columns as fit
    const gridStyle = {
      gridTemplateColumns: maxCols
        ? `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`
        : `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('grid', gapClasses[gap], className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResponsiveGrid.displayName = 'ResponsiveGrid';

/**
 * Center - Centers content horizontally and optionally vertically
 *
 * @example
 * <Center>
 *   <Spinner />
 * </Center>
 */
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Also center vertically (default: false) */
  vertical?: boolean;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ vertical = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex justify-center',
        vertical && 'items-center min-h-[200px]',
        className
      )}
      {...props}
    />
  )
);
Center.displayName = 'Center';

/**
 * Spacer - Flexible space (push elements apart)
 *
 * @example
 * <Inline>
 *   <div>Left</div>
 *   <Spacer />
 *   <div>Right</div>
 * </Inline>
 */
export const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1', className)} {...props} />
  )
);
Spacer.displayName = 'Spacer';
