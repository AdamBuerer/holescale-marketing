# Subscription System - File Structure

## Overview

All files created for the subscription system, organized by category.

## 📁 Directory Structure

```
holescale-marketing/
│
├── 📖 Documentation
│   ├── QUICK_START.md ⭐ START HERE
│   ├── PHASE_1_COMPLETE.md
│   ├── SUBSCRIPTION_IMPLEMENTATION.md
│   └── SUBSCRIPTION_FILES.md (this file)
│
├── 🗄️ Database
│   └── supabase/
│       └── migrations/
│           └── 001_subscription_schema.sql
│               • Creates all tables
│               • Seeds tier data
│               • Seeds feature data
│
├── ⚡ Edge Functions (Server-side)
│   └── supabase/
│       └── functions/
│           ├── stripe-create-checkout/
│           │   └── index.ts
│           │       • Creates Stripe checkout sessions
│           │       • Handles trial configuration
│           │       • Creates/retrieves Stripe customers
│           │
│           ├── stripe-create-portal/
│           │   └── index.ts
│           │       • Creates Customer Portal sessions
│           │       • Allows users to manage subscriptions
│           │
│           ├── stripe-cancel-subscription/
│           │   └── index.ts
│           │       • Cancels subscriptions
│           │       • Supports immediate or end-of-period
│           │
│           └── stripe-webhook/
│               └── index.ts
│                   • Handles all Stripe webhook events
│                   • Updates subscription status
│                   • Logs events to database
│
├── 📦 Types (TypeScript)
│   └── src/
│       └── types/
│           └── subscription.ts
│               • All subscription types
│               • Tier, feature, subscription interfaces
│               • API request/response types
│
├── 🔧 Core Services
│   └── src/
│       └── lib/
│           ├── features/
│           │   └── feature-gate.ts
│           │       • FeatureGate class
│           │       • Check feature access
│           │       • Track usage limits
│           │       • Trial management
│           │
│           └── stripe/
│               ├── config.ts
│               │   • Stripe configuration
│               │   • Environment variables
│               │
│               └── client.ts
│                   • Client-side utilities
│                   • createCheckoutSession()
│                   • createPortalSession()
│                   • cancelSubscription()
│                   • redirectToCheckout()
│                   • redirectToPortal()
│                   • getSubscriptionTiers()
│                   • getCurrentSubscription()
│                   • getUsageStats()
│
└── 🎣 React Hooks
    └── src/
        └── hooks/
            └── useFeatureGate.ts
                • useFeatureGate() - Main hook
                • useHasFeature() - Single feature check
                • useCanUseFeature() - Single usage check
```

## 📋 File Details

### Documentation Files

#### `QUICK_START.md` ⭐
**Purpose**: Get up and running in 10 minutes
- Step-by-step setup
- Quick commands
- Test cards
- Troubleshooting

#### `PHASE_1_COMPLETE.md`
**Purpose**: Summary of what was implemented
- Complete feature list
- Usage examples
- Pricing tier reference
- Next steps

#### `SUBSCRIPTION_IMPLEMENTATION.md`
**Purpose**: Comprehensive documentation
- Detailed setup instructions
- Environment variable guide
- Stripe configuration
- Feature keys reference
- Code examples
- Troubleshooting

### Database Files

#### `supabase/migrations/001_subscription_schema.sql`
**What it does**:
- Creates 5 tables with proper indexes
- Seeds 8 pricing tiers (4 buyer + 4 supplier)
- Seeds all feature definitions
- Sets up foreign keys and constraints

**Tables created**:
1. `subscription_tiers` - Pricing tier definitions
2. `tier_features` - Features for each tier
3. `user_subscriptions` - User subscription state
4. `usage_tracking` - Monthly usage counters
5. `subscription_events` - Audit log

### Edge Function Files

#### `stripe-create-checkout/index.ts`
**What it does**:
- Creates Stripe checkout sessions
- Configures 14-day trials
- Handles customer creation
- Returns checkout URL

**Triggered by**: User clicking "Subscribe" button

#### `stripe-create-portal/index.ts`
**What it does**:
- Creates Customer Portal session
- Allows subscription management
- Returns portal URL

**Triggered by**: User clicking "Manage Billing"

#### `stripe-cancel-subscription/index.ts`
**What it does**:
- Cancels active subscription
- Supports immediate or end-of-period
- Logs cancellation event

**Triggered by**: User clicking "Cancel Subscription"

#### `stripe-webhook/index.ts`
**What it does**:
- Receives Stripe webhook events
- Updates database with subscription changes
- Handles trial conversions
- Manages payment failures
- Logs all events

**Triggered by**: Stripe (automatically)

### Type Files

#### `src/types/subscription.ts`
**What it contains**:
- `SubscriptionTier` - Tier definition
- `TierFeature` - Feature definition
- `UserSubscription` - User's subscription
- `UsageTracking` - Usage stats
- `SubscriptionEvent` - Event log
- API request/response types
- Feature key enums

