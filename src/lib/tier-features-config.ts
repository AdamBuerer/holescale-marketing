/**
 * Tier Features Configuration
 * Maps database feature keys to human-readable display text
 */

export interface FeatureDisplay {
  key: string;
  label: string;
  description?: string;
}

// ============================================================================
// SUPPLIER FEATURE MAPPINGS
// ============================================================================

export const SUPPLIER_FEATURES: Record<string, string> = {
  // Free Tier
  'basic_product_listings': 'Basic product listings',
  'sku_limit_10': 'Up to 10 SKUs',
  'standard_marketplace_visibility': 'Standard marketplace visibility',
  'direct_buyer_messaging': 'Direct buyer messaging',
  'order_management_dashboard': 'Order management dashboard',
  'transaction_fee_4_5_percent': '4.5% transaction fee',

  // Starter Tier
  'verified_supplier_badge': 'Verified supplier badge',
  'priority_search_placement': 'Priority search placement',
  'unlimited_product_listings': 'Unlimited product listings',
  'basic_sales_analytics': 'Basic sales analytics',
  'enhanced_company_profile': 'Enhanced company profile',
  'quote_management_tools': 'Quote management tools',
  'transaction_fee_4_0_percent': '4.0% transaction fee',

  // Professional Tier
  'premium_search_ranking': 'Premium search ranking',
  'advanced_analytics_reporting': 'Advanced analytics & reporting',
  'api_access_inventory_sync': 'API access for inventory sync',
  'dedicated_customer_support': 'Dedicated customer support',
  'custom_branded_storefront': 'Custom branded storefront',
  'multi_user_team_accounts': 'Multi-user team accounts',
  'team_seats_5': '5 team seats',
  'transaction_fee_3_5_percent': '3.5% transaction fee',

  // Enterprise Tier
  'top_marketplace_placement': 'Top marketplace placement',
  'white_glove_account_management': 'White-glove account management',
  'custom_erp_system_integration': 'Custom ERP/system integration',
  'volume_based_pricing_tools': 'Volume-based pricing tools',
  'strategic_supplier_badge': 'Strategic supplier badge',
  'unlimited_team_seats': 'Unlimited team seats',
  'priority_quote_routing': 'Priority quote routing',
  'transaction_fee_2_5_percent': '2.5% transaction fee',
};

// ============================================================================
// BUYER FEATURE MAPPINGS
// ============================================================================

export const BUYER_FEATURES: Record<string, string> = {
  // Free Tier
  'unlimited_rfq_submissions': 'Unlimited RFQ submissions',
  'basic_supplier_search_filters': 'Basic supplier search & filters',
  'standard_order_management': 'Standard order management',
  'message_suppliers_limit_10_monthly': 'Message up to 10 suppliers/month',
  'order_history_90_days': 'Order history (90 days)',
  'transaction_fee_3_5_percent': '3.5% transaction fee',

  // Starter Tier
  'transaction_fee_2_5_percent': 'Reduced 2.5% transaction fee',
  'saved_supplier_lists_favorites': 'Saved supplier lists & favorites',
  'team_collaboration_3_users': 'Team collaboration (3 users)',
  'extended_order_history_1_year': 'Extended order history (1 year)',
  'bulk_rfq_templates': 'Bulk RFQ templates',
  'priority_email_support': 'Priority email support',
  'advanced_search_filters': 'Advanced search filters',

  // Professional Tier
  'zero_transaction_fees': '0% transaction fees',
  'full_api_access': 'Full API access',
  'team_features_10_users': 'Team features (10 users)',
  'custom_procurement_reports': 'Custom procurement reports',
  'bulk_ordering_tools': 'Bulk ordering tools',
  'supplier_performance_analytics': 'Supplier performance analytics',
  'priority_phone_support': 'Priority phone support',
  'purchase_order_automation': 'Purchase order automation',

  // Enterprise Tier
  'dedicated_account_manager': 'Dedicated account manager',
  'custom_erp_integration': 'Custom ERP integration',
  'net_30_60_payment_terms': 'Net 30/60 payment terms',
  'volume_contract_management': 'Volume contract management',
  'unlimited_team_seats': 'Unlimited team seats',
  'sla_guarantees_99_9_uptime': 'SLA guarantees (99.9% uptime)',
  'strategic_sourcing_support': 'Strategic sourcing support',
  'white_label_options': 'White-label options',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get display label for a feature key based on user type
 */
export function getFeatureLabel(featureKey: string, userType: 'buyer' | 'supplier'): string {
  const features = userType === 'buyer' ? BUYER_FEATURES : SUPPLIER_FEATURES;
  return features[featureKey] || formatFeatureKey(featureKey);
}

/**
 * Fallback formatter for feature keys not in the mapping
 */
function formatFeatureKey(key: string): string {
  return key
    .split('_')
    .map(word => {
      // Handle acronyms
      if (word.toLowerCase() === 'api') return 'API';
      if (word.toLowerCase() === 'rfq') return 'RFQ';
      if (word.toLowerCase() === 'sla') return 'SLA';
      if (word.toLowerCase() === 'erp') return 'ERP';
      if (word.toLowerCase() === 'sku') return 'SKU';
      if (word.toLowerCase() === 'skus') return 'SKUs';
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Format features array for display
 */
export function formatFeaturesForDisplay(
  features: string[],
  userType: 'buyer' | 'supplier'
): string[] {
  return features.map(feature => getFeatureLabel(feature, userType));
}

// ============================================================================
// TIER DISPLAY NAMES
// ============================================================================

export const TIER_DISPLAY_NAMES: Record<string, string> = {
  'free': 'Free',
  'starter': 'Starter',
  'professional': 'Professional',
  'enterprise': 'Enterprise',
};

/**
 * Get display name for a tier
 */
export function getTierDisplayName(tierName: string): string {
  return TIER_DISPLAY_NAMES[tierName.toLowerCase()] ||
         tierName.charAt(0).toUpperCase() + tierName.slice(1).toLowerCase();
}

// ============================================================================
// TIER DESCRIPTIONS
// ============================================================================

export const TIER_DESCRIPTIONS: Record<string, Record<string, string>> = {
  buyer: {
    free: 'Perfect for getting started',
    starter: 'For growing teams',
    professional: 'Advanced features for teams',
    enterprise: 'For large organizations',
  },
  supplier: {
    free: 'Test the platform',
    starter: 'For growing suppliers',
    professional: 'Advanced tools',
    enterprise: 'High-volume suppliers',
  },
};

/**
 * Get description for a tier
 */
export function getTierDescription(tierName: string, userType: 'buyer' | 'supplier'): string {
  return TIER_DESCRIPTIONS[userType]?.[tierName.toLowerCase()] || 'Scale your business';
}
