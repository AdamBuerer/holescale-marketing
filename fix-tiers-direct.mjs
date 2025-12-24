#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

console.log('🚀 Direct Tier Update via Supabase API\n');

async function main() {
  // Step 1: Deactivate the duplicate "business" tier
  console.log('Step 1: Deactivating duplicate "business" tier...');
  const { error: deactivateError } = await supabase
    .from('subscription_tiers')
    .update({ is_active: false })
    .eq('tier_name', 'business')
    .eq('user_type', 'buyer');

  if (deactivateError) {
    console.error('❌ Error:', deactivateError.message);
  } else {
    console.log('✅ Business tier deactivated\n');
  }

  // Step 2: Update feature arrays for all tiers
  const tierUpdates = [
    // SUPPLIERS
    {
      tier_name: 'free',
      user_type: 'supplier',
      monthly_price: 0,
      annual_price: 0,
      service_fee_rate: 4.5,
      features: [
        'basic_product_listings',
        'sku_limit_10',
        'standard_marketplace_visibility',
        'direct_buyer_messaging',
        'order_management_dashboard',
        'transaction_fee_4_5_percent'
      ]
    },
    {
      tier_name: 'starter',
      user_type: 'supplier',
      monthly_price: 49,
      annual_price: 470,
      service_fee_rate: 4.0,
      features: [
        'verified_supplier_badge',
        'priority_search_placement',
        'unlimited_product_listings',
        'basic_sales_analytics',
        'enhanced_company_profile',
        'quote_management_tools',
        'transaction_fee_4_0_percent'
      ]
    },
    {
      tier_name: 'professional',
      user_type: 'supplier',
      monthly_price: 99,
      annual_price: 950,
      service_fee_rate: 3.5,
      features: [
        'premium_search_ranking',
        'advanced_analytics_reporting',
        'api_access_inventory_sync',
        'dedicated_customer_support',
        'custom_branded_storefront',
        'multi_user_team_accounts',
        'team_seats_5',
        'transaction_fee_3_5_percent'
      ]
    },
    {
      tier_name: 'enterprise',
      user_type: 'supplier',
      monthly_price: 249,
      annual_price: 2390,
      service_fee_rate: 2.5,
      features: [
        'top_marketplace_placement',
        'white_glove_account_management',
        'custom_erp_system_integration',
        'volume_based_pricing_tools',
        'strategic_supplier_badge',
        'unlimited_team_seats',
        'priority_quote_routing',
        'transaction_fee_2_5_percent'
      ]
    },
    // BUYERS
    {
      tier_name: 'free',
      user_type: 'buyer',
      monthly_price: 0,
      annual_price: 0,
      service_fee_rate: 3.5,
      features: [
        'unlimited_rfq_submissions',
        'basic_supplier_search_filters',
        'standard_order_management',
        'message_suppliers_limit_10_monthly',
        'order_history_90_days',
        'transaction_fee_3_5_percent'
      ]
    },
    {
      tier_name: 'starter',
      user_type: 'buyer',
      monthly_price: 49,
      annual_price: 470,
      service_fee_rate: 2.5,
      features: [
        'transaction_fee_2_5_percent',
        'saved_supplier_lists_favorites',
        'team_collaboration_3_users',
        'extended_order_history_1_year',
        'bulk_rfq_templates',
        'priority_email_support',
        'advanced_search_filters'
      ]
    },
    {
      tier_name: 'professional',
      user_type: 'buyer',
      monthly_price: 99,
      annual_price: 950,
      service_fee_rate: 0.0,
      features: [
        'zero_transaction_fees',
        'full_api_access',
        'team_features_10_users',
        'custom_procurement_reports',
        'bulk_ordering_tools',
        'supplier_performance_analytics',
        'priority_phone_support',
        'purchase_order_automation'
      ]
    },
    {
      tier_name: 'enterprise',
      user_type: 'buyer',
      monthly_price: 249,
      annual_price: 2390,
      service_fee_rate: 0.0,
      features: [
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
    }
  ];

  console.log('Step 2: Updating all tier features...\n');

  for (const update of tierUpdates) {
    const { tier_name, user_type, ...updates } = update;

    console.log(`   Updating ${user_type} ${tier_name}...`);

    const { error } = await supabase
      .from('subscription_tiers')
      .update(updates)
      .eq('tier_name', tier_name)
      .eq('user_type', user_type);

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Updated (${updates.features.length} features)`);
    }
  }

  // Step 3: Verify final state
  console.log('\n\nStep 3: Verifying final state...\n');

  const { data: finalTiers, error: queryError } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('is_active', true)
    .order('user_type, monthly_price');

  if (queryError) {
    console.error('❌ Query error:', queryError.message);
    return;
  }

  const summary = finalTiers.map(t => ({
    user: t.user_type,
    tier: t.tier_name,
    price: `$${t.monthly_price}`,
    annual: `$${t.annual_price}`,
    fee: `${t.service_fee_rate}%`,
    features: t.features?.length || 0
  }));

  console.table(summary);

  // Validation
  console.log('\n✅ Validation:\n');
  const buyerTiers = finalTiers.filter(t => t.user_type === 'buyer');
  const supplierTiers = finalTiers.filter(t => t.user_type === 'supplier');

  console.log(`   Buyer tiers: ${buyerTiers.length} ${buyerTiers.length === 4 ? '✓' : '✗ (should be 4)'}`);
  console.log(`   Supplier tiers: ${supplierTiers.length} ${supplierTiers.length === 4 ? '✓' : '✗ (should be 4)'}`);

  const expectedNames = ['free', 'starter', 'professional', 'enterprise'];
  const buyerNames = buyerTiers.map(t => t.tier_name).sort();
  const supplierNames = supplierTiers.map(t => t.tier_name).sort();

  const buyerMatch = JSON.stringify(buyerNames) === JSON.stringify(expectedNames);
  const supplierMatch = JSON.stringify(supplierNames) === JSON.stringify(expectedNames);

  console.log(`   Buyer tier names: ${buyerMatch ? '✓' : '✗'} [${buyerNames.join(', ')}]`);
  console.log(`   Supplier tier names: ${supplierMatch ? '✓' : '✗'} [${supplierNames.join(', ')}]`);

  // Check features
  const minFeatures = Math.min(...finalTiers.map(t => t.features?.length || 0));
  console.log(`   Min features per tier: ${minFeatures} ${minFeatures >= 6 ? '✓' : '✗ (should be 6+)'}`);

  if (buyerTiers.length === 4 && supplierTiers.length === 4 && buyerMatch && supplierMatch && minFeatures >= 6) {
    console.log('\n🎉 SUCCESS! All tiers updated correctly.\n');
    console.log('Next step: Test your pricing page at /pricing\n');
  } else {
    console.log('\n⚠️  Some checks failed. Review above output.\n');
  }
}

main().catch(console.error);
