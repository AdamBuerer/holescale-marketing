-- =====================================================
-- Consolidate Supplier Pricing to 4 Optimal Tiers
-- Reduces choice overload and creates clear value ladder
-- =====================================================

-- First, check what we currently have
SELECT
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  is_active
FROM subscription_tiers
WHERE user_type = 'supplier'
ORDER BY monthly_price;

-- Deactivate any extra tiers (keep only 4: free, growth, professional, enterprise)
-- This will hide them from the pricing page but preserve data
UPDATE subscription_tiers
SET is_active = false
WHERE user_type = 'supplier'
  AND tier_name NOT IN ('free', 'lite', 'growth', 'professional', 'enterprise');

-- Ensure we have clean pricing progression for the 4 core tiers
-- Free/Lite: $0
-- Growth: $49
-- Professional: $99
-- Enterprise: $249

-- Update Growth tier
UPDATE subscription_tiers
SET
  monthly_price = 49.00,
  annual_price = 470.00,  -- ~20% discount
  service_fee_rate = 4.0,
  is_active = true
WHERE user_type = 'supplier'
  AND tier_name IN ('growth', 'starter', 'supplier_growth');

-- Update Professional tier
UPDATE subscription_tiers
SET
  monthly_price = 99.00,
  annual_price = 950.00,  -- ~20% discount
  service_fee_rate = 3.5,
  is_active = true
WHERE user_type = 'supplier'
  AND tier_name IN ('professional', 'supplier_professional');

-- Update Enterprise tier
UPDATE subscription_tiers
SET
  monthly_price = 249.00,
  annual_price = 2390.00,  -- ~20% discount
  service_fee_rate = 2.5,
  is_active = true
WHERE user_type = 'supplier'
  AND tier_name IN ('enterprise', 'supplier_enterprise');

-- Ensure Free/Lite tier is active
UPDATE subscription_tiers
SET
  is_active = true
WHERE user_type = 'supplier'
  AND tier_name IN ('free', 'lite', 'supplier_lite');

-- Verify the final result (should show exactly 4 active tiers)
SELECT
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  is_active
FROM subscription_tiers
WHERE user_type = 'supplier'
  AND is_active = true
ORDER BY monthly_price;

-- Expected result:
-- lite/free: $0, 4.5% fee
-- growth: $49, 4.0% fee
-- professional: $99, 3.5% fee
-- enterprise: $249, 2.5% fee
