/**
 * Trial Banner Component
 *
 * Displays a prominent banner when user is on trial.
 * Shows days remaining and CTA to upgrade.
 */

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFeatureGate } from '@/hooks/useFeatureGate';

interface TrialBannerProps {
  userId: string | undefined;
  dismissible?: boolean;
  onUpgrade?: () => void;
  className?: string;
}

export function TrialBanner({
  userId,
  dismissible = false,
  onUpgrade,
  className,
}: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { loading, isTrialing, trialDaysRemaining, subscription } = useFeatureGate(userId);

  if (loading || !isTrialing || dismissed) {
    return null;
  }

  const isLastDays = trialDaysRemaining <= 3;

  return (
    <Alert
      className={cn(
        'relative mb-4',
        isLastDays ? 'border-orange-200 bg-orange-50' : 'border-primary/20 bg-primary/5',
        className
      )}
    >
      <Sparkles className={cn('h-4 w-4', isLastDays ? 'text-orange-600' : 'text-primary')} />

      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 pr-4">
          <span className={cn('font-semibold', isLastDays ? 'text-orange-900' : 'text-primary')}>
            {trialDaysRemaining === 1
              ? 'Last day of trial'
              : `${trialDaysRemaining} days left in your trial`}
          </span>
          <span className={cn('ml-2', isLastDays ? 'text-orange-700' : 'text-muted-foreground')}>
            Enjoying {subscription?.tier.display_name}? You won't be charged until your trial ends.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onUpgrade && (
            <Button
              size="sm"
              variant={isLastDays ? 'default' : 'outline'}
              onClick={onUpgrade}
            >
              {isLastDays ? 'Keep This Plan' : 'Manage Subscription'}
            </Button>
          )}

          {dismissible && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Compact trial badge for navigation bar
 */
export function TrialBadge({ userId }: { userId: string | undefined }) {
  const { loading, isTrialing, trialDaysRemaining } = useFeatureGate(userId);

  if (loading || !isTrialing) {
    return null;
  }

  const isLastDays = trialDaysRemaining <= 3;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        isLastDays
          ? 'bg-orange-100 text-orange-700 border border-orange-200'
          : 'bg-primary/10 text-primary border border-primary/20'
      )}
    >
      <Sparkles className="w-3 h-3" />
      {trialDaysRemaining === 1
        ? 'Trial ends today'
        : `Trial: ${trialDaysRemaining} days left`}
    </div>
  );
}

/**
 * Trial status card for settings page
 */
export function TrialStatusCard({ userId }: { userId: string | undefined }) {
  const { loading, isTrialing, trialDaysRemaining, subscription } = useFeatureGate(userId);

  if (loading || !isTrialing) {
    return null;
  }

  const trialEndDate = subscription?.trial_end
    ? new Date(subscription.trial_end)
    : null;

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Free Trial Active</h3>
          <p className="text-sm text-muted-foreground">
            Full access to {subscription?.tier.display_name} features
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          {trialDaysRemaining} days left
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Trial ends:</span>
          <span className="font-medium">
            {trialEndDate?.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monthly price:</span>
          <span className="font-medium">
            ${(subscription!.tier.price_monthly / 100).toFixed(2)}/month
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          You won't be charged until {trialEndDate?.toLocaleDateString()}. Cancel anytime before then at no cost.
        </p>
      </div>
    </div>
  );
}
