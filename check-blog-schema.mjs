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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogSchema() {
  console.log('🔍 Checking blog_posts table schema...\n');
  
  try {
    // Try to get a sample post to see what columns exist
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      const post = data[0];
      console.log('📊 Columns found in blog_posts table:');
      console.log('─'.repeat(80));
      const columns = Object.keys(post);
      columns.forEach(col => {
        const value = post[col];
        const type = value === null ? 'null' : typeof value;
        console.log(`   ${col.padEnd(30)} (${type})`);
      });
      console.log('─'.repeat(80));
      
      // Check specifically for view-related columns
      const viewColumns = columns.filter(c => 
        c.toLowerCase().includes('view') || 
        c.toLowerCase().includes('count')
      );
      
      console.log('\n🔍 View-related columns:');
      if (viewColumns.length > 0) {
        viewColumns.forEach(col => {
          console.log(`   ✓ ${col} = ${post[col]}`);
        });
      } else {
        console.log('   ❌ No view-related columns found!');
      }
    } else {
      console.log('⚠️  No posts found in table');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkBlogSchema();

