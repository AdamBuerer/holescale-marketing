-- =====================================================
-- Consolidate Buyer Pricing to 4 Optimal Tiers
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
WHERE user_type = 'buyer'
ORDER BY monthly_price;

-- Deactivate any extra tiers beyond the core 4
UPDATE subscription_tiers
SET is_active = false
WHERE user_type = 'buyer'
  AND tier_name NOT IN ('free', 'business', 'professional', 'enterprise');

-- Ensure clean pricing progression for 4 core buyer tiers
-- Free: $0
-- Business: $99
-- Professional: $149
-- Enterprise: $299

-- Update Free tier
UPDATE subscription_tiers
SET
  is_active = true
WHERE user_type = 'buyer'
  AND tier_name IN ('free', 'buyer_free', 'buyer_starter');

-- Update Business tier
UPDATE subscription_tiers
SET
  monthly_price = 99.00,
  annual_price = 950.00,  -- ~20% discount
  is_active = true
WHERE user_type = 'buyer'
  AND tier_name IN ('business', 'buyer_business', 'buyer_growth');

-- Update Professional tier (already fixed to $149)
UPDATE subscription_tiers
SET
  monthly_price = 149.00,
  annual_price = 1428.00,  -- ~20% discount
  is_active = true
WHERE user_type = 'buyer'
  AND tier_name IN ('professional', 'buyer_professional');

-- Update Enterprise tier
UPDATE subscription_tiers
SET
  monthly_price = 299.00,
  annual_price = 2870.00,  -- ~20% discount
  is_active = true
WHERE user_type = 'buyer'
  AND tier_name IN ('enterprise', 'buyer_enterprise');

-- Verify the final result (should show exactly 4 active tiers)
SELECT
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  is_active
FROM subscription_tiers
WHERE user_type = 'buyer'
  AND is_active = true
ORDER BY monthly_price;

-- Expected result:
-- free: $0
-- business: $99
-- professional: $149
-- enterprise: $299
