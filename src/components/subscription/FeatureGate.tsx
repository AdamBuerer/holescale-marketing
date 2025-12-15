/**
 * FeatureGate Component
 *
 * Declarative component for gating UI elements based on subscription features.
 * Can show upgrade prompts or custom fallbacks when access is denied.
 */

import { ReactNode } from 'react';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UpgradePrompt } from './UpgradePrompt';
import type { FeatureKey } from '@/types/subscription';

interface FeatureGateProps {
  userId: string | undefined;
  feature?: string;
  minTier?: number; // 1=Starter/Lite, 2=Growth, 3=Pro/Professional, 4=Enterprise
  usageKey?: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode; // Custom fallback when feature not available
  showUpgrade?: boolean; // Show upgrade prompt (default: true)
  upgradeMessage?: string; // Custom upgrade message
  loading?: ReactNode; // Custom loading state
}

/**
 * FeatureGate component for declarative feature gating
 *
 * @example
 * ```tsx
 * // Gate by boolean feature
 * <FeatureGate userId={user.id} feature="inventory_tracking">
 *   <InventoryDashboard />
 * </FeatureGate>
 *
 * // Gate by usage limit
 * <FeatureGate userId={user.id} usageKey="rfq_limit_monthly">
 *   <CreateRFQButton />
 * </FeatureGate>
 *
 * // Gate by tier level
 * <FeatureGate userId={user.id} minTier={3}>
 *   <AdvancedAnalytics />
 * </FeatureGate>
 *
 * // Custom fallback
 * <FeatureGate
 *   userId={user.id}
 *   feature="api_access"
 *   showUpgrade={false}
 *   fallback={<ComingSoonBanner />}
 * >
 *   <APISettings />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  userId,
  feature,
  minTier,
  usageKey,
  children,
  fallback,
  showUpgrade = true,
  upgradeMessage,
  loading,
}: FeatureGateProps) {
  const {
    loading: isLoading,
    hasFeature,
    canUse,
    tierLevel,
    getRemaining,
    getLimit,
  } = useFeatureGate(userId);

  if (isLoading) {
    return loading || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  let hasAccess = true;
  let denialReason: string | undefined;

  // Check boolean feature
  if (feature && !hasFeature(feature)) {
    hasAccess = false;
    denialReason = `This feature requires a higher tier plan`;
  }

  // Check tier level
  if (minTier && tierLevel < minTier) {
    hasAccess = false;
    denialReason = `This feature requires tier level ${minTier} or higher`;
  }

  // Check usage limit
  if (usageKey && !canUse(usageKey)) {
    hasAccess = false;
    const remaining = getRemaining(usageKey);
    const limit = getLimit(usageKey);
    denialReason = `You've reached your limit of ${limit} ${usageKey.replace(/_/g, ' ')}`;
  }

  if (!hasAccess) {
    if (showUpgrade) {
      return (
        <UpgradePrompt
          feature={feature || usageKey}
          message={upgradeMessage || denialReason}
          featureKey={usageKey}
        />
      );
    }
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}

/**
 * Simpler version that only checks a single feature
 */
export function RequiresFeature({
  userId,
  featureKey,
  children,
  fallback,
}: {
  userId: string | undefined;
  featureKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <FeatureGate
      userId={userId}
      feature={featureKey}
      fallback={fallback}
      showUpgrade={!fallback}
    >
      {children}
    </FeatureGate>
  );
}

/**
 * Simpler version that only checks usage limits
 */
export function RequiresUsage({
  userId,
  usageKey,
  children,
  fallback,
}: {
  userId: string | undefined;
  usageKey: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <FeatureGate
      userId={userId}
      usageKey={usageKey}
      fallback={fallback}
      showUpgrade={!fallback}
    >
      {children}
    </FeatureGate>
  );
}

/**
 * Simpler version that only checks tier level
 */
export function RequiresTier({
  userId,
  minTier,
  children,
  fallback,
}: {
  userId: string | undefined;
  minTier: number;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <FeatureGate
      userId={userId}
      minTier={minTier}
      fallback={fallback}
      showUpgrade={!fallback}
    >
      {children}
    </FeatureGate>
  );
}
