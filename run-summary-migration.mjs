/**
 * Run the blog_summary_logs migration via Supabase API
 * This script uses the service role key to execute SQL directly
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('📦 Running blog_summary_logs migration...\n');

  try {
    // Read the migration SQL file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20251223140256_blog_summary_logs.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    // Split SQL into individual statements (simple approach)
    // Remove comments and split by semicolons
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.trim().length === 0) continue;

      // Skip pure comment lines
      if (statement.startsWith('--')) continue;

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          // Try direct query execution as fallback
          const { error: queryError } = await supabase
            .from('_exec_sql')
            .select('*')
            .limit(0);

          // If RPC doesn't exist, we need to use a different approach
          // For now, let's try using the REST API directly
          console.log('   ⚠️  RPC method not available, trying alternative...');
          
          // Use fetch to execute via REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ sql_query: statement }),
          });

          if (!response.ok) {
            // If that doesn't work, we'll need to use the Supabase dashboard
            console.log('   ⚠️  Cannot execute SQL via API');
            console.log('   Please run this migration manually in the Supabase SQL Editor');
            console.log(`   File: ${migrationPath}\n`);
            break;
          }
        } else {
          console.log('   ✅ Success');
        }
      } catch (err) {
        console.log(`   ⚠️  Error: ${err.message}`);
        console.log('   This might be expected if the table already exists');
      }
    }

    console.log('\n✅ Migration script completed!');
    console.log('\n📝 Note: If you see errors above, you may need to run the SQL manually');
    console.log('   in the Supabase Dashboard SQL Editor:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/wdfnegaiqjkwwzbxfhee/sql/new`);
    console.log('\n   Or use the Supabase CLI:');
    console.log('   supabase db push');

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.error('\nPlease run the migration manually:');
    console.error('1. Go to Supabase Dashboard → SQL Editor');
    console.error('2. Copy the contents of: supabase/migrations/20251223140256_blog_summary_logs.sql');
    console.error('3. Paste and execute');
    process.exit(1);
  }
}

runMigration();

