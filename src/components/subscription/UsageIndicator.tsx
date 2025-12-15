/**
 * Usage Indicator Components
 *
 * Visual components to show users their current usage vs limits.
 * Includes progress bars, badges, and warnings.
 */

import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureKey } from '@/types/subscription';

interface UsageIndicatorProps {
  userId: string | undefined;
  featureKey: FeatureKey;
  label?: string;
  showDetails?: boolean;
  warnAt?: number; // Percentage to show warning (default: 80)
}

/**
 * Progress bar style usage indicator
 */
export function UsageProgressBar({
  userId,
  featureKey,
  label,
  showDetails = true,
  warnAt = 80,
}: UsageIndicatorProps) {
  const { loading, getUsage, getLimit, getRemaining } = useFeatureGate(userId);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded"></div>
        <div className="h-2 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  const usage = getUsage(featureKey);
  const limit = getLimit(featureKey);
  const remaining = getRemaining(featureKey);

  if (limit === 'unlimited') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span>{label || featureKey}: Unlimited</span>
      </div>
    );
  }

  const percentage = (usage / (limit as number)) * 100;
  const isWarning = percentage >= warnAt;
  const isFull = remaining === 0;

  const displayLabel = label || featureKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{displayLabel}</span>
        {showDetails && (
          <span className={cn(
            'text-muted-foreground',
            isWarning && 'text-orange-500 font-medium',
            isFull && 'text-red-500 font-medium'
          )}>
            {usage} / {limit}
          </span>
        )}
      </div>

      <Progress
        value={percentage}
        className={cn(
          'h-2',
          isWarning && 'bg-orange-100',
          isFull && 'bg-red-100'
        )}
      />

      {isWarning && !isFull && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {remaining} {displayLabel.toLowerCase()} remaining
        </p>
      )}

      {isFull && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Limit reached
        </p>
      )}
    </div>
  );
}

/**
 * Badge style usage indicator
 */
export function UsageBadge({
  userId,
  featureKey,
  label,
}: UsageIndicatorProps) {
  const { loading, getUsage, getLimit } = useFeatureGate(userId);

  if (loading) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  const usage = getUsage(featureKey);
  const limit = getLimit(featureKey);

  if (limit === 'unlimited') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Unlimited
      </Badge>
    );
  }

  const percentage = (usage / (limit as number)) * 100;
  const isWarning = percentage >= 80;
  const isFull = usage >= limit;

  return (
    <Badge
      variant="outline"
      className={cn(
        isWarning && !isFull && 'bg-orange-50 text-orange-700 border-orange-200',
        isFull && 'bg-red-50 text-red-700 border-red-200',
        !isWarning && 'bg-blue-50 text-blue-700 border-blue-200'
      )}
    >
      {usage} / {limit} {label || ''}
    </Badge>
  );
}

/**
 * Card style usage indicator with details
 */
export function UsageCard({
  userId,
  featureKey,
  label,
}: UsageIndicatorProps) {
  const { loading, getUsage, getLimit, getRemaining } = useFeatureGate(userId);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-2 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  const usage = getUsage(featureKey);
  const limit = getLimit(featureKey);
  const remaining = getRemaining(featureKey);

  const displayLabel = label || featureKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (limit === 'unlimited') {
    return (
      <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-900">{displayLabel}</span>
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-2xl font-bold text-green-900 mb-1">Unlimited</div>
        <div className="text-xs text-green-700">No limits on this feature</div>
      </div>
    );
  }

  const percentage = (usage / (limit as number)) * 100;
  const isWarning = percentage >= 80;
  const isFull = remaining === 0;

  return (
    <div className={cn(
      'border rounded-lg p-4 bg-card',
      isWarning && !isFull && 'border-orange-200 bg-orange-50/50',
      isFull && 'border-red-200 bg-red-50/50'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{displayLabel}</span>
        {isWarning ? (
          <AlertTriangle className={cn(
            'w-5 h-5',
            isFull ? 'text-red-500' : 'text-orange-500'
          )} />
        ) : (
          <TrendingUp className="w-5 h-5 text-blue-500" />
        )}
      </div>

      <div className="text-2xl font-bold mb-1">
        {remaining === 'unlimited' ? 'Unlimited' : remaining}
      </div>

      <div className="text-xs text-muted-foreground mb-3">
        {usage} of {limit} used
      </div>

      <Progress value={percentage} className="h-1.5" />
    </div>
  );
}

/**
 * Alert style warning when nearing limits
 */
export function UsageAlert({
  userId,
  featureKey,
  label,
  warnAt = 80,
}: UsageIndicatorProps) {
  const { loading, getUsage, getLimit, getRemaining } = useFeatureGate(userId);

  if (loading) return null;

  const usage = getUsage(featureKey);
  const limit = getLimit(featureKey);
  const remaining = getRemaining(featureKey);

  if (limit === 'unlimited') return null;

  const percentage = (usage / (limit as number)) * 100;

  if (percentage < warnAt) return null;

  const displayLabel = label || featureKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const isFull = remaining === 0;

  return (
    <Alert variant={isFull ? 'destructive' : 'default'} className={!isFull ? 'border-orange-200 bg-orange-50' : ''}>
      <AlertTriangle className={cn('h-4 w-4', !isFull && 'text-orange-600')} />
      <AlertDescription className={!isFull ? 'text-orange-900' : ''}>
        {isFull ? (
          <span>
            You've reached your limit of {limit} {displayLabel.toLowerCase()}.
            <a href="/pricing" className="underline ml-1 font-medium">
              Upgrade your plan
            </a> to continue.
          </span>
        ) : (
          <span>
            You're at {Math.round(percentage)}% of your {displayLabel.toLowerCase()} limit
            ({remaining} remaining).
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Simple text usage display
 */
export function UsageText({
  userId,
  featureKey,
}: {
  userId: string | undefined;
  featureKey: FeatureKey;
}) {
  const { loading, getUsage, getLimit } = useFeatureGate(userId);

  if (loading) return <span className="text-muted-foreground">Loading...</span>;

  const usage = getUsage(featureKey);
  const limit = getLimit(featureKey);

  if (limit === 'unlimited') {
    return <span className="text-green-600 font-medium">Unlimited</span>;
  }

  return (
    <span className="text-muted-foreground">
      {usage} / {limit}
    </span>
  );
}
