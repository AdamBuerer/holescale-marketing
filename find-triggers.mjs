import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findTriggers() {
  console.log('Finding triggers and constraints...\n');

  // First, check for triggers using Supabase's postgres RPC
  const triggerQuery = `
    SELECT
      t.tgname AS trigger_name,
      c.relname AS table_name,
      p.proname AS function_name,
      CASE t.tgenabled
        WHEN 'O' THEN 'enabled'
        WHEN 'D' THEN 'disabled'
        WHEN 'R' THEN 'replica'
        WHEN 'A' THEN 'always'
        ELSE 'unknown'
      END AS is_enabled
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_proc p ON t.tgfoid = p.oid
    WHERE c.relname = 'blog_posts'
      AND NOT t.tgisinternal
    ORDER BY t.tgname;
  `;

  try {
    const { data: triggers, error: triggerError } = await supabase
      .rpc('exec_sql', { query: triggerQuery });

    if (triggerError) {
      console.log('Cannot query triggers directly (exec_sql not available)');
      console.log('Error:', triggerError.message);
    } else {
      console.log('Triggers on blog_posts:');
      console.log(JSON.stringify(triggers, null, 2));
    }
  } catch (err) {
    console.log('RPC method not available');
  }

  // Check constraints on blog_summary_logs
  const constraintQuery = `
    SELECT
      conname AS constraint_name,
      pg_get_constraintdef(oid) AS constraint_definition
    FROM pg_constraint
    WHERE conrelid = 'blog_summary_logs'::regclass
      AND contype = 'c'
    ORDER BY conname;
  `;

  try {
    const { data: constraints, error: constraintError } = await supabase
      .rpc('exec_sql', { query: constraintQuery });

    if (constraintError) {
      console.log('\nCannot query constraints directly');
    } else {
      console.log('\nConstraints on blog_summary_logs:');
      console.log(JSON.stringify(constraints, null, 2));
    }
  } catch (err) {
    console.log('RPC method not available for constraints');
  }
}

findTriggers();
