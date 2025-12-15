/**
 * Stripe Client Functions
 *
 * Client-side functions for interacting with Stripe through Supabase Edge Functions.
 * These functions handle subscription creation, management, and billing.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  BillingCycle,
} from '@/types/subscription';

/**
 * Create a Stripe checkout session for a new subscription
 */
export async function createCheckoutSession({
  tierId,
  billingCycle = 'monthly',
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
    body: {
      tierId,
      billingCycle,
      successUrl,
      cancelUrl,
    },
  });

  if (error) {
    console.error('Failed to create checkout session:', error);
    throw new Error('Failed to create checkout session');
  }

  return data;
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession(returnUrl: string): Promise<{ url: string }> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.functions.invoke('stripe-create-portal', {
    body: {
      returnUrl,
    },
  });

  if (error) {
    console.error('Failed to create portal session:', error);
    throw new Error('Failed to create portal session');
  }

  return data;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(immediately: boolean = false): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase.functions.invoke('stripe-cancel-subscription', {
    body: {
      immediately,
    },
  });

  if (error) {
    console.error('Failed to cancel subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(params: {
  tierId: string;
  billingCycle?: BillingCycle;
}): Promise<void> {
  const { tierId, billingCycle = 'monthly' } = params;

  // Build success and cancel URLs
  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/pricing`;

  // Create checkout session
  const { url } = await createCheckoutSession({
    tierId,
    billingCycle,
    successUrl,
    cancelUrl,
  });

  // Redirect to Stripe Checkout
  window.location.href = url;
}

/**
 * Redirect to Stripe Customer Portal
 */
export async function redirectToPortal(): Promise<void> {
  const returnUrl = `${window.location.origin}/settings/billing`;

  const { url } = await createPortalSession(returnUrl);

  window.location.href = url;
}

/**
 * Get subscription tiers from database
 */
export async function getSubscriptionTiers(userType: 'buyer' | 'supplier') {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('subscription_tiers')
    .select(`
      *,
      features:tier_features(*)
    `)
    .eq('user_type', userType)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch subscription tiers:', error);
    throw new Error('Failed to fetch subscription tiers');
  }

  return data;
}

/**
 * Get current user's subscription
 */
export async function getCurrentSubscription(userId: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      tier:subscription_tiers(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned (user doesn't have subscription yet)
    console.error('Failed to fetch subscription:', error);
    throw new Error('Failed to fetch subscription');
  }

  return data;
}

/**
 * Get usage statistics for current billing period
 */
export async function getUsageStats(userId: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .gte('period_start', periodStart.toISOString().split('T')[0])
    .lte('period_end', periodEnd.toISOString().split('T')[0]);

  if (error) {
    console.error('Failed to fetch usage stats:', error);
    throw new Error('Failed to fetch usage stats');
  }

  return data;
}
