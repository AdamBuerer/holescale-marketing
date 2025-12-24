-- =====================================================
-- COMPREHENSIVE PRICING TIER UPDATE
-- Updates to 4-tier structure with accurate features
-- =====================================================

-- ============================================================================
-- PART 1: Deactivate all existing tiers (preserves data)
-- ============================================================================
UPDATE subscription_tiers SET is_active = false WHERE user_type IN ('buyer', 'supplier');

-- ============================================================================
-- PART 2: SUPPLIER TIERS - Insert/Update to exact spec
-- ============================================================================

-- Supplier: Free Tier
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'free',
  'supplier',
  0.00,
  0.00,
  4.5,
  true,
  ARRAY[
    'basic_product_listings',
    'sku_limit_10',
    'standard_marketplace_visibility',
    'direct_buyer_messaging',
    'order_management_dashboard',
    'transaction_fee_4_5_percent'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 0.00,
  annual_price = 0.00,
  service_fee_rate = 4.5,
  is_active = true,
  features = ARRAY[
    'basic_product_listings',
    'sku_limit_10',
    'standard_marketplace_visibility',
    'direct_buyer_messaging',
    'order_management_dashboard',
    'transaction_fee_4_5_percent'
  ];

-- Supplier: Starter Tier ($49)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'starter',
  'supplier',
  49.00,
  470.00,
  4.0,
  true,
  ARRAY[
    'verified_supplier_badge',
    'priority_search_placement',
    'unlimited_product_listings',
    'basic_sales_analytics',
    'enhanced_company_profile',
    'quote_management_tools',
    'transaction_fee_4_0_percent'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 49.00,
  annual_price = 470.00,
  service_fee_rate = 4.0,
  is_active = true,
  features = ARRAY[
    'verified_supplier_badge',
    'priority_search_placement',
    'unlimited_product_listings',
    'basic_sales_analytics',
    'enhanced_company_profile',
    'quote_management_tools',
    'transaction_fee_4_0_percent'
  ];

-- Supplier: Professional Tier ($99)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'professional',
  'supplier',
  99.00,
  950.00,
  3.5,
  true,
  ARRAY[
    'premium_search_ranking',
    'advanced_analytics_reporting',
    'api_access_inventory_sync',
    'dedicated_customer_support',
    'custom_branded_storefront',
    'multi_user_team_accounts',
    'team_seats_5',
    'transaction_fee_3_5_percent'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 99.00,
  annual_price = 950.00,
  service_fee_rate = 3.5,
  is_active = true,
  features = ARRAY[
    'premium_search_ranking',
    'advanced_analytics_reporting',
    'api_access_inventory_sync',
    'dedicated_customer_support',
    'custom_branded_storefront',
    'multi_user_team_accounts',
    'team_seats_5',
    'transaction_fee_3_5_percent'
  ];

-- Supplier: Enterprise Tier ($249)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'enterprise',
  'supplier',
  249.00,
  2390.00,
  2.5,
  true,
  ARRAY[
    'top_marketplace_placement',
    'white_glove_account_management',
    'custom_erp_system_integration',
    'volume_based_pricing_tools',
    'strategic_supplier_badge',
    'unlimited_team_seats',
    'priority_quote_routing',
    'transaction_fee_2_5_percent'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 249.00,
  annual_price = 2390.00,
  service_fee_rate = 2.5,
  is_active = true,
  features = ARRAY[
    'top_marketplace_placement',
    'white_glove_account_management',
    'custom_erp_system_integration',
    'volume_based_pricing_tools',
    'strategic_supplier_badge',
    'unlimited_team_seats',
    'priority_quote_routing',
    'transaction_fee_2_5_percent'
  ];

-- ============================================================================
-- PART 3: BUYER TIERS - Insert/Update to exact spec
-- ============================================================================

-- Buyer: Free Tier
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'free',
  'buyer',
  0.00,
  0.00,
  3.5,
  true,
  ARRAY[
    'unlimited_rfq_submissions',
    'basic_supplier_search_filters',
    'standard_order_management',
    'message_suppliers_limit_10_monthly',
    'order_history_90_days',
    'transaction_fee_3_5_percent'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 0.00,
  annual_price = 0.00,
  service_fee_rate = 3.5,
  is_active = true,
  features = ARRAY[
    'unlimited_rfq_submissions',
    'basic_supplier_search_filters',
    'standard_order_management',
    'message_suppliers_limit_10_monthly',
    'order_history_90_days',
    'transaction_fee_3_5_percent'
  ];

-- Buyer: Starter Tier ($49)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'starter',
  'buyer',
  49.00,
  470.00,
  2.5,
  true,
  ARRAY[
    'transaction_fee_2_5_percent',
    'saved_supplier_lists_favorites',
    'team_collaboration_3_users',
    'extended_order_history_1_year',
    'bulk_rfq_templates',
    'priority_email_support',
    'advanced_search_filters'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 49.00,
  annual_price = 470.00,
  service_fee_rate = 2.5,
  is_active = true,
  features = ARRAY[
    'transaction_fee_2_5_percent',
    'saved_supplier_lists_favorites',
    'team_collaboration_3_users',
    'extended_order_history_1_year',
    'bulk_rfq_templates',
    'priority_email_support',
    'advanced_search_filters'
  ];

-- Buyer: Professional Tier ($99)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'professional',
  'buyer',
  99.00,
  950.00,
  0.0,
  true,
  ARRAY[
    'zero_transaction_fees',
    'full_api_access',
    'team_features_10_users',
    'custom_procurement_reports',
    'bulk_ordering_tools',
    'supplier_performance_analytics',
    'priority_phone_support',
    'purchase_order_automation'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 99.00,
  annual_price = 950.00,
  service_fee_rate = 0.0,
  is_active = true,
  features = ARRAY[
    'zero_transaction_fees',
    'full_api_access',
    'team_features_10_users',
    'custom_procurement_reports',
    'bulk_ordering_tools',
    'supplier_performance_analytics',
    'priority_phone_support',
    'purchase_order_automation'
  ];

-- Buyer: Enterprise Tier ($249)
INSERT INTO subscription_tiers (
  tier_name, user_type, monthly_price, annual_price, service_fee_rate, is_active, features
) VALUES (
  'enterprise',
  'buyer',
  249.00,
  2390.00,
  0.0,
  true,
  ARRAY[
    'zero_transaction_fees',
    'dedicated_account_manager',
    'custom_erp_integration',
    'net_30_60_payment_terms',
    'volume_contract_management',
    'unlimited_team_seats',
    'sla_guarantees_99_9_uptime',
    'strategic_sourcing_support',
    'white_label_options'
  ]
)
ON CONFLICT (tier_name, user_type)
DO UPDATE SET
  monthly_price = 249.00,
  annual_price = 2390.00,
  service_fee_rate = 0.0,
  is_active = true,
  features = ARRAY[
    'zero_transaction_fees',
    'dedicated_account_manager',
    'custom_erp_integration',
    'net_30_60_payment_terms',
    'volume_contract_management',
    'unlimited_team_seats',
    'sla_guarantees_99_9_uptime',
    'strategic_sourcing_support',
    'white_label_options'
  ];

-- ============================================================================
-- PART 4: Add constraint if not exists (ensures tier_name + user_type is unique)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscription_tiers_tier_name_user_type_key'
    ) THEN
        ALTER TABLE subscription_tiers
        ADD CONSTRAINT subscription_tiers_tier_name_user_type_key
        UNIQUE (tier_name, user_type);
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION: Show all active tiers
-- ============================================================================
SELECT
  '=== ACTIVE TIERS ===' as section,
  user_type,
  tier_name,
  monthly_price,
  annual_price,
  service_fee_rate,
  array_length(features, 1) as feature_count,
  is_active
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;

-- Show feature details for each tier
SELECT
  '=== TIER FEATURES ===' as section,
  tier_name,
  user_type,
  unnest(features) as feature
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;