### Service Files

#### `src/lib/features/feature-gate.ts`
**What it does**:
- Core FeatureGate class
- `hasFeature()` - Check boolean features
- `canUse()` - Check usage limits
- `getRemaining()` - Get remaining quota
- `getUsage()` - Get current usage
- `isTrialing()` - Check trial status
- `incrementUsage()` - Track usage

**Used by**: Hooks and components

#### `src/lib/stripe/config.ts`
**What it does**:
- Exports Stripe configuration
- Validates environment variables

**Used by**: All Stripe-related code

#### `src/lib/stripe/client.ts`
**What it does**:
- Client-side Stripe functions
- Checkout session creation
- Portal session creation
- Subscription management
- Data fetching

**Used by**: Components and pages

### Hook Files

#### `src/hooks/useFeatureGate.ts`
**What it provides**:
- `useFeatureGate()` - Main hook for all features
- `useHasFeature()` - Simplified single feature check
- `useCanUseFeature()` - Simplified single usage check

**Used by**: Any component that needs feature gating

## 🔑 Key Concepts

### FeatureGate Flow

```
User Action
    ↓
Component uses useFeatureGate()
    ↓
Hook creates FeatureGate.forUser()
    ↓
FeatureGate queries database
    ↓
Returns access status
    ↓
Component shows/hides features
```

### Checkout Flow

```
User clicks "Subscribe"
    ↓
redirectToCheckout() called
    ↓
Edge function creates session
    ↓
User redirects to Stripe
    ↓
User enters payment
    ↓
Stripe webhook triggered
    ↓
Database updated
    ↓
User redirects to success page
```

### Webhook Flow

```
Stripe event occurs
    ↓
Webhook endpoint receives event
    ↓
Signature verified
    ↓
Event processed
    ↓
Database updated
    ↓
Event logged
    ↓
200 response sent
```

## 🎯 Usage Patterns

### Component with Feature Gate

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';

function MyComponent() {
  const { user } = useAuth();
  const { hasFeature, canUse, getRemaining } = useFeatureGate(user?.id);

  return (
    <>
      {hasFeature('analytics_dashboard') && <Analytics />}
      {canUse('rfq_limit_monthly') && <CreateRFQ />}
      <p>Remaining: {getRemaining('rfq_limit_monthly')}</p>
    </>
  );
}
```

### Subscribe Button

```tsx
import { redirectToCheckout } from '@/lib/stripe/client';

function SubscribeButton({ tierId }) {
  const handleClick = () => redirectToCheckout({ tierId });
  return <button onClick={handleClick}>Subscribe</button>;
}
```

### Billing Management

```tsx
import { redirectToPortal } from '@/lib/stripe/client';

function ManageBilling() {
  return <button onClick={redirectToPortal}>Manage Billing</button>;
}
```

## 📊 Database Schema Summary

### subscription_tiers
Stores tier definitions (Starter, Growth, etc.)

### tier_features
Maps features to tiers (inventory_tracking, rfq_limit, etc.)

### user_subscriptions
Current subscription for each user

### usage_tracking
Monthly usage counters (RFQs created, suppliers saved, etc.)

### subscription_events
Audit log of all subscription changes

## 🔐 Security Notes

- Only `VITE_*` variables are exposed to client
- `STRIPE_SECRET_KEY` only in Edge Functions
- `STRIPE_WEBHOOK_SECRET` only in webhook function
- `SUPABASE_SERVICE_ROLE_KEY` only in Edge Functions
- All webhook events verified with signature
- All subscription checks happen server-side

## 📝 Environment Variables

### Client-side (VITE_ prefix)
```bash
VITE_STRIPE_PUBLISHABLE_KEY  # Public Stripe key
VITE_SUPABASE_URL            # Supabase project URL
VITE_SUPABASE_ANON_KEY       # Supabase public key
```

### Server-side (no VITE_ prefix)
```bash
STRIPE_SECRET_KEY            # Secret Stripe key
STRIPE_WEBHOOK_SECRET        # Webhook signing secret
SUPABASE_SERVICE_ROLE_KEY    # Supabase admin key
```

## ✅ Implementation Checklist

- [x] Database schema created
- [x] Types defined
- [x] FeatureGate service built
- [x] React hooks created
- [x] Stripe integration complete
- [x] Edge functions written
- [x] Documentation created
- [ ] Database migrated (you do this)
- [ ] Environment variables set (you do this)
- [ ] Stripe products created (you do this)
- [ ] Edge functions deployed (you do this)
- [ ] Webhook configured (you do this)

## 📚 Additional Resources

- [Stripe Billing Docs](https://stripe.com/docs/billing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Hooks Guide](https://react.dev/reference/react)

---

**Phase 1 Complete** ✅

Ready for Phase 2: Build the pricing page and UI components!
