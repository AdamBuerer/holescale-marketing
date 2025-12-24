# Phases 2 & 3 Usage Guide

## Overview

Phases 2 and 3 are complete! You now have a full set of UI components for subscription management, feature gating, and usage tracking.

## What Was Built

### Phase 2: Checkout & Pricing UI
- ✅ Subscription pricing card component
- ✅ Checkout success page
- ✅ Trial banners and indicators

### Phase 3: Feature Gating & Usage Tracking
- ✅ FeatureGate React component
- ✅ Upgrade prompt modal
- ✅ Usage indicator components
- ✅ Billing settings page
- ✅ Usage dashboard page

## Components Reference

### 1. SubscriptionPricingCard

Display pricing tiers with subscription capabilities.

```tsx
import { SubscriptionPricingCard } from '@/components/subscription/SubscriptionPricingCard';
import { redirectToCheckout } from '@/lib/stripe/client';

function PricingPage() {
  const handleSubscribe = async (tierId: string) => {
    await redirectToCheckout({
      tierId,
      billingCycle: 'monthly',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {tiers.map((tier) => (
        <SubscriptionPricingCard
          key={tier.id}
          tier={tier}
          onSubscribe={handleSubscribe}
          highlighted={tier.sort_order === 2}
          currentTier={subscription?.tier_id === tier.id}
        />
      ))}
    </div>
  );
}
```

### 2. FeatureGate Component

Declaratively gate features based on subscription.

```tsx
import { FeatureGate, RequiresFeature, RequiresUsage, RequiresTier } from '@/components/subscription/FeatureGate';

// Gate by boolean feature
<FeatureGate userId={user.id} feature="inventory_tracking">
  <InventoryDashboard />
</FeatureGate>

// Gate by usage limit
<FeatureGate userId={user.id} usageKey="rfq_limit_monthly">
  <CreateRFQButton />
</FeatureGate>

// Gate by tier level
<FeatureGate userId={user.id} minTier={3}>
  <AdvancedAnalytics />
</FeatureGate>

// Custom fallback
<FeatureGate
  userId={user.id}
  feature="api_access"
  showUpgrade={false}
  fallback={<ComingSoonBanner />}
>
  <APISettings />
</FeatureGate>

// Simplified versions
<RequiresFeature userId={user.id} featureKey="erp_integration">
  <ERPSettings />
</RequiresFeature>

<RequiresUsage userId={user.id} usageKey="rfq_limit_monthly">
  <CreateRFQButton />
</RequiresUsage>

<RequiresTier userId={user.id} minTier={4}>
  <EnterpriseFeatures />
</RequiresTier>
```

### 3. Upgrade Prompts

Show upgrade prompts inline or in modals.

```tsx
import { UpgradePrompt, UpgradeModal, UpgradeButton } from '@/components/subscription/UpgradePrompt';

// Inline banner
<UpgradePrompt
  feature="inventory_tracking"
  message="Upgrade to track unlimited inventory SKUs"
/>

// Modal with tier comparison
<UpgradeModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  feature="analytics_dashboard"
  userId={user.id}
/>

// Button that opens modal
<UpgradeButton userId={user.id}>
  Upgrade Plan
</UpgradeButton>
```

### 4. Usage Indicators

Display usage limits and progress.

```tsx
import {
  UsageProgressBar,
  UsageBadge,
  UsageCard,
  UsageAlert,
  UsageText,
} from '@/components/subscription/UsageIndicator';

// Progress bar
<UsageProgressBar
  userId={user.id}
  featureKey="rfq_limit_monthly"
  label="RFQs This Month"
  showDetails
  warnAt={80}
/>

// Badge
<UsageBadge
  userId={user.id}
  featureKey="saved_suppliers_limit"
  label="suppliers"
/>

// Card (for dashboards)
<UsageCard
  userId={user.id}
  featureKey="inventory_sku_limit"
  label="Inventory SKUs"
/>

// Alert (shows only when nearing limit)
<UsageAlert
  userId={user.id}
  featureKey="rfq_limit_monthly"
  warnAt={80}
/>

// Simple text
<UsageText
  userId={user.id}
  featureKey="team_seats"
/>
```

### 5. Trial Banners

