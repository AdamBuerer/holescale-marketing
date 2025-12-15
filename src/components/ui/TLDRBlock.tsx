import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TLDRBlockProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'prominent';
}

/**
 * TL;DR Block Component for GEO (Generative Engine Optimization)
 *
 * Provides a clear, extractable summary at the top of content pages.
 * Designed to be easily parsed by LLMs for AI-powered search results.
 *
 * Usage:
 * <TLDRBlock>
 *   <strong>TL;DR:</strong> HoleScale is a B2B packaging marketplace where buyers
 *   get quotes from verified suppliers in 24-48 hours, typically saving 15-20%
 *   on procurement.
 * </TLDRBlock>
 */
export function TLDRBlock({
  children,
  className,
  variant = 'default'
}: TLDRBlockProps) {
  const variantStyles = {
    default: 'bg-primary/5 border-primary/20 text-foreground',
    compact: 'bg-muted/50 border-border text-muted-foreground text-sm',
    prominent: 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-foreground',
  };

  return (
    <aside
      className={cn(
        'rounded-lg border p-4 md:p-5 mb-6',
        variantStyles[variant],
        className
      )}
      aria-label="Summary"
      data-tldr="true"
    >
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {children}
      </div>
    </aside>
  );
}

export default TLDRBlock;
