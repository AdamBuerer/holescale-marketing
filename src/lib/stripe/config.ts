/**
 * Stripe Configuration
 *
 * Environment variables and configuration for Stripe integration.
 */

// Get Stripe keys from environment variables
export const stripeConfig = {
  // Public key (safe to expose in frontend)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

  // These should only be used server-side (in Supabase Edge Functions or backend)
  secretKey: import.meta.env.STRIPE_SECRET_KEY || '',
  webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET || '',
};

// Validate configuration
export function validateStripeConfig(): void {
  if (!stripeConfig.publishableKey) {
    console.warn('VITE_STRIPE_PUBLISHABLE_KEY not configured');
  }
}

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!stripeConfig.publishableKey;
}
