# HoleScale Subscription System - Phase 1 Implementation

## Overview

Phase 1 (Foundation) of the subscription system has been implemented. This includes:

- ✅ Database schema for subscriptions, tiers, features, and usage tracking
- ✅ TypeScript types for type-safe subscription management
- ✅ FeatureGate service for checking feature access
- ✅ React hooks for using feature gates in components
- ✅ Stripe integration setup (checkout, webhooks, portal)
- ✅ Client-side utilities for subscription management

## Files Created

### Database Schema
- `supabase/migrations/001_subscription_schema.sql` - Complete database schema with seed data

### TypeScript Types
- `src/types/subscription.ts` - All subscription-related TypeScript types

### Feature Gate System
- `src/lib/features/feature-gate.ts` - Core FeatureGate service
- `src/hooks/useFeatureGate.ts` - React hooks for feature gating

### Stripe Integration
- `src/lib/stripe/config.ts` - Stripe configuration
- `src/lib/stripe/client.ts` - Client-side Stripe utilities
- `supabase/functions/stripe-create-checkout/index.ts` - Edge function for checkout
- `supabase/functions/stripe-webhook/index.ts` - Edge function for webhooks

## Setup Instructions

### 1. Database Setup

Run the migration to create all subscription tables:

```bash
# If using Supabase CLI
supabase migration up

# Or manually run the SQL in Supabase Studio
# Go to SQL Editor and paste the contents of:
# supabase/migrations/001_subscription_schema.sql
```

This will create:
- `subscription_tiers` - All pricing tiers (Buyer & Supplier)
- `tier_features` - Feature definitions for each tier
- `user_subscriptions` - User subscription state
- `usage_tracking` - Monthly usage counters
- `subscription_events` - Audit log

And seed data for:
- 4 Buyer tiers (Starter, Growth, Professional, Enterprise)
- 4 Supplier tiers (Lite, Growth, Professional, Enterprise)
- All feature definitions for each tier

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# For Supabase Edge Functions (server-side only)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (you should already have these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # For webhooks
```

### 3. Stripe Dashboard Setup

#### Create Products and Prices

For each tier, create a Product and Price in Stripe:

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Create products for each tier:

**Buyer Tiers:**
- Buyer Growth - $19/month (with 14-day trial)
- Buyer Professional - $49/month (with 14-day trial)
- Buyer Enterprise - $149/month (with 14-day trial)

**Supplier Tiers:**
- Supplier Growth - $49/month (with 14-day trial)
- Supplier Professional - $99/month (with 14-day trial)
- Supplier Enterprise - $249/month (with 14-day trial)

4. For each price, copy the `price_id` (starts with `price_`)
5. Update your database with these IDs:

```sql
-- Update Buyer tiers
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_1ABC123...'
WHERE tier_key = 'buyer_growth';

-- Repeat for each tier...
```

#### Configure Customer Portal

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Click "Activate test link"
3. Enable these features:
   - Update payment method
   - Cancel subscription
   - View invoices

#### Set Up Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### 4. Deploy Supabase Edge Functions

Deploy the Stripe integration functions:

```bash
# Deploy checkout function
supabase functions deploy stripe-create-checkout --no-verify-jwt

# Deploy webhook function
supabase functions deploy stripe-webhook --no-verify-jwt

# Set secrets for the functions
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Install Dependencies

Make sure you have the Stripe dependency:

```bash
npm install stripe
# or
yarn add stripe
```

## Usage Examples

### Using FeatureGate Hook in Components

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';

function MyComponent() {
  const { user } = useAuth(); // Your auth hook
  const {
    loading,
    hasFeature,
    canUse,
    getRemaining,
    isTrialing,
    trialDaysRemaining,
    subscription,
  } = useFeatureGate(user?.id);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Check boolean features */}
      {hasFeature('inventory_tracking') && (
        <InventoryDashboard />
      )}

      {/* Check usage limits */}
      {canUse('rfq_limit_monthly') ? (
        <CreateRFQButton />
      ) : (
        <UpgradePrompt feature="rfq_limit_monthly" />
      )}

      {/* Show remaining usage */}
      <p>RFQs remaining: {getRemaining('rfq_limit_monthly')}</p>

      {/* Trial banner */}
      {isTrialing && (
        <Banner>
          Your trial ends in {trialDaysRemaining} days
        </Banner>
      )}

      {/* Current plan */}
      <p>Current plan: {subscription?.tier.display_name}</p>
    </div>
  );
}
```

### Redirecting to Checkout

```tsx
import { redirectToCheckout } from '@/lib/stripe/client';

