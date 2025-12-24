-- =====================================================
-- VERIFICATION QUERIES
-- Run these after applying COMPREHENSIVE_TIER_UPDATE.sql
-- =====================================================

-- ============================================================================
-- CHECK 1: Verify exactly 4 active tiers per user type
-- ============================================================================
SELECT
  '=== TIER COUNT CHECK ===' as check_name,
  user_type,
  COUNT(*) as active_tier_count,
  CASE
    WHEN COUNT(*) = 4 THEN '✓ PASS'
    ELSE '✗ FAIL - Should have exactly 4 tiers'
  END as status
FROM subscription_tiers
WHERE is_active = true
GROUP BY user_type
ORDER BY user_type;

-- ============================================================================
-- CHECK 2: Verify tier names are correct (free, starter, professional, enterprise)
-- ============================================================================
SELECT
  '=== TIER NAMES CHECK ===' as check_name,
  user_type,
  array_agg(tier_name ORDER BY monthly_price) as tier_names,
  CASE
    WHEN array_agg(tier_name ORDER BY monthly_price) = ARRAY['free', 'starter', 'professional', 'enterprise'] THEN '✓ PASS'
    ELSE '✗ FAIL - Should have free, starter, professional, enterprise'
  END as status
FROM subscription_tiers
WHERE is_active = true
GROUP BY user_type
ORDER BY user_type;

-- ============================================================================
-- CHECK 3: Verify pricing matches specification
-- ============================================================================

-- Supplier Pricing
SELECT
  '=== SUPPLIER PRICING CHECK ===' as check_name,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  CASE
    WHEN tier_name = 'free' AND monthly_price = 0 AND service_fee_rate = 4.5 THEN '✓ PASS'
    WHEN tier_name = 'starter' AND monthly_price = 49 AND service_fee_rate = 4.0 THEN '✓ PASS'
    WHEN tier_name = 'professional' AND monthly_price = 99 AND service_fee_rate = 3.5 THEN '✓ PASS'
    WHEN tier_name = 'enterprise' AND monthly_price = 249 AND service_fee_rate = 2.5 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as status
FROM subscription_tiers
WHERE user_type = 'supplier' AND is_active = true
ORDER BY monthly_price;

-- Buyer Pricing
SELECT
  '=== BUYER PRICING CHECK ===' as check_name,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  CASE
    WHEN tier_name = 'free' AND monthly_price = 0 AND service_fee_rate = 3.5 THEN '✓ PASS'
    WHEN tier_name = 'starter' AND monthly_price = 49 AND service_fee_rate = 2.5 THEN '✓ PASS'
    WHEN tier_name = 'professional' AND monthly_price = 99 AND service_fee_rate = 0.0 THEN '✓ PASS'
    WHEN tier_name = 'enterprise' AND monthly_price = 249 AND service_fee_rate = 0.0 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as status
FROM subscription_tiers
WHERE user_type = 'buyer' AND is_active = true
ORDER BY monthly_price;

-- ============================================================================
-- CHECK 4: Verify each tier has features assigned
-- ============================================================================
SELECT
  '=== FEATURES CHECK ===' as check_name,
  user_type,
  tier_name,
  array_length(features, 1) as feature_count,
  CASE
    WHEN array_length(features, 1) >= 5 THEN '✓ PASS'
    WHEN array_length(features, 1) IS NULL THEN '✗ FAIL - No features'
    ELSE '✗ FAIL - Too few features'
  END as status
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;

-- ============================================================================
-- CHECK 5: Show all features for manual verification
-- ============================================================================
SELECT
  '=== BUYER FEATURES ===' as section,
  tier_name,
  monthly_price,
  unnest(features) as feature
FROM subscription_tiers
WHERE user_type = 'buyer' AND is_active = true
ORDER BY monthly_price, feature;

SELECT
  '=== SUPPLIER FEATURES ===' as section,
  tier_name,
  monthly_price,
  unnest(features) as feature
FROM subscription_tiers
WHERE user_type = 'supplier' AND is_active = true
ORDER BY monthly_price, feature;

-- ============================================================================
-- CHECK 6: Verify no duplicate active tiers
-- ============================================================================
SELECT
  '=== DUPLICATE CHECK ===' as check_name,
  user_type,
  tier_name,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 1 THEN '✓ PASS'
    ELSE '✗ FAIL - Duplicate tiers found'
  END as status
FROM subscription_tiers
WHERE is_active = true
GROUP BY user_type, tier_name
HAVING COUNT(*) > 1;

-- If no rows returned, duplicates check passes
SELECT
  CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM subscription_tiers
      WHERE is_active = true
      GROUP BY user_type, tier_name
      HAVING COUNT(*) > 1
    ) THEN '✓ PASS - No duplicates found'
    ELSE '✗ FAIL - Duplicates exist'
  END as duplicate_check_status;

-- ============================================================================
-- CHECK 7: Summary Report
-- ============================================================================
SELECT
  '=== SUMMARY REPORT ===' as report_section,
  user_type,
  tier_name,
  '$' || monthly_price::text || '/mo' as pricing,
  service_fee_rate || '%' as fee_rate,
  array_length(features, 1) || ' features' as feature_count,
  is_active
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;

-- ============================================================================
-- CHECK 8: Verify old tiers are deactivated (not deleted)
-- ============================================================================
SELECT
  '=== INACTIVE TIERS ===' as section,
  user_type,
  tier_name,
  is_active,
  'Preserved for existing subscriptions' as note
FROM subscription_tiers
WHERE is_active = false
ORDER BY user_type, tier_name;
