import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  name: string;
  price: string | { monthly: string; annual: string };
  description: string;
  features: string[];
  cta: { text: string; href?: string; onClick?: () => void };
  highlighted?: boolean;
  badge?: string;
  className?: string;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  className,
}: PricingCardProps) {
  const priceText = typeof price === 'string' ? price : price.monthly;

  return (
    <div
      className={cn(
        'relative bg-card rounded-xl border p-4 sm:p-6 md:p-8 shadow-sm overflow-visible',
        highlighted && 'border-primary shadow-lg ring-2 ring-primary/20',
        className
      )}
    >
      {badge && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
            {badge}
          </span>
        </div>
      )}

      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{name}</h3>
        <div className="mb-3 sm:mb-4">
          {typeof price === 'string' ? (
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{price}</span>
          ) : (
            <div>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{price.monthly}</span>
              <span className="text-muted-foreground ml-2 text-sm sm:text-base">/month</span>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                or {price.annual}/month billed annually
              </div>
            </div>
          )}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>

      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 sm:gap-3">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {cta.href ? (
        <Button
          asChild
          variant={highlighted ? 'default' : 'outline'}
          className="w-full min-h-[44px] text-sm sm:text-base"
          size="lg"
        >
          <Link to={cta.href}>{cta.text}</Link>
        </Button>
      ) : (
        <Button
          onClick={cta.onClick}
          variant={highlighted ? 'default' : 'outline'}
          className="w-full min-h-[44px] text-sm sm:text-base"
          size="lg"
        >
          {cta.text}
        </Button>
      )}
    </div>
  );
}

