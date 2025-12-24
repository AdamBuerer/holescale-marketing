import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSummaryLogs() {
  console.log('Checking blog_summary_logs table...\n');

  // Try to get any existing logs to see structure
  const { data: logs, error } = await supabase
    .from('blog_summary_logs')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (logs && logs.length > 0) {
    console.log('Sample blog_summary_logs entries:');
    console.log(JSON.stringify(logs, null, 2));

    // Get distinct action values
    const { data: allLogs } = await supabase
      .from('blog_summary_logs')
      .select('action');

    if (allLogs) {
      const uniqueActions = [...new Set(allLogs.map(l => l.action))];
      console.log('\nDistinct action values:');
      console.log(uniqueActions);
    }
  } else {
    console.log('No entries found in blog_summary_logs table');
  }
}

checkSummaryLogs();
