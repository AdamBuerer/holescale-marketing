-- =====================================================
-- Fix Buyer Pricing Tiers
-- Both Professional and Business are currently $99/month
-- This fixes the pricing to be logical
-- =====================================================

-- First, let's see the current state
SELECT
  tier_name,
  user_type,
  monthly_price,
  annual_price,
  is_active
FROM subscription_tiers
WHERE user_type = 'buyer'
ORDER BY monthly_price;

-- Recommended pricing structure for buyers:
-- Free: $0
-- Starter: $29 (currently inactive)
-- Business: $99
-- Professional: $149 (UPDATE THIS from $99 to $149)
-- Enterprise: $299

-- Fix Professional tier pricing (should be higher than Business)
UPDATE subscription_tiers
SET
  monthly_price = 149.00,
  annual_price = 1428.00  -- $149 * 12 = $1,788, with discount = ~$1,428
WHERE user_type = 'buyer'
  AND tier_name = 'professional';

-- Verify the fix
SELECT
  tier_name,
  user_type,
  monthly_price,
  annual_price,
  is_active
FROM subscription_tiers
WHERE user_type = 'buyer'
ORDER BY monthly_price;

-- Expected result after fix:
-- free: $0
-- starter: $29 (inactive)
-- business: $99
-- professional: $149 (FIXED)
-- enterprise: $299
