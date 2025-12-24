-- =====================================================
-- UPDATE PRICING STRUCTURE - 2025-01-XX
-- Run this script to update the database with new pricing
-- =====================================================

-- First, let's check the current structure
SELECT 
  'Current Tiers' as info,
  tier_name,
  user_type,
  monthly_price,
  annual_price,
  service_fee_rate,
  is_active
FROM subscription_tiers
ORDER BY user_type, monthly_price;

-- ============================================================================
-- PART 1: Deactivate all existing tiers (preserves data)
-- ============================================================================
UPDATE subscription_tiers SET is_active = false WHERE user_type IN ('buyer', 'supplier');

-- ============================================================================
-- PART 2: BUYER TIERS - New 4-tier structure
-- ============================================================================

-- Buyer: Starter (Free) - $0/month, 3% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'starter' AND user_type = 'buyer';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'starter',
  'buyer',
  0.00,
  0.00,
  3.0,
  true,
  to_jsonb(ARRAY[
    '3_rfqs_per_month',
    '5_saved_suppliers',
    'basic_messaging',
    'view_quotes',
    'transaction_fee_3_percent',
    'email_support'
  ])
);

-- Buyer: Growth - $19/month, 3% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'growth' AND user_type = 'buyer';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'growth',
  'buyer',
  19.00,
  182.40, -- $19 * 12 * 0.8 (20% annual discount)
  3.0,
  true,
  to_jsonb(ARRAY[
    'unlimited_rfqs',
    '25_saved_suppliers',
    'order_history',
    'basic_inventory_50_skus',
    'reorder_reminders',
    'quote_comparison_tools',
    'transaction_fee_3_percent',
    'priority_email_support_24hr'
  ])
);

-- Buyer: Professional - $49/month, 2.5% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'professional' AND user_type = 'buyer';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'professional',
  'buyer',
  49.00,
  470.40, -- $49 * 12 * 0.8 (20% annual discount)
  2.5,
  true,
  to_jsonb(ARRAY[
    'advanced_analytics_dashboard',
    'unlimited_inventory',
    'unlimited_suppliers',
    '3_team_seats',
    'approval_workflows',
    'bulk_rfq_templates',
    'priority_chat_phone_support',
    'transaction_fee_2_5_percent'
  ])
);

-- Buyer: Enterprise - $149/month, 2% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'enterprise' AND user_type = 'buyer';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'enterprise',
  'buyer',
  149.00,
  1430.40, -- $149 * 12 * 0.8 (20% annual discount)
  2.0,
  true,
  to_jsonb(ARRAY[
    'erp_wms_integration',
    'custom_approval_workflows',
    'unlimited_team_seats',
    'api_access',
    'dedicated_account_manager',
    'volume_discount_negotiation',
    'custom_reporting_compliance',
    'multi_location_management',
    'transaction_fee_2_percent'
  ])
);

-- ============================================================================
-- PART 3: SUPPLIER TIERS - New 4-tier structure
-- ============================================================================

-- Supplier: Lite (Free) - $0/month, 4.5% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'lite' AND user_type = 'supplier';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'lite',
  'supplier',
  0.00,
  0.00,
  4.5,
  true,
  to_jsonb(ARRAY[
    '5_rfq_responses_per_month',
    'basic_company_profile',
    'standard_search_visibility',
    'basic_messaging',
    'transaction_fee_4_5_percent',
    'email_support'
  ])
);

-- Supplier: Growth - $49/month, 4.0% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'growth' AND user_type = 'supplier';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'growth',
  'supplier',
  49.00,
  470.40, -- $49 * 12 * 0.8 (20% annual discount)
  4.0,
  true,
  to_jsonb(ARRAY[
    'unlimited_rfq_responses',
    'verified_supplier_badge',
    'enhanced_profile_product_categories',
    'basic_analytics',
    'quote_templates',
    'transaction_fee_4_0_percent',
    'priority_email_support_12hr'
  ])
);

-- Supplier: Professional - $99/month, 3.5% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'professional' AND user_type = 'supplier';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'professional',
  'supplier',
  99.00,
  950.40, -- $99 * 12 * 0.8 (20% annual discount)
  3.5,
  true,
  to_jsonb(ARRAY[
    'featured_search_placement',
    'advanced_analytics_buyer_insights',
    'priority_rfq_matching',
    'sample_management_tools',
    'bulk_quote_templates',
    '3_team_users',
    'priority_chat_phone_support',
    'transaction_fee_3_5_percent'
  ])
);

-- Supplier: Enterprise - $249/month, 2.5% transaction fee
DELETE FROM subscription_tiers WHERE tier_name = 'enterprise' AND user_type = 'supplier';
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'enterprise',
  'supplier',
  249.00,
  2390.40, -- $249 * 12 * 0.8 (20% annual discount)
  2.5,
  true,
  to_jsonb(ARRAY[
    'dedicated_account_manager',
    'erp_crm_integration',
    'white_label_quoting',
    'co_marketing_opportunities',
    'multi_location_brand_management',
    'unlimited_team_seats',
    'api_access_custom_integrations',
    'custom_onboarding_training',
    'transaction_fee_2_5_percent'
  ])
);

-- ============================================================================
-- VERIFICATION: Show all active tiers after update
-- ============================================================================
SELECT
  '=== UPDATED ACTIVE TIERS ===' as info,
  user_type,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  jsonb_array_length(features) as feature_count,
  is_active
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;
