# Subscription System Integration Guide

## Overview

This guide explains how the HoleScale subscription system is integrated into the marketing site with full user access to manage subscriptions, billing, and usage.

## What Was Added

### 1. Dynamic Pricing Page

**File**: `src/pages/Pricing.tsx`

The pricing page now fetches real subscription tiers from the database instead of showing hardcoded prices.

**Features**:
- ✅ Fetches tiers from `subscription_tiers` table
- ✅ Displays buyer and supplier tiers separately
- ✅ Shows 14-day trial badges
- ✅ Lists transaction fees and features from database
- ✅ Redirects authenticated users to Stripe checkout
- ✅ Shows waitlist dialog for non-authenticated users
- ✅ Loading states and error handling

**How It Works**:
```tsx
// Fetches tiers from database
const { data: tiers } = useQuery({
  queryKey: ['subscription-tiers'],
  queryFn: fetchSubscriptionTiers,
});

// Filters by user type
const buyerTiers = tiers?.filter(t => t.user_type === 'buyer') || [];
const supplierTiers = tiers?.filter(t => t.user_type === 'supplier') || [];

// Displays using SubscriptionPricingCard component
<SubscriptionPricingCard
  tier={tier}
  onSubscribe={() => handleSubscribe(tier.id)}
  billingCycle={billingCycle}
/>
```

### 2. Subscription Management Routes

**File**: `src/App.tsx`

Added routes for users to manage their subscriptions:

```tsx
// Subscription routes
<Route path="/checkout/success" element={<CheckoutSuccess />} />
<Route path="/settings/billing" element={<BillingSettings />} />
<Route path="/settings/usage" element={<UsageDashboard />} />

// Admin routes
<Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
<Route path="/admin/subscriptions/:id" element={<AdminSubscriptionDetail />} />
<Route path="/admin/revenue" element={<AdminRevenue />} />
```

**Routes Explained**:

| Route | Page | Purpose |
|-------|------|---------|
| `/checkout/success` | CheckoutSuccess | Post-checkout confirmation with trial info |
| `/settings/billing` | BillingSettings | Manage subscription, payment methods, invoices |
| `/settings/usage` | UsageDashboard | View usage metrics and limits |
| `/admin/subscriptions` | AdminSubscriptions | Admin: View all subscriptions |
| `/admin/subscriptions/:id` | AdminSubscriptionDetail | Admin: Manage single subscription |
| `/admin/revenue` | AdminRevenue | Admin: Revenue analytics and metrics |

### 3. User Account Menu

**File**: `src/components/ui/UserAccountMenu.tsx`

A dropdown menu for authenticated users showing subscription management options.

**Features**:
- ✅ User avatar with initials
- ✅ Email and role display
- ✅ Quick links to dashboard
- ✅ Billing & Subscription link
- ✅ Usage & Limits link
- ✅ Admin-only menu items
- ✅ Account settings link
- ✅ Sign out button
- ✅ Keyboard navigation (Escape to close)
- ✅ Click-outside to close

**Menu Items**:

**For All Users**:
- Dashboard - Go to main app dashboard
- Billing & Subscription - Manage plan and payment
- Usage & Limits - View usage metrics
- Account Settings - User profile settings
- Sign Out - Log out

**Admin Only**:
- Manage Subscriptions - Admin subscription list
- Revenue Dashboard - MRR and analytics

### 4. Navigation Integration

**File**: `src/components/marketing/Navigation.tsx`

Updated the navigation to show the UserAccountMenu for logged-in users.

**Changes**:
- **Desktop**: Shows `UserAccountMenu` dropdown instead of "Go to Dashboard" button
- **Mobile**: Shows expanded menu with links to billing and usage pages

### 5. Enhanced Auth Hook

**File**: `src/hooks/useAuth.tsx`

Updated from stub to full Supabase authentication integration.

**Features**:
- ✅ Supabase auth integration
- ✅ Session management
- ✅ Role detection (admin, buyer, supplier)
- ✅ `signOut()` method
- ✅ Loading and session checked states

