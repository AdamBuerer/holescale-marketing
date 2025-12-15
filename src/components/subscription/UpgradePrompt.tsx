/**
 * Upgrade Prompt Component
 *
 * Modal that appears when users hit a feature limit or try to access
 * a feature not included in their tier. Shows upgrade options.
 */

import { useState } from 'react';
import { ArrowRight, Sparkles, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { redirectToCheckout, getSubscriptionTiers } from '@/lib/stripe/client';
import { useQuery } from '@tanstack/react-query';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureKey } from '@/types/subscription';

interface UpgradePromptProps {
  feature?: string;
  message?: string;
  featureKey?: FeatureKey;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  userId?: string;
}

/**
 * Inline upgrade prompt (banner style)
 */
export function UpgradePrompt({
  feature,
  message,
  featureKey,
}: Omit<UpgradePromptProps, 'open' | 'onOpenChange'>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>

        <h3 className="text-lg font-semibold mb-2">
          Upgrade to access this feature
        </h3>

        <p className="text-muted-foreground mb-4">
          {message || `This feature is not included in your current plan.`}
        </p>

        <Button onClick={() => setDialogOpen(true)} size="lg">
          View Upgrade Options
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <UpgradeModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        feature={feature}
        featureKey={featureKey}
      />
    </>
  );
}

/**
 * Full upgrade modal with tier comparison
 */
export function UpgradeModal({
  open = false,
  onOpenChange,
  feature,
  featureKey,
  userId,
}: UpgradePromptProps) {
  const { tierLevel } = useFeatureGate(userId);

  // Determine user type based on context (you may need to get this from auth)
  const userType = 'buyer'; // TODO: Get from user context

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['subscription-tiers', userType],
    queryFn: () => getSubscriptionTiers(userType),
    enabled: open,
  });

  const handleUpgrade = async (tierId: string) => {
    try {
      await redirectToCheckout({ tierId, billingCycle: 'monthly' });
    } catch (error) {
      console.error('Failed to start checkout:', error);
    }
  };

  // Filter tiers to show only upgrades
  const upgradeTiers = tiers?.filter((tier) => tier.sort_order > tierLevel && !tier.is_free) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            {feature
              ? `Unlock ${feature.replace(/_/g, ' ')} and more premium features`
              : 'Choose a plan that fits your needs'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : upgradeTiers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You're already on the highest tier!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {upgradeTiers.map((tier) => {
              const price = tier.price_monthly / 100;
              const hasTrial = tier.trial_days > 0;

              // Get key features for this tier
              const keyFeatures = tier.features
                .filter((f) => f.feature_type === 'boolean' && f.feature_value === 'true')
                .slice(0, 5)
                .map((f) => f.feature_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

              return (
                <div
                  key={tier.id}
                  className="relative border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {tier.sort_order === tierLevel + 1 && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Recommended
                    </Badge>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2">{tier.display_name}</h3>
                    <div className="text-3xl font-bold mb-1">${price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>

                    {hasTrial && (
                      <div className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
                        <Sparkles className="w-4 h-4" />
                        {tier.trial_days}-day free trial
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6 min-h-[120px]">
                    {keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(tier.id)}
                    className="w-full"
                    variant={tier.sort_order === tierLevel + 1 ? 'default' : 'outline'}
                  >
                    {hasTrial ? 'Start Free Trial' : 'Upgrade Now'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {tier.transaction_fee_percent}% transaction fee
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>All paid plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Button that opens upgrade modal
 */
export function UpgradeButton({
  children = 'Upgrade',
  variant = 'default',
  size = 'default',
  userId,
}: {
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  userId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <UpgradeModal open={open} onOpenChange={setOpen} userId={userId} />
    </>
  );
}
