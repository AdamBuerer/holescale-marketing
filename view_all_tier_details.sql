-- =====================================================
-- View All Tier Details with Features
-- Shows pricing and features for all active tiers
-- =====================================================

-- Buyer Tiers
SELECT
  '=== BUYER TIERS ===' as section,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  features,
  is_active
FROM subscription_tiers
WHERE user_type = 'buyer' AND is_active = true
ORDER BY monthly_price;

-- Supplier Tiers
SELECT
  '=== SUPPLIER TIERS ===' as section,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  features,
  is_active
FROM subscription_tiers
WHERE user_type = 'supplier' AND is_active = true
ORDER BY monthly_price;
