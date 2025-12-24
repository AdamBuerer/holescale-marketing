import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  console.log('Checking for triggers on blog_posts table...\n');

  // Query to get triggers
  const { data, error } = await supabase
    .rpc('exec_sql', {
      query: `
        SELECT
          trigger_name,
          event_manipulation,
          action_statement,
          action_timing
        FROM information_schema.triggers
        WHERE event_object_table = 'blog_posts'
        ORDER BY trigger_name;
      `
    });

  if (error) {
    console.error('RPC not available, trying alternative method...');
    console.log('Error:', error.message);

    // Alternative: try to see if we can query system tables directly
    console.log('\nLet me check the database migration files instead...');
    return;
  }

  console.log('Triggers found:');
  console.log(JSON.stringify(data, null, 2));
}

checkTriggers();