Show trial status to users.

```tsx
import { TrialBanner, TrialBadge, TrialStatusCard } from '@/components/subscription/TrialBanner';

// Full banner (top of page)
<TrialBanner
  userId={user.id}
  dismissible
  onUpgrade={() => navigate('/pricing')}
/>

// Compact badge (for navigation)
<TrialBadge userId={user.id} />

// Status card (for settings)
<TrialStatusCard userId={user.id} />
```

### 6. Complete Pages

Ready-to-use pages for common flows.

```tsx
// Checkout success
import CheckoutSuccess from '@/pages/CheckoutSuccess';

// Billing settings
import BillingSettings from '@/pages/BillingSettings';

// Usage dashboard
import UsageDashboard from '@/pages/UsageDashboard';
```

## Common Patterns

### Pattern 1: Feature-Gated Component

```tsx
import { RequiresFeature } from '@/components/subscription/FeatureGate';
import { useAuth } from '@/hooks/useAuth';

function InventoryPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Inventory</h1>

      <RequiresFeature
        userId={user?.id}
        featureKey="inventory_tracking"
      >
        <InventoryTable />
        <AddInventoryButton />
      </RequiresFeature>
    </div>
  );
}
```

### Pattern 2: Usage-Limited Action

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { useAuth } from '@/hooks/useAuth';

function CreateRFQButton() {
  const { user } = useAuth();
  const { canUse, getRemaining, incrementUsage } = useFeatureGate(user?.id);

  const handleCreate = async () => {
    // Check if user can create RFQ
    if (!canUse('rfq_limit_monthly')) {
      // Show upgrade prompt
      return;
    }

    // Create the RFQ
    await createRFQ();

    // Increment usage
    await incrementUsage('rfq_limit_monthly');
  };

  return (
    <div>
      <Button onClick={handleCreate} disabled={!canUse('rfq_limit_monthly')}>
        Create RFQ
      </Button>
      <p className="text-sm text-muted-foreground">
        {getRemaining('rfq_limit_monthly')} remaining this month
      </p>
    </div>
  );
}
```

### Pattern 3: Dashboard with Usage

```tsx
import { useAuth } from '@/hooks/useAuth';
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { UsageProgressBar } from '@/components/subscription/UsageIndicator';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <TrialBanner userId={user?.id} dismissible />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <UsageProgressBar
          userId={user?.id}
          featureKey="rfq_limit_monthly"
          label="RFQs This Month"
        />
        <UsageProgressBar
          userId={user?.id}
          featureKey="saved_suppliers_limit"
          label="Saved Suppliers"
        />
      </div>

      <YourContent />
    </div>
  );
}
```

### Pattern 4: Settings Page with Billing

```tsx
import { useAuth } from '@/hooks/useAuth';
import { redirectToPortal } from '@/lib/stripe/client';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UpgradeButton } from '@/components/subscription/UpgradePrompt';

function Settings() {
  const { user } = useAuth();
  const { subscription, isTrialing } = useFeatureGate(user?.id);

  return (
    <div>
      <h1>Settings</h1>

      <section>
        <h2>Subscription</h2>
        <p>Current plan: {subscription?.tier.display_name}</p>

        {subscription?.tier.is_free ? (
          <UpgradeButton userId={user?.id}>
            Upgrade Plan
          </UpgradeButton>
        ) : (
          <Button onClick={() => redirectToPortal()}>
            Manage Billing
          </Button>
        )}
      </section>
    </div>
  );
}
```

## Adding Routes

Add these routes to your App.tsx:

```tsx
import CheckoutSuccess from './pages/CheckoutSuccess';
import BillingSettings from './pages/BillingSettings';
import UsageDashboard from './pages/UsageDashboard';