**How It Works**:
```tsx
const { user, hasRole, signOut } = useAuth();

// Check if user is authenticated
if (user) {
  // User is logged in
}

// Check user role
if (hasRole('admin')) {
  // Show admin menu items
}

// Sign out
await signOut();
```

## User Flows

### Flow 1: Browse Pricing → Subscribe (Not Logged In)

1. User visits `/pricing`
2. Sees database-fetched pricing tiers with 14-day trial badges
3. Clicks "Subscribe" button
4. Sees waitlist dialog (since not logged in)
5. OR redirected to login/signup

### Flow 2: Browse Pricing → Subscribe (Logged In)

1. User visits `/pricing` (already logged in)
2. Sees pricing tiers
3. Clicks "Subscribe" button
4. Redirected to Stripe checkout with trial
5. Completes payment
6. Redirected to `/checkout/success`
7. Sees confirmation with trial end date

### Flow 3: Manage Subscription

1. User clicks their avatar in navigation
2. Dropdown menu appears
3. Clicks "Billing & Subscription"
4. Goes to `/settings/billing`
5. Can:
   - View current plan
   - Change plan (upgrade/downgrade)
   - Update payment method
   - View invoices
   - Cancel subscription
   - Access Stripe Customer Portal

### Flow 4: Check Usage

1. User clicks avatar in navigation
2. Clicks "Usage & Limits"
3. Goes to `/settings/usage`
4. Sees:
   - Current usage vs limits
   - RFQs remaining
   - Features available
   - Upgrade prompts if near limits

### Flow 5: Admin Management

1. Admin user clicks avatar
2. Sees admin-only menu items
3. Clicks "Manage Subscriptions"
4. Goes to `/admin/subscriptions`
5. Can:
   - Filter and search subscriptions
   - View MRR metrics
   - Export to CSV
   - Click a subscription for details
   - Extend trials
   - View revenue analytics

## Components Reference

### SubscriptionPricingCard

Displays a single subscription tier with features and pricing.

**Props**:
```tsx
interface SubscriptionPricingCardProps {
  tier: SubscriptionTier;
  onSubscribe: () => void;
  highlighted?: boolean;
  currentTier?: boolean;
  billingCycle?: 'monthly' | 'yearly';
}
```

**Features**:
- Shows tier name, price, and description
- Displays transaction fee percentage
- Lists features from database
- Shows 14-day trial badge for paid tiers
- "Subscribe" or "Current Plan" button
- Highlighted option for recommended tier

### UserAccountMenu

User account dropdown menu.

**Usage**:
```tsx
import { UserAccountMenu } from '@/components/ui/UserAccountMenu';

// In navigation
{user ? <UserAccountMenu /> : <LoginButton />}
```

**Features**:
- Avatar with user initials
- Email and role display
- Menu items based on role
- Sign out functionality

## Database Schema Requirements

The pricing page queries the following tables:

### subscription_tiers
```sql
SELECT *
FROM subscription_tiers
ORDER BY sort_order ASC;
```

**Required Columns**:
- `id` - Tier UUID
- `user_type` - 'buyer' or 'supplier'
- `display_name` - Tier name (e.g., "Growth")
- `price_monthly` - Monthly price in cents
- `price_yearly` - Yearly price in cents (optional)
- `transaction_fee_percent` - Fee percentage (e.g., 3.0)
- `trial_days` - Trial length (e.g., 14)
- `description` - Short description
- `sort_order` - Display order

### tier_features
Features are fetched for each tier to display in the pricing card.

## Authentication Flow

### Login Required Pages

The following pages require authentication:
- `/settings/billing`
- `/settings/usage`
- `/admin/subscriptions`
- `/admin/subscriptions/:id`
- `/admin/revenue`

### Role-Based Access

**Admin Routes** (`/admin/*`):
- Requires `hasRole('admin')` to be true
- Shows admin menu items in UserAccountMenu

