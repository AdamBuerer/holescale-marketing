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

async function testWithDetailedError() {
  console.log('🔍 Testing summarize-blog with detailed error logging...\n');
  
  const testData = {
    content: '<p>This is a test blog post about packaging solutions for e-commerce businesses. We will discuss various packaging options and their benefits.</p>',
    title: 'Test Blog Post',
    readingTime: 5,
    postId: '00000000-0000-0000-0000-000000000000'
  };
  
  try {
    console.log('   Calling edge function...');
    const response = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(testData),
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}\n`);
    
    const responseText = await response.text();
    console.log('   Response body:');
    console.log('   ' + responseText.substring(0, 500));
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.log('\n   📋 Parsed error:');
        console.log(JSON.stringify(errorData, null, 2));
        
        if (errorData.error === 'OpenAI API key not configured') {
          console.log('\n   ⚠️  The OPENAI_API_KEY secret is missing in Supabase');
        } else if (errorData.error === 'Failed to generate summary from AI') {
          console.log('\n   ⚠️  The OpenAI API call failed');
          console.log('   This could be due to:');
          console.log('   - Invalid API key');
          console.log('   - Rate limiting');
          console.log('   - Quota exceeded');
          console.log('   - Network issues');
          console.log('\n   Check Supabase Edge Function logs for detailed OpenAI error');
        }
      } catch (e) {
        console.log('\n   ⚠️  Could not parse error response');
      }
    } else {
      const data = JSON.parse(responseText);
      if (data.success) {
        console.log('\n   ✅ Success! Summary generated');
      } else {
        console.log('\n   ⚠️  Function returned success=false');
        console.log('   Error:', data.error);
      }
    }
  } catch (err) {
    console.error('❌ Network error:', err.message);
  }
}

testWithDetailedError();