// In your Routes:
<Route path="/checkout/success" element={<CheckoutSuccess />} />
<Route path="/settings/billing" element={<BillingSettings />} />
<Route path="/settings/usage" element={<UsageDashboard />} />
```

## Hook Usage

The `useFeatureGate` hook provides all subscription data:

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';

function MyComponent() {
  const { user } = useAuth();
  const {
    loading,
    error,
    hasFeature,
    canUse,
    getRemaining,
    getUsage,
    getLimit,
    isTrialing,
    trialDaysRemaining,
    tierLevel,
    isActive,
    subscription,
    transactionFeePercent,
    willCancelAtPeriodEnd,
    nextBillingDate,
    incrementUsage,
    refresh,
  } = useFeatureGate(user?.id);

  // Check boolean feature
  if (hasFeature('inventory_tracking')) {
    // Show inventory
  }

  // Check usage limit
  if (canUse('rfq_limit_monthly')) {
    // Allow RFQ creation
  }

  // Get remaining quota
  const remaining = getRemaining('rfq_limit_monthly');

  // Show trial info
  if (isTrialing) {
    console.log(`Trial ends in ${trialDaysRemaining} days`);
  }

  // Get transaction fee
  console.log(`Transaction fee: ${transactionFeePercent}%`);
}
```

## Styling

All components use shadcn/ui components and Tailwind CSS. They automatically match your theme and can be customized:

```tsx
// Custom styling
<UpgradePrompt
  className="my-custom-class"
  feature="api_access"
/>

// Custom loading state
<FeatureGate
  userId={user?.id}
  feature="analytics"
  loading={<MyCustomLoader />}
>
  <Analytics />
</FeatureGate>

// Custom upgrade message
<FeatureGate
  userId={user?.id}
  usageKey="rfq_limit_monthly"
  upgradeMessage="Unlock unlimited RFQs with our Growth plan!"
>
  <CreateRFQButton />
</FeatureGate>
```

## Server-Side Usage Tracking

When a user performs an action, increment their usage:

```tsx
// Client-side (using hook)
const { incrementUsage } = useFeatureGate(user?.id);
await incrementUsage('rfq_limit_monthly');

// Server-side (using FeatureGate class)
import { FeatureGate } from '@/lib/features/feature-gate';

const gate = await FeatureGate.forUser(userId);
if (gate.canUse('rfq_limit_monthly')) {
  // Allow action
  await gate.incrementUsage('rfq_limit_monthly');
} else {
  // Deny action
  throw new Error('Usage limit reached');
}
```

## Testing

### Test Scenarios

1. **Free tier user tries premium feature**
   - Should show upgrade prompt
   - Should not allow access

2. **User hits usage limit**
   - Progress bar shows 100%
   - "Create" button disabled
   - Alert shown
   - Upgrade prompt displayed

3. **Trial user**
   - Trial banner shows days remaining
   - Full feature access
   - Warning on last 3 days

4. **Upgrading**
   - Redirects to Stripe Checkout
   - 14-day trial starts
   - Features unlock immediately

5. **Canceling**
   - Shows confirmation dialog
   - Subscription active until period end
   - Clear messaging about what happens

## Best Practices

### 1. Always check server-side
Never rely on client-side checks alone. Always verify on the server.

### 2. Show usage early
Display usage indicators before users hit limits.

### 3. Clear upgrade paths
When blocking a feature, always show how to upgrade.

### 4. Trial reminders
Show trial banners prominently, especially in last 3 days.

### 5. Graceful degradation
If feature gate fails to load, fail open (allow access) with logging.

### 6. Usage tracking
Increment usage right after successful action, not before.

### 7. Caching
The `useFeatureGate` hook caches data. Call `refresh()` after changes.

## Troubleshooting

### Component not showing
- Check if user ID is defined
- Verify subscription exists in database
- Check browser console for errors

### Usage not updating
- Call `refresh()` after incrementing usage
- Check server-side increment succeeded
- Verify period dates are correct

### Feature gate always denying
- Check feature key spelling
- Verify tier has feature in database
- Check user's subscription tier

### Trial banner not showing
- Verify user status is 'trialing'
- Check trial_end date is in future
- Ensure subscription is active

## Next Steps

You now have all the UI components for subscription management!

To go live:
1. Deploy Supabase Edge Functions
2. Configure Stripe products
3. Set up webhook
4. Test with Stripe test cards
5. Add routes to your app
6. Integrate components into your pages

See `SUBSCRIPTION_IMPLEMENTATION.md` for deployment instructions.

---

**Phases 2 & 3 Complete** ✅

Need Phase 5 (Admin Panel)? Let me know!
