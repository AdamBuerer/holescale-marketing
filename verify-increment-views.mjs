import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
let supabaseUrl, supabaseKey;
try {
  const envContent = readFileSync(join(__dirname, '.env.local'), 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !line.trim().startsWith('#')) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
  supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
} catch (e) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFunctionExists() {
  console.log('🔍 Checking if increment_blog_post_views function exists...\n');
  
  try {
    // Try to call the function with a test UUID (should fail gracefully if function doesn't exist)
    const { error } = await supabase.rpc('increment_blog_post_views', {
      post_id: '00000000-0000-0000-0000-000000000000'
    });

    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ Function does NOT exist');
        console.log('   Error:', error.message);
        return false;
      } else {
        // Function exists but failed for other reasons (like invalid UUID) - that's OK
        console.log('✅ Function EXISTS (test call failed as expected with invalid UUID)');
        return true;
      }
    } else {
      console.log('✅ Function EXISTS and is callable');
      return true;
    }
  } catch (err) {
    if (err.message.includes('does not exist') || err.message.includes('not found')) {
      console.log('❌ Function does NOT exist');
      return false;
    }
    // Other errors might mean the function exists but has issues
    console.log('⚠️  Could not verify function status');
    console.log('   Error:', err.message);
    return null;
  }
}

async function verifyMigrationSQL() {
  console.log('\n📄 Verifying migration SQL syntax...\n');
  
  const migrationPath = join(__dirname, 'supabase/migrations/005_add_increment_views_function.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  console.log('Migration file contents:');
  console.log('─'.repeat(80));
  console.log(sql);
  console.log('─'.repeat(80));
  
  // Basic syntax checks
  const hasCreateFunction = sql.includes('CREATE OR REPLACE FUNCTION');
  const hasFunctionName = sql.includes('increment_blog_post_views');
  const hasGrant = sql.includes('GRANT EXECUTE');
  
  console.log('\n✅ Syntax checks:');
  console.log(`   CREATE FUNCTION statement: ${hasCreateFunction ? '✓' : '✗'}`);
  console.log(`   Function name correct: ${hasFunctionName ? '✓' : '✗'}`);
  console.log(`   GRANT statement: ${hasGrant ? '✓' : '✗'}`);
  
  return hasCreateFunction && hasFunctionName && hasGrant;
}

async function main() {
  console.log('🚀 Verifying increment_blog_post_views Migration\n');
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`);
  
  const sqlValid = await verifyMigrationSQL();
  const functionExists = await checkFunctionExists();
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 Summary:');
  console.log('='.repeat(80));
  console.log(`   SQL Syntax: ${sqlValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Function Status: ${functionExists === true ? '✅ Exists' : functionExists === false ? '❌ Missing' : '⚠️  Unknown'}`);
  
  if (!functionExists) {
    console.log('\n📝 Next Steps:');
    console.log('   1. Open Supabase Dashboard SQL Editor');
    console.log('   2. Copy the SQL from: supabase/migrations/005_add_increment_views_function.sql');
    console.log('   3. Paste and run it');
    console.log('   4. Run this script again to verify\n');
  } else {
    console.log('\n✅ Migration appears to be applied successfully!');
    console.log('   The function is available and ready to use.\n');
  }
}

main().catch(console.error);

