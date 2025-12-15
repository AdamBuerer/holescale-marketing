/**
 * Subscription Pricing Card
 *
 * Enhanced pricing card that integrates with the subscription system.
 * Shows trial information and handles checkout flow.
 */

import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Minimal tier interface for pricing display
interface PricingTierDisplay {
  id: string;
  display_name: string;
  price_monthly: number;
  price_yearly: number | null;
  is_free: boolean;
  trial_days: number;
  transaction_fee_percent: number;
  features: Array<{
    feature_key: string;
    feature_type: string;
    feature_value: string;
  }>;
}

interface SubscriptionPricingCardProps {
  tier: PricingTierDisplay;
  onSubscribe?: (tierId: string) => void;
  highlighted?: boolean;
  currentTier?: boolean;
  billingCycle?: 'monthly' | 'yearly';
  className?: string;
}

export function SubscriptionPricingCard({
  tier,
  onSubscribe,
  highlighted = false,
  currentTier = false,
  billingCycle = 'monthly',
  className,
}: SubscriptionPricingCardProps) {
  const price = billingCycle === 'yearly' && tier.price_yearly
    ? tier.price_yearly / 100 / 12 // Convert to monthly equivalent
    : tier.price_monthly / 100;

  const displayPrice = tier.is_free ? 'Free' : `$${price.toFixed(0)}`;
  const hasTrial = !tier.is_free && tier.trial_days > 0;

  // Features are now pre-formatted from tier-features-config
  // Just extract the display labels from feature_key
  const displayFeatures: string[] = tier.features?.map(feature => feature.feature_key) || [];

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(tier.id);
    }
  };

  return (
    <div
      className={cn(
        'relative bg-card rounded-xl border p-6 md:p-8 transition-all duration-300 overflow-visible',
        highlighted
          ? 'border-primary shadow-xl ring-2 ring-primary/30 scale-[1.02] hover:scale-[1.04] hover:shadow-2xl'
          : 'shadow-sm hover:shadow-lg hover:border-primary/50',
        currentTier && 'border-green-500 ring-2 ring-green-500/20',
        className
      )}
    >
      {/* Badge */}
      {highlighted && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-1.5 text-sm font-bold shadow-lg whitespace-nowrap border-0">
            ✨ Most Popular
          </Badge>
        </div>
      )}

      {currentTier && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-green-500 text-white px-5 py-1.5 text-sm font-bold shadow-lg whitespace-nowrap border-0">
            ✓ Current Plan
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{tier.display_name}</h3>

        <div className="mb-4">
          <span className="text-4xl font-bold">{displayPrice}</span>
          {!tier.is_free && <span className="text-muted-foreground ml-2">/month</span>}
        </div>

        {billingCycle === 'yearly' && !tier.is_free && tier.price_yearly && (
          <p className="text-sm text-muted-foreground">
            ${(tier.price_yearly / 100).toFixed(0)}/year (save 2 months)
          </p>
        )}

        {hasTrial && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm font-semibold border border-primary/20">
            <Sparkles className="w-4 h-4" />
            {tier.trial_days}-day free trial
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 min-h-[200px]">
        {displayFeatures.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {currentTier ? (
        <Button
          variant="outline"
          className="w-full font-semibold"
          size="lg"
          disabled
        >
          Current Plan
        </Button>
      ) : tier.is_free ? (
        <Button
          asChild
          variant={highlighted ? 'default' : 'outline'}
          className={cn(
            "w-full font-semibold transition-all duration-200",
            highlighted
              ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
              : "hover:bg-primary hover:text-primary-foreground"
          )}
          size="lg"
        >
          <Link to="/waitlist">Get Started</Link>
        </Button>
      ) : (
        <Button
          onClick={handleSubscribe}
          variant={highlighted ? 'default' : 'outline'}
          className={cn(
            "w-full font-semibold transition-all duration-200",
            highlighted
              ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
              : "hover:bg-primary hover:text-primary-foreground"
          )}
          size="lg"
        >
          {hasTrial ? 'Start Free Trial' : 'Subscribe Now'}
        </Button>
      )}

      {hasTrial && !currentTier && (
        <p className="text-xs text-center text-muted-foreground mt-3">
          Card required • Cancel anytime • Full access during trial
        </p>
      )}
    </div>
  );
}