function PricingCard({ tier }) {
  const handleSubscribe = async () => {
    try {
      await redirectToCheckout({
        tierId: tier.id,
        billingCycle: 'monthly',
      });
    } catch (error) {
      console.error('Failed to start checkout:', error);
      toast.error('Failed to start checkout');
    }
  };

  return (
    <Card>
      <h3>{tier.display_name}</h3>
      <p>${tier.price_monthly / 100}/month</p>
      <Button onClick={handleSubscribe}>
        Subscribe Now
      </Button>
    </Card>
  );
}
```

### Opening Customer Portal

```tsx
import { redirectToPortal } from '@/lib/stripe/client';

function BillingSettings() {
  const handleManageBilling = async () => {
    try {
      await redirectToPortal();
    } catch (error) {
      console.error('Failed to open portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  return (
    <Button onClick={handleManageBilling}>
      Manage Billing
    </Button>
  );
}
```

## Feature Keys Reference

### Buyer Features
- `rfq_limit_monthly` - Number of RFQs per month (3, unlimited)
- `saved_suppliers_limit` - Number of saved suppliers (5, 25, unlimited)
- `inventory_tracking` - Can track inventory (boolean)
- `inventory_sku_limit` - Number of SKUs (0, 50, unlimited)
- `analytics_dashboard` - Analytics access (false, basic, advanced)
- `team_seats` - Number of team members (1, 3, unlimited)
- `erp_integration` - ERP integration access (boolean)
- `api_access` - API access (boolean)

### Supplier Features
- `rfq_responses_monthly` - Number of RFQ responses (5, unlimited)
- `verified_badge` - Verified supplier badge (boolean)
- `analytics_dashboard` - Analytics access (boolean)
- `featured_search` - Featured in search results (boolean)
- `buyer_insights` - Access to buyer insights (boolean)
- `team_seats` - Number of team members (1, 3, unlimited)
- `dedicated_manager` - Dedicated account manager (boolean)
- `erp_integration` - ERP integration access (boolean)
- `api_access` - API access (boolean)
- `white_label` - White-label solution (boolean)

## Next Steps (Phase 2+)

Now that Phase 1 is complete, you can move on to:

### Phase 2: User-Facing UI
- [ ] Create pricing page with tier cards
- [ ] Implement checkout flow
- [ ] Build checkout success page
- [ ] Add trial banners/notifications

### Phase 3: Feature Gating UI
- [ ] Create FeatureGate component
- [ ] Build upgrade prompt modal
- [ ] Add usage indicators
- [ ] Implement feature-gated components

### Phase 4: Account Management
- [ ] Build billing settings page
- [ ] Create usage dashboard
- [ ] Add subscription management UI

### Phase 5: Admin Panel
- [ ] Build subscriptions list
- [ ] Create revenue dashboard
- [ ] Add admin actions

## Testing

### Test Mode Checklist

1. Use Stripe test keys (starts with `pk_test_` and `sk_test_`)
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires auth: `4000 0025 0000 3155`
3. Test trial period flow
4. Test subscription cancellation
5. Test webhook events in Stripe dashboard

### Important Notes

- Free tiers (Starter/Lite) have `trial_days = 0` (no trial)
- Paid tiers have 14-day trials with card required
- Transaction fees are per tier and stored in database
- Usage resets monthly (first day of month)
- All prices in database are in cents
- Webhook signature verification is critical for security

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is correct in Stripe
- Verify webhook signing secret matches
- Check Supabase function logs for errors

### Checkout session fails
- Verify Stripe price IDs are set in database
- Check that user is authenticated
- Ensure Stripe secret key is configured

### Feature gate not working
- Verify user has a subscription record
- Check tier features are seeded correctly
- Ensure Supabase client is initialized

## Support

For questions about this implementation, refer to:
- Original plan: `HoleScale_Pricing_Implementation_Plan.docx`
- Stripe docs: https://stripe.com/docs
- Supabase docs: https://supabase.com/docs
