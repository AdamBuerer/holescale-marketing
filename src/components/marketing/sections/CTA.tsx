import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTAProps {
  headline: string;
  subheadline?: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  variant?: 'default' | 'dark';
  className?: string;
}

export function CTA({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
  className,
}: CTAProps) {
  const isDark = variant === 'dark';

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        isDark ? 'bg-primary text-primary-foreground' : 'bg-background',
        className
      )}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={cn(
          'text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6',
          isDark && 'text-primary-foreground'
        )}>
          {headline}
        </h2>

        {subheadline && (
          <p className={cn(
            'text-lg md:text-xl mb-8 md:mb-10',
            isDark ? 'text-primary-foreground/90' : 'text-muted-foreground'
          )}>
            {subheadline}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant={isDark ? 'secondary' : 'default'}
            className="text-base px-8 py-6 h-auto"
          >
            <Link to={primaryCTA.href}>
              {primaryCTA.text}
            </Link>
          </Button>

          {secondaryCTA && (
            <Button
              asChild
              variant={isDark ? 'outline' : 'outline'}
              size="lg"
              className={cn(
                'text-base px-8 py-6 h-auto',
                isDark && 'border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10'
              )}
            >
              <Link to={secondaryCTA.href}>
                {secondaryCTA.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

