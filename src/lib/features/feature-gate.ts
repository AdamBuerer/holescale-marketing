/**
 * Feature Gate Service
 *
 * Central service for checking feature access throughout the application.
 * This service checks both subscription tier features and usage limits.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  UserSubscription,
  SubscriptionTier,
  TierFeature,
  FeatureKey,
  UserSubscriptionWithTier,
} from '@/types/subscription';

export class FeatureGate {
  private userId: string;
  private subscription: UserSubscriptionWithTier | null = null;
  private features: Map<string, string> = new Map();
  private usage: Map<string, number> = new Map();
  private tierSortOrder: number = 1;

  private constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Create a FeatureGate instance for a specific user
   */
  static async forUser(userId: string): Promise<FeatureGate> {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const gate = new FeatureGate(userId);

    // Load subscription data
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        tier:subscription_tiers(*)
      `)
      .eq('user_id', userId)
      .single();

    if (subscription) {
      gate.subscription = subscription as unknown as UserSubscriptionWithTier;
      gate.tierSortOrder = subscription.tier?.sort_order || 1;

      // Load tier features
      const { data: tierFeatures } = await supabase
        .from('tier_features')
        .select('*')
        .eq('tier_id', subscription.tier_id);

      if (tierFeatures) {
        tierFeatures.forEach((feature: TierFeature) => {
          gate.features.set(feature.feature_key, feature.feature_value);
        });
      }

      // Load current usage for this billing period
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('period_start', periodStart.toISOString().split('T')[0])
        .lte('period_end', periodEnd.toISOString().split('T')[0]);

      if (usageData) {
        usageData.forEach((usage) => {
          gate.usage.set(usage.feature_key, usage.usage_count);
        });
      }
    } else {
      // No subscription found - user gets free tier by default
      // You may want to create a default subscription here
      console.warn(`No subscription found for user ${userId}`);
    }

    return gate;
  }

  /**
   * Check if a boolean feature is enabled
   */
  hasFeature(featureKey: string): boolean {
    const value = this.features.get(featureKey);
    return value === 'true';
  }

  /**
   * Check if user can use a feature (within limit)
   */
  canUse(featureKey: string): boolean {
    const limit = this.features.get(featureKey);
    if (!limit) return false;
    if (limit === 'unlimited') return true;

    const currentUsage = this.usage.get(featureKey) || 0;
    const limitNum = parseInt(limit, 10);

    return currentUsage < limitNum;
  }

  /**
   * Get remaining usage for a feature
   */
  getRemaining(featureKey: string): number | 'unlimited' {
    const limit = this.features.get(featureKey);
    if (!limit) return 0;
    if (limit === 'unlimited') return 'unlimited';

    const currentUsage = this.usage.get(featureKey) || 0;
    const limitNum = parseInt(limit, 10);

    return Math.max(0, limitNum - currentUsage);
  }

  /**
   * Get current usage for a feature
   */
  getUsage(featureKey: string): number {
    return this.usage.get(featureKey) || 0;
  }

  /**
   * Get the limit for a feature
   */
  getLimit(featureKey: string): number | 'unlimited' {
    const limit = this.features.get(featureKey);
    if (!limit) return 0;
    if (limit === 'unlimited') return 'unlimited';
    return parseInt(limit, 10);
  }

  /**
   * Get the feature value (for tier_unlock features)
   */
  getFeatureValue(featureKey: string): string | null {
    return this.features.get(featureKey) || null;
  }

  /**
   * Get current tier level (1-4) for comparison
   */
  getTierLevel(): number {
    return this.tierSortOrder;
  }

  /**
   * Check if user is on trial
   */
  isTrialing(): boolean {
    return this.subscription?.status === 'trialing';
  }

  /**
   * Get days remaining in trial
   */
  getTrialDaysRemaining(): number {
    if (!this.isTrialing() || !this.subscription?.trial_end) return 0;

    const end = new Date(this.subscription.trial_end);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * Check if subscription is active (including trial)
   */
  isActive(): boolean {
    const status = this.subscription?.status;
    return status === 'active' || status === 'trialing';
  }

  /**
   * Get the subscription object
   */
  getSubscription(): UserSubscriptionWithTier | null {
    return this.subscription;
  }

  /**
   * Get the tier object
   */
  getTier(): SubscriptionTier | null {
    return this.subscription?.tier || null;
  }

  /**
   * Get transaction fee percentage for current tier
   */
  getTransactionFeePercent(): number {
    return this.subscription?.tier?.transaction_fee_percent || 0;
  }

  /**
   * Check if subscription will be canceled at period end
   */
  willCancelAtPeriodEnd(): boolean {
    return this.subscription?.cancel_at_period_end || false;
  }

  /**
   * Get next billing date
   */
  getNextBillingDate(): Date | null {
    if (!this.subscription?.current_period_end) return null;
    return new Date(this.subscription.current_period_end);
  }

  /**
   * Increment usage for a feature
   * Note: This should typically be called server-side
   */
  async incrementUsage(featureKey: FeatureKey, amount: number = 1): Promise<boolean> {
    if (!supabase) return false;

    // Check if within limit first
    if (!this.canUse(featureKey)) {
      return false;
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: this.userId,
        feature_key: featureKey,
        usage_count: (this.usage.get(featureKey) || 0) + amount,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,feature_key,period_start',
      });

    if (!error) {
      // Update local cache
      this.usage.set(featureKey, (this.usage.get(featureKey) || 0) + amount);
      return true;
    }

    console.error('Failed to increment usage:', error);
    return false;
  }
}

/**
 * Helper function to check if a user has access to a feature
 * This is a convenience wrapper around FeatureGate.forUser()
 */
export async function checkFeatureAccess(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const gate = await FeatureGate.forUser(userId);
  return gate.hasFeature(featureKey);
}

/**
 * Helper function to check if a user can use a limited feature
 */
export async function checkUsageLimit(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const gate = await FeatureGate.forUser(userId);
  return gate.canUse(featureKey);
}
