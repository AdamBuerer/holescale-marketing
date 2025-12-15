/**
 * useFeatureGate Hook
 *
 * React hook for accessing feature gate functionality in components.
 * Provides a simple API for checking feature access and usage limits.
 */

import { useState, useEffect, useCallback } from 'react';
import { FeatureGate } from '@/lib/features/feature-gate';
import type { UserSubscriptionWithTier, FeatureKey } from '@/types/subscription';

interface UseFeatureGateReturn {
  loading: boolean;
  error: Error | null;
  hasFeature: (key: string) => boolean;
  canUse: (key: string) => boolean;
  getRemaining: (key: string) => number | 'unlimited';
  getUsage: (key: string) => number;
  getLimit: (key: string) => number | 'unlimited';
  getFeatureValue: (key: string) => string | null;
  isTrialing: boolean;
  trialDaysRemaining: number;
  tierLevel: number;
  isActive: boolean;
  subscription: UserSubscriptionWithTier | null;
  transactionFeePercent: number;
  willCancelAtPeriodEnd: boolean;
  nextBillingDate: Date | null;
  incrementUsage: (featureKey: FeatureKey, amount?: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * Hook for accessing feature gate functionality
 *
 * @param userId - The user ID to check features for
 * @returns Feature gate API
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user } = useAuth();
 *   const {
 *     loading,
 *     hasFeature,
 *     canUse,
 *     getRemaining,
 *     isTrialing,
 *     trialDaysRemaining
 *   } = useFeatureGate(user?.id);
 *
 *   if (loading) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       {hasFeature('inventory_tracking') && <InventoryDashboard />}
 *       {canUse('rfq_limit_monthly') ? (
 *         <CreateRFQButton />
 *       ) : (
 *         <UpgradePrompt feature="rfq_limit_monthly" />
 *       )}
 *       <p>RFQs remaining: {getRemaining('rfq_limit_monthly')}</p>
 *       {isTrialing && (
 *         <Banner>Trial ends in {trialDaysRemaining} days</Banner>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeatureGate(userId: string | undefined): UseFeatureGateReturn {
  const [gate, setGate] = useState<FeatureGate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGate = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newGate = await FeatureGate.forUser(userId);
      setGate(newGate);
    } catch (err) {
      console.error('Failed to load feature gate:', err);
      setError(err instanceof Error ? err : new Error('Failed to load feature gate'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadGate();
  }, [loadGate]);

  const hasFeature = useCallback(
    (key: string): boolean => {
      return gate?.hasFeature(key) ?? false;
    },
    [gate]
  );

  const canUse = useCallback(
    (key: string): boolean => {
      return gate?.canUse(key) ?? false;
    },
    [gate]
  );

  const getRemaining = useCallback(
    (key: string): number | 'unlimited' => {
      return gate?.getRemaining(key) ?? 0;
    },
    [gate]
  );

  const getUsage = useCallback(
    (key: string): number => {
      return gate?.getUsage(key) ?? 0;
    },
    [gate]
  );

  const getLimit = useCallback(
    (key: string): number | 'unlimited' => {
      return gate?.getLimit(key) ?? 0;
    },
    [gate]
  );

  const getFeatureValue = useCallback(
    (key: string): string | null => {
      return gate?.getFeatureValue(key) ?? null;
    },
    [gate]
  );

  const incrementUsage = useCallback(
    async (featureKey: FeatureKey, amount: number = 1): Promise<boolean> => {
      if (!gate) return false;
      const success = await gate.incrementUsage(featureKey, amount);
      if (success) {
        // Refresh the gate to update usage counts
        await loadGate();
      }
      return success;
    },
    [gate, loadGate]
  );

  return {
    loading,
    error,
    hasFeature,
    canUse,
    getRemaining,
    getUsage,
    getLimit,
    getFeatureValue,
    isTrialing: gate?.isTrialing() ?? false,
    trialDaysRemaining: gate?.getTrialDaysRemaining() ?? 0,
    tierLevel: gate?.getTierLevel() ?? 1,
    isActive: gate?.isActive() ?? false,
    subscription: gate?.getSubscription() ?? null,
    transactionFeePercent: gate?.getTransactionFeePercent() ?? 0,
    willCancelAtPeriodEnd: gate?.willCancelAtPeriodEnd() ?? false,
    nextBillingDate: gate?.getNextBillingDate() ?? null,
    incrementUsage,
    refresh: loadGate,
  };
}

/**
 * Hook for checking a specific feature
 * Simplified version that only checks one feature
 */
export function useHasFeature(userId: string | undefined, featureKey: string): {
  loading: boolean;
  hasAccess: boolean;
} {
  const { loading, hasFeature } = useFeatureGate(userId);

  return {
    loading,
    hasAccess: hasFeature(featureKey),
  };
}

/**
 * Hook for checking usage limits
 * Simplified version that only checks one usage limit
 */
export function useCanUseFeature(userId: string | undefined, featureKey: string): {
  loading: boolean;
  canUse: boolean;
  remaining: number | 'unlimited';
  usage: number;
  limit: number | 'unlimited';
} {
  const { loading, canUse, getRemaining, getUsage, getLimit } = useFeatureGate(userId);

  return {
    loading,
    canUse: canUse(featureKey),
    remaining: getRemaining(featureKey),
    usage: getUsage(featureKey),
    limit: getLimit(featureKey),
  };
}
