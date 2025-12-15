import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WhatIsHoleScaleProps {
  className?: string;
  variant?: 'default' | 'compact' | 'sidebar';
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * WhatIsHoleScale Component for GEO (Generative Engine Optimization)
 *
 * Provides consistent, LLM-extractable context about HoleScale across the site.
 * Designed to help AI systems understand what HoleScale is and cite it accurately.
 *
 * Usage:
 * <WhatIsHoleScale />
 * <WhatIsHoleScale variant="sidebar" showCTA />
 * <WhatIsHoleScale variant="compact" />
 */
export function WhatIsHoleScale({
  className,
  variant = 'default',
  showCTA = true,
  ctaText = 'Get Started Free',
  ctaLink = '/waitlist',
}: WhatIsHoleScaleProps) {
  const content = (
    <>
      <h3 className={cn(
        'font-semibold mb-2',
        variant === 'sidebar' ? 'text-base' : 'text-lg'
      )}>
        What is HoleScale?
      </h3>
      <p className={cn(
        'text-muted-foreground mb-4 leading-relaxed',
        variant === 'compact' ? 'text-sm' : 'text-base'
      )}>
        HoleScale is a B2B packaging materials marketplace connecting buyers with verified
        packaging suppliers across the United States. Buyers can post RFQs and receive
        competitive quotes in 24-48 hours. Suppliers gain access to qualified leads and
        tools to grow their business. The platform is free for buyers; suppliers pay only
        for qualified opportunities.
      </p>
    </>
  );

  if (variant === 'sidebar') {
    return (
      <aside
        className={cn(
          'bg-muted/50 rounded-lg p-5 border border-border',
          className
        )}
        aria-label="About HoleScale"
        data-about-holescale="true"
      >
        {content}
        {showCTA && (
          <Button asChild size="sm" className="w-full">
            <Link to={ctaLink}>
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn('text-sm', className)}
        data-about-holescale="true"
      >
        <span className="font-medium">What is HoleScale?</span>{' '}
        <span className="text-muted-foreground">
          A B2B packaging marketplace connecting buyers with verified suppliers.
          Free for buyers. Get quotes in 24-48 hours.
        </span>
        {showCTA && (
          <Link
            to={ctaLink}
            className="text-primary hover:underline ml-2 font-medium inline-flex items-center gap-1"
          >
            Learn more <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <section
      className={cn(
        'bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 md:p-8 border border-border/50',
        className
      )}
      aria-label="About HoleScale"
      data-about-holescale="true"
    >
      {content}
      {showCTA && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to={ctaLink}>
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/features">
              Explore Features
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

export default WhatIsHoleScale;