**Regular User Routes** (`/settings/*`):
- Requires any authenticated user
- Shows billing and usage management

## Stripe Integration

### Checkout Flow

1. User clicks "Subscribe" on pricing card
2. Calls `redirectToCheckout({ tierId, billingCycle })`
3. Creates Stripe checkout session via Edge Function
4. Redirects to Stripe hosted checkout
5. After payment, redirects to `/checkout/success`

### Customer Portal

Users can access Stripe Customer Portal from `/settings/billing`:
- Update payment methods
- View invoices
- Download receipts
- Cancel subscription

## Environment Variables

**Required**:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Edge Functions** (server-side):
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing Checklist

### Pricing Page

- [ ] Pricing page loads tiers from database
- [ ] Buyer tiers display correctly
- [ ] Supplier tiers display correctly
- [ ] Trial badges show on paid tiers
- [ ] Transaction fees display
- [ ] Subscribe button works for authenticated users
- [ ] Waitlist dialog shows for non-authenticated users
- [ ] Loading state displays while fetching
- [ ] Error handling works if database fails

### Navigation

- [ ] User avatar appears when logged in
- [ ] UserAccountMenu opens on click
- [ ] Menu shows correct email and role
- [ ] Billing link goes to `/settings/billing`
- [ ] Usage link goes to `/settings/usage`
- [ ] Admin items only show for admins
- [ ] Sign out button works
- [ ] Menu closes on click outside
- [ ] Menu closes on Escape key
- [ ] Mobile menu shows subscription links

### Routes

- [ ] `/checkout/success` loads CheckoutSuccess page
- [ ] `/settings/billing` loads BillingSettings page
- [ ] `/settings/usage` loads UsageDashboard page
- [ ] `/admin/subscriptions` loads AdminSubscriptions
- [ ] `/admin/subscriptions/:id` loads AdminSubscriptionDetail
- [ ] `/admin/revenue` loads AdminRevenue

### Authentication

- [ ] useAuth hook returns user when logged in
- [ ] hasRole correctly identifies admin
- [ ] hasRole correctly identifies buyer/supplier
- [ ] signOut logs out user
- [ ] Session persists on page reload

## Troubleshooting

### Pricing Page Shows "No tiers available"

**Cause**: Database migration not run or seed data missing

**Fix**:
```bash
cd supabase
supabase migration up
```

### User Avatar Not Showing

**Cause**: Supabase credentials not configured

**Fix**: Check `.env` file has correct Supabase URL and anon key

### "Supabase not initialized" Error

**Cause**: Missing environment variables

**Fix**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Subscribe Button Does Nothing

**Cause**: Stripe Edge Functions not deployed

**Fix**: Deploy Edge Functions:
```bash
supabase functions deploy stripe-create-checkout
```

### Admin Menu Items Not Showing

**Cause**: User not in `admin_users` table

**Fix**: Add user to admin_users:
```sql
INSERT INTO admin_users (user_id) VALUES ('user-uuid-here');
```

## Next Steps

1. **Deploy Edge Functions**: Deploy all 4 Stripe Edge Functions to Supabase
2. **Configure Stripe**: Set up products and prices in Stripe dashboard
3. **Test Checkout**: Use Stripe test cards to verify checkout flow
4. **Add RLS Policies**: Ensure proper Row Level Security on all tables
5. **Test Admin Access**: Verify admin users can access admin pages
6. **Monitor Usage**: Check that usage tracking works correctly

## Support

For issues or questions:
- See `QUICK_START.md` for setup instructions
- See `SUBSCRIPTION_IMPLEMENTATION.md` for complete technical docs
- See `PHASES_2_3_USAGE_GUIDE.md` for component usage
- See `PHASE_5_COMPLETE.md` for admin panel docs

---

**Integration Status**: ✅ **COMPLETE**

All subscription management features are now accessible to users through the navigation menu and dedicated pages.
