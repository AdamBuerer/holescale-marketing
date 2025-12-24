import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   VITE_SUPABASE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL(sqlFile: string, description: string) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ${description}`);
  console.log('='.repeat(80));

  try {
    const sql = readFileSync(join(__dirname, sqlFile), 'utf-8');

    // Split by semicolons and filter out comments and empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== '');

    for (const statement of statements) {
      if (statement.toUpperCase().startsWith('SELECT')) {
        // For SELECT queries, execute and show results
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // Try direct execution for SELECT
          const { data: directData, error: directError } = await supabase
            .from('subscription_tiers')
            .select('*');

          if (directError) {
            console.error('❌ Error:', directError.message);
          } else {
            console.table(directData);
          }
        } else {
          console.table(data);
        }
      }
    }

    console.log('✅ Completed');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting HoleScale Pricing Tier Migration\n');

  // Check current state
  console.log('📊 Current State:');
  const { data: currentTiers, error: currentError } = await supabase
    .from('subscription_tiers')
    .select('tier_name, user_type, monthly_price, is_active')
    .order('user_type, monthly_price');

  if (currentError) {
    console.error('❌ Error checking current state:', currentError);
  } else {
    console.table(currentTiers);
  }

  console.log('\n⚠️  This will update your pricing tiers.');
  console.log('   - Deactivates old tiers (preserves data)');
  console.log('   - Creates 4-tier structure');
  console.log('   - Assigns comprehensive features\n');

  // Note: Full SQL execution requires service role key or direct database access
  console.log('⚠️  NOTE: SQL execution requires service role access.');
  console.log('   Please run COMPREHENSIVE_TIER_UPDATE.sql in Supabase SQL Editor.');
  console.log('   Or provide service role key as SUPABASE_SERVICE_ROLE_KEY env var.\n');
}

main();
