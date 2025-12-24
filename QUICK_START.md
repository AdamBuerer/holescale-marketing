# Quick Start - Subscription System Setup

## Prerequisites

- Supabase project set up
- Stripe account (test mode is fine)
- Supabase CLI installed (`npm install -g supabase`)

## 5-Minute Setup

### Step 1: Database (2 minutes)

```bash
# Apply the migration
supabase migration up
```

Or manually in Supabase Studio:
1. Go to SQL Editor
2. Copy/paste `supabase/migrations/001_subscription_schema.sql`
3. Click "Run"

### Step 2: Environment Variables (1 minute)

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Add your Stripe test publishable key:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 3: Stripe Products (3 minutes)

1. Go to https://dashboard.stripe.com/test/products
2. Create 6 products (skip the free tiers):
   - Buyer Growth ($19/mo)
   - Buyer Professional ($49/mo)
   - Buyer Enterprise ($149/mo)
   - Supplier Growth ($49/mo)
   - Supplier Professional ($99/mo)
   - Supplier Enterprise ($249/mo)

3. For each product:
   - Set trial period to 14 days
   - Copy the `price_id` (starts with `price_`)

4. Update database with price IDs:

```sql
-- In Supabase SQL Editor
UPDATE subscription_tiers
SET stripe_price_id_monthly = 'price_ABC123...'
WHERE tier_key = 'buyer_growth';

-- Repeat for each paid tier
```

### Step 4: Deploy Edge Functions (2 minutes)

```bash
# Deploy all functions
supabase functions deploy stripe-create-checkout
supabase functions deploy stripe-create-portal
supabase functions deploy stripe-cancel-subscription
supabase functions deploy stripe-webhook

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_... # Get this after webhook setup
```

### Step 5: Stripe Webhook (2 minutes)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
5. Copy the signing secret (starts with `whsec_`)
6. Update the secret:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 6: Test (1 minute)

```tsx
// In any component
import { useFeatureGate } from '@/hooks/useFeatureGate';

function TestComponent() {
  const { user } = useAuth();
  const { loading, subscription, tierLevel } = useFeatureGate(user?.id);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Tier Level: {tierLevel}</p>
      <p>Plan: {subscription?.tier.display_name}</p>
    </div>
  );
}
```

## Test with Stripe Test Cards

Use these in checkout:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Any future date for expiry, any 3 digits for CVC, any zip code.

## Common Commands

```bash
# View Supabase logs
supabase functions logs stripe-webhook

# Test edge function locally
supabase functions serve stripe-create-checkout

# Check migration status
supabase migration list

# Rollback migration (if needed)
supabase migration down
```

## Troubleshooting

### Database error
```bash
# Check if tables exist
supabase db diff
```

### Edge function not working
```bash
# Check logs
supabase functions logs stripe-create-checkout --tail

# Verify secrets are set
supabase secrets list
```

### Webhook not receiving events
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check Stripe dashboard for delivery attempts
4. View function logs for errors

## Next Steps

1. Read `SUBSCRIPTION_IMPLEMENTATION.md` for detailed docs
2. Build pricing page (Phase 2)
3. Add feature gates to your components (Phase 3)

## Quick Reference

### Feature Keys

**Buyer**: `rfq_limit_monthly`, `saved_suppliers_limit`, `inventory_tracking`, `inventory_sku_limit`, `analytics_dashboard`, `team_seats`, `erp_integration`, `api_access`

**Supplier**: `rfq_responses_monthly`, `verified_badge`, `analytics_dashboard`, `featured_search`, `buyer_insights`, `team_seats`, `dedicated_manager`, `erp_integration`, `api_access`, `white_label`

### Useful Functions

```tsx
// Check feature
const hasInventory = hasFeature('inventory_tracking');

// Check usage
const canCreateRFQ = canUse('rfq_limit_monthly');

// Get remaining
const remaining = getRemaining('rfq_limit_monthly'); // number or 'unlimited'

// Trial info
const isOnTrial = isTrialing;
const daysLeft = trialDaysRemaining;

// Redirect to checkout
await redirectToCheckout({ tierId: 'uuid', billingCycle: 'monthly' });

// Open billing portal
await redirectToPortal();
```

---

That's it! You now have a fully functional subscription system. 🎉

For more details, see:
- `SUBSCRIPTION_IMPLEMENTATION.md` - Complete documentation
- `PHASE_1_COMPLETE.md` - What was implemented
