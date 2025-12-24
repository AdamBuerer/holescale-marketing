-- =====================================================
-- Seed Subscription Tiers
-- Run this if subscription_tiers table is empty
-- =====================================================

-- Insert Buyer Tiers
INSERT INTO subscription_tiers (
  id,
  user_type,
  tier_name,
  display_name,
  description,
  price_monthly,
  price_yearly,
  transaction_fee_percent,
  trial_days,
  sort_order
) VALUES
-- Buyer: Starter (Free)
(
  gen_random_uuid(),
  'buyer',
  'buyer_starter',
  'Starter',
  'Perfect for getting started',
  0,
  0,
  3.0,
  0,
  1
),
-- Buyer: Growth
(
  gen_random_uuid(),
  'buyer',
  'buyer_growth',
  'Growth',
  'For growing teams',
  1900,
  19000,
  3.0,
  14,
  2
),
-- Buyer: Professional
(
  gen_random_uuid(),
  'buyer',
  'buyer_professional',
  'Professional',
  'Advanced features',
  4900,
  49000,
  2.5,
  14,
  3
),
-- Buyer: Enterprise
(
  gen_random_uuid(),
  'buyer',
  'buyer_enterprise',
  'Enterprise',
  'For large organizations',
  14900,
  149000,
  2.0,
  14,
  4
),
-- Supplier: Lite (Free)
(
  gen_random_uuid(),
  'supplier',
  'supplier_lite',
  'Lite',
  'Perfect for testing',
  0,
  0,
  4.5,
  0,
  1
),
-- Supplier: Growth
(
  gen_random_uuid(),
  'supplier',
  'supplier_growth',
  'Growth',
  'For growing suppliers',
  4900,
  49000,
  4.0,
  14,
  2
),
-- Supplier: Professional
(
  gen_random_uuid(),
  'supplier',
  'supplier_professional',
  'Professional',
  'Advanced features',
  9900,
  99000,
  3.5,
  14,
  3
),
-- Supplier: Enterprise
(
  gen_random_uuid(),
  'supplier',
  'supplier_enterprise',
  'Enterprise',
  'For high-volume suppliers',
  24900,
  249000,
  2.5,
  14,
  4
)
ON CONFLICT (tier_name) DO NOTHING;

-- Verify tiers were inserted
SELECT
  user_type,
  display_name,
  price_monthly / 100.0 as price_monthly_dollars,
  transaction_fee_percent,
  sort_order
FROM subscription_tiers
ORDER BY user_type, sort_order;
