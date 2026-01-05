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
  supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
} catch (e) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('Testing edge function authentication...\n');
console.log(`URL: ${supabaseUrl}/functions/v1/summarize-blog`);
console.log(`Anon Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}\n`);

const testData = {
  content: '<p>Test content</p>',
  title: 'Test Post',
  readingTime: 5,
  postId: '00000000-0000-0000-0000-000000000000'
};

async function testRequest() {
  try {
    console.log('Making request with Authorization header...\n');
    const response = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(testData),
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`\nResponse body (first 500 chars):`);
    console.log(responseText.substring(0, 500));
    
    if (response.status === 401) {
      console.log('\n❌ 401 Unauthorized - Possible causes:');
      console.log('1. Anon key does not match Supabase project');
      console.log('2. Edge function requires authentication');
      console.log('3. Function not configured for anonymous access');
      console.log('\n💡 Check:');
      console.log('- Verify VITE_SUPABASE_ANON_KEY matches your Supabase project');
      console.log('- Check Supabase dashboard → Edge Functions → summarize-blog');
      console.log('- Verify function is deployed and accessible');
    }
  } catch (err) {
    console.error('❌ Network error:', err.message);
  }
}

testRequest();

