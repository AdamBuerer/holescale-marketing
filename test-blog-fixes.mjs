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

async function testIncrementViews() {
  console.log('🧪 Testing increment_blog_post_views function...\n');
  
  try {
    // Get a real post ID
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, views')
      .limit(1);
    
    if (!posts || posts.length === 0) {
      console.log('⚠️  No blog posts found to test with');
      return;
    }
    
    const postId = posts[0].id;
    const viewsBefore = posts[0].views || 0;
    
    console.log(`   Post ID: ${postId}`);
    console.log(`   Views before: ${viewsBefore}`);
    
    // Test the function
    const { error } = await supabase.rpc('increment_blog_post_views', {
      post_id: postId
    });
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      if (error.message.includes('view_count')) {
        console.log('\n   ⚠️  The function is still using "view_count" column!');
        console.log('   Run fix-increment-views-function.sql in Supabase SQL Editor');
      }
      return false;
    }
    
    // Check views after
    const { data: postAfter } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('id', postId)
      .single();
    
    const viewsAfter = postAfter?.views || 0;
    console.log(`   Views after: ${viewsAfter}`);
    
    if (viewsAfter === viewsBefore + 1) {
      console.log('   ✅ Function works correctly!');
      return true;
    } else {
      console.log('   ⚠️  Views did not increment as expected');
      return false;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testSummarizeBlog() {
  console.log('\n🧪 Testing summarize-blog edge function...\n');
  
  try {
    const testData = {
      content: '<p>This is a test blog post content.</p>',
      title: 'Test Blog Post',
      readingTime: 5,
      postId: '00000000-0000-0000-0000-000000000000'
    };
    
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
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error response: ${errorText.substring(0, 200)}`);
      
      if (response.status === 401) {
        console.log('\n   ⚠️  401 Unauthorized - Check:');
        console.log('   1. Edge function is deployed');
        console.log('   2. VITE_SUPABASE_ANON_KEY is correct');
        console.log('   3. Edge function allows anon access');
      }
      return false;
    }
    
    const data = await response.json();
    if (data.success) {
      console.log('   ✅ Edge function responds successfully!');
      return true;
    } else {
      console.log(`   ⚠️  Function returned: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Testing Blog Fixes\n');
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`);
  
  const viewsTest = await testIncrementViews();
  const summarizeTest = await testSummarizeBlog();
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 Test Results:');
  console.log('='.repeat(80));
  console.log(`   increment_blog_post_views: ${viewsTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   summarize-blog edge function: ${summarizeTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!viewsTest || !summarizeTest) {
    console.log('\n📝 Next Steps:');
    if (!viewsTest) {
      console.log('   1. Run fix-increment-views-function.sql in Supabase SQL Editor');
    }
    if (!summarizeTest) {
      console.log('   2. Verify summarize-blog edge function is deployed');
      console.log('   3. Check edge function logs in Supabase dashboard');
    }
  } else {
    console.log('\n✅ All tests passed!');
  }
}

main().catch(console.error);

