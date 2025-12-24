#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Could not extract project ref from URL');
  process.exit(1);
}

console.log('🚀 HoleScale Pricing Tier Migration\n');
console.log(`📡 Project: ${projectRef}`);
console.log(`🔗 URL: ${supabaseUrl}\n`);

async function executeSQLFile(filename, description) {
  console.log(`${'='.repeat(80)}`);
  console.log(`📄 ${description}`);
  console.log('='.repeat(80));

  try {
    const sql = readFileSync(join(__dirname, filename), 'utf-8');

    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // RPC might not exist, try alternative: direct database connection
      console.log('⚠️  exec_sql RPC not available, using psql method...\n');
      console.log('Please run the following in Supabase SQL Editor:');
      console.log(`📋 File: ${filename}\n`);
      return false;
    }

    const data = await response.json();
    console.log('✅ SQL executed successfully');

    if (data && Array.isArray(data) && data.length > 0) {
      console.table(data);
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function queryTiers() {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscription_tiers?is_active=eq.true&select=*&order=user_type,monthly_price`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error querying tiers:', error.message);
    return null;
  }
}

async function main() {
  // Show current state
  console.log('📊 Current Active Tiers:\n');
  const currentTiers = await queryTiers();

  if (currentTiers) {
    const summary = currentTiers.map(t => ({
      user: t.user_type,
      tier: t.tier_name,
      price: `$${t.monthly_price}`,
      fee: `${t.service_fee_rate}%`,
      features: t.features?.length || 0
    }));
    console.table(summary);
  }

  console.log('\n⚠️  About to run migration:');
  console.log('   ✓ Deactivates old tiers (preserves data)');
  console.log('   ✓ Creates/updates 4-tier structure');
  console.log('   ✓ Assigns comprehensive features');
  console.log('   ✓ Existing subscriptions preserved\n');

  // Try to execute migration
  const success = await executeSQLFile(
    'COMPREHENSIVE_TIER_UPDATE.sql',
    'Running Database Migration'
  );

  if (!success) {
    console.log('\n📝 Manual Steps Required:\n');
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/' + projectRef);
    console.log('2. Go to SQL Editor');
    console.log('3. Copy contents of: COMPREHENSIVE_TIER_UPDATE.sql');
    console.log('4. Run the query');
    console.log('5. Then run this script again to verify\n');
    process.exit(1);
  }

  // Query updated tiers
  console.log('\n\n📊 Updated Active Tiers:\n');
  const updatedTiers = await queryTiers();

  if (updatedTiers) {
    const summary = updatedTiers.map(t => ({
      user: t.user_type,
      tier: t.tier_name,
      price: `$${t.monthly_price}`,
      fee: `${t.service_fee_rate}%`,
      features: t.features?.length || 0
    }));
    console.table(summary);

    // Validation
    console.log('\n✅ Validation:\n');
    const buyerCount = updatedTiers.filter(t => t.user_type === 'buyer').length;
    const supplierCount = updatedTiers.filter(t => t.user_type === 'supplier').length;

    console.log(`   Buyer tiers: ${buyerCount} ${buyerCount === 4 ? '✓' : '✗ (should be 4)'}`);
    console.log(`   Supplier tiers: ${supplierCount} ${supplierCount === 4 ? '✓' : '✗ (should be 4)'}`);

    const expectedTiers = ['free', 'starter', 'professional', 'enterprise'];
    const buyerTiers = updatedTiers.filter(t => t.user_type === 'buyer').map(t => t.tier_name).sort();
    const supplierTiers = updatedTiers.filter(t => t.user_type === 'supplier').map(t => t.tier_name).sort();

    const buyerMatch = JSON.stringify(buyerTiers) === JSON.stringify(expectedTiers);
    const supplierMatch = JSON.stringify(supplierTiers) === JSON.stringify(expectedTiers);

    console.log(`   Buyer tier names: ${buyerMatch ? '✓' : '✗ (incorrect names)'}`);
    console.log(`   Supplier tier names: ${supplierMatch ? '✓' : '✗ (incorrect names)'}`);

    if (buyerCount === 4 && supplierCount === 4 && buyerMatch && supplierMatch) {
      console.log('\n🎉 Migration successful! All checks passed.\n');
    } else {
      console.log('\n⚠️  Migration may need review. Check tier configuration.\n');
    }
  }
}

main().catch(console.error);
