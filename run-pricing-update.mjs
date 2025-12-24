import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wdfnegaiqjkwwzbxfhee.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY not found in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFile = join(__dirname, 'update_pricing_database.sql');
const sql = readFileSync(sqlFile, 'utf-8');

console.log('Executing pricing update SQL...\n');

// Split SQL into individual statements (semicolon-separated)
// Remove comments and empty lines, then split by semicolons
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && s.length > 10);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  
  // Skip SELECT statements (they're for verification)
  if (statement.toUpperCase().startsWith('SELECT')) {
    console.log(`Skipping SELECT statement ${i + 1}...`);
    continue;
  }
  
  try {
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      // Try direct query execution
      const { error: queryError } = await supabase.from('_').select('*').limit(0);
      
      // If RPC doesn't work, we'll need to use a different approach
      console.error(`Error on statement ${i + 1}:`, error.message);
      errorCount++;
    } else {
      successCount++;
      console.log(`✓ Statement ${i + 1} executed successfully`);
    }
  } catch (err) {
    console.error(`Error executing statement ${i + 1}:`, err.message);
    errorCount++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Successful: ${successCount}`);
console.log(`Errors: ${errorCount}`);

if (errorCount > 0) {
  console.log('\nNote: Some statements may have failed. Please check the Supabase dashboard SQL editor to run the SQL manually.');
  process.exit(1);
}

