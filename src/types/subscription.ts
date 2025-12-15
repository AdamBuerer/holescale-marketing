/**
 * HoleScale Subscription System Types
 *
 * These types mirror the database schema and provide type safety
 * for all subscription-related operations.
 */

export type UserType = 'buyer' | 'supplier';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export type BillingCycle = 'monthly' | 'yearly';

export type FeatureType = 'limit' | 'boolean' | 'tier_unlock';

export type TierKey =
  | 'buyer_starter'
  | 'buyer_growth'
  | 'buyer_professional'
  | 'buyer_enterprise'
  | 'supplier_lite'
  | 'supplier_growth'
  | 'supplier_professional'
  | 'supplier_enterprise';

export interface SubscriptionTier {
  id: string;
  tier_key: TierKey;
  user_type: UserType;
  name: string;
  display_name: string;
  price_monthly: number; // in cents
  price_yearly: number | null; // in cents
  transaction_fee_percent: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  stripe_product_id: string | null;
  trial_days: number;
  is_free: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TierFeature {
  id: string;
  tier_id: string;
  feature_key: string;
  feature_value: string; // 'unlimited', '5', 'true', 'false', etc.
  feature_type: FeatureType;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  trial_start: string | null;
  trial_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  feature_key: string;
  usage_count: number;
  period_start: string; // date string
  period_end: string; // date string
  created_at: string;
  updated_at: string;
}

export type SubscriptionEventType =
  | 'created'
  | 'trial_started'
  | 'trial_ended'
  | 'upgraded'
  | 'downgraded'
  | 'canceled'
  | 'reactivated'
  | 'payment_failed'
  | 'payment_succeeded';

export interface SubscriptionEvent {
  id: string;
  user_id: string | null;
  subscription_id: string | null;
  event_type: SubscriptionEventType;
  previous_tier_id: string | null;
  new_tier_id: string | null;
  stripe_event_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

// ============================================================================
// Combined Types (with joined data)
// ============================================================================

export interface UserSubscriptionWithTier extends UserSubscription {
  tier: SubscriptionTier;
}

export interface SubscriptionTierWithFeatures extends SubscriptionTier {
  features: TierFeature[];
}

// ============================================================================
// Feature Keys (for type safety)
// ============================================================================

// Buyer Feature Keys
export type BuyerFeatureKey =
  | 'rfq_limit_monthly'
  | 'saved_suppliers_limit'
  | 'inventory_tracking'
  | 'inventory_sku_limit'
  | 'analytics_dashboard'
  | 'team_seats'
  | 'erp_integration'
  | 'api_access';

// Supplier Feature Keys
export type SupplierFeatureKey =
  | 'rfq_responses_monthly'
  | 'verified_badge'
  | 'analytics_dashboard'
  | 'featured_search'
  | 'buyer_insights'
  | 'team_seats'
  | 'dedicated_manager'
  | 'erp_integration'
  | 'api_access'
  | 'white_label';

export type FeatureKey = BuyerFeatureKey | SupplierFeatureKey;

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateCheckoutSessionRequest {
  tierId: string;
  billingCycle: BillingCycle;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface GetCurrentSubscriptionResponse {
  subscription: UserSubscriptionWithTier | null;
  features: Map<string, string>;
  usage: Map<string, number>;
}

export interface GetUsageResponse {
  [featureKey: string]: {
    current: number;
    limit: number | 'unlimited';
    remaining: number | 'unlimited';
    resetDate: string;
  };
}

export interface IncrementUsageRequest {
  featureKey: FeatureKey;
  amount?: number;
}

export interface CancelSubscriptionRequest {
  immediately?: boolean;
  reason?: string;
}
