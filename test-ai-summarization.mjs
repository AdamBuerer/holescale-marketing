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

// Test results tracker
const results = {
  databaseTable: false,
  realPostTest: false,
  summaryStructure: false,
  caching: false,
  errorHandling: false,
  edgeFunctionDeployed: false,
};

async function checkDatabaseTable() {
  console.log('📊 Test 1: Checking database table...\n');
  
  try {
    const { data, error } = await supabase
      .from('blog_summary_logs')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('   ❌ Table "blog_summary_logs" does not exist');
        console.log('   💡 Run the migration: supabase/migrations/004_blog_summary_logs.sql\n');
        return false;
      }
      console.log(`   ⚠️  Error checking table: ${error.message}\n`);
      return false;
    }
    
    console.log('   ✅ Table "blog_summary_logs" exists');
    console.log(`   📝 Found ${data?.length || 0} existing summary records\n`);
    results.databaseTable = true;
    return true;
  } catch (err) {
    console.error('   ❌ Error:', err.message);
    return false;
  }
}

async function getRealBlogPost() {
  console.log('📝 Test 2: Getting a real blog post for testing...\n');
  
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, content, reading_time, slug')
      .eq('status', 'published')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Error fetching posts: ${error.message}\n`);
      return null;
    }
    
    if (!posts || posts.length === 0) {
      console.log('   ⚠️  No published blog posts found\n');
      return null;
    }
    
    const post = posts[0];
    console.log(`   ✅ Found blog post: "${post.title}"`);
    console.log(`   📄 Post ID: ${post.id}`);
    console.log(`   ⏱️  Reading time: ${post.reading_time || 5} minutes`);
    console.log(`   📏 Content length: ${post.content?.length || 0} characters\n`);
    
    return {
      postId: post.id,
      title: post.title,
      content: post.content || '<p>Test content</p>',
      readingTime: post.reading_time || 5,
      slug: post.slug,
    };
  } catch (err) {
    console.error('   ❌ Error:', err.message);
    return null;
  }
}

async function testEdgeFunction(blogPost) {
  console.log('🚀 Test 3: Testing edge function with real blog post...\n');
  
  if (!blogPost) {
    console.log('   ⚠️  Skipping - no blog post available\n');
    return null;
  }
  
  try {
    console.log('   📤 Calling summarize-blog edge function...');
    const startTime = Date.now();
    
    const response = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        content: blogPost.content,
        title: blogPost.title,
        readingTime: blogPost.readingTime,
        postId: blogPost.postId,
      }),
    });
    
    const elapsedTime = Date.now() - startTime;
    console.log(`   ⏱️  Response time: ${elapsedTime}ms`);
    console.log(`   📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText.substring(0, 200) };
      }
      
      console.log(`   ❌ Error: ${errorData.error || 'Unknown error'}`);
      
      if (response.status === 404) {
        console.log('   💡 Edge function may not be deployed');
      } else if (response.status === 500) {
        console.log('   💡 Check Supabase Edge Function logs for details');
      }
      console.log();
      return null;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.log(`   ❌ Function returned error: ${data.error}\n`);
      return null;
    }
    
    console.log(`   ✅ Success! Summary generated`);
    console.log(`   💾 Cached: ${data.cached ? 'Yes (from cache)' : 'No (newly generated)'}\n`);
    
    results.edgeFunctionDeployed = true;
    results.realPostTest = true;
    
    return data;
  } catch (err) {
    console.error(`   ❌ Network error: ${err.message}\n`);
    return null;
  }
}

function validateSummaryStructure(summaryData) {
  console.log('✅ Test 4: Validating summary structure...\n');
  
  if (!summaryData || !summaryData.summary) {
    console.log('   ❌ No summary data to validate\n');
    return false;
  }
  
  const summary = summaryData.summary;
  const issues = [];
  
  // Check required fields
  if (!summary.tldr || typeof summary.tldr !== 'string' || summary.tldr.trim().length === 0) {
    issues.push('Missing or empty "tldr" field');
  }
  
  if (!summary.keyPoints || !Array.isArray(summary.keyPoints)) {
    issues.push('Missing or invalid "keyPoints" array');
  } else if (summary.keyPoints.length === 0) {
    issues.push('"keyPoints" array is empty');
  } else {
    summary.keyPoints.forEach((point, index) => {
      if (!point.emoji || !point.title || !point.description) {
        issues.push(`Key point ${index + 1} missing required fields`);
      }
    });
  }
  
  if (!summary.targetAudience || typeof summary.targetAudience !== 'string') {
    issues.push('Missing or invalid "targetAudience" field');
  }
  
  if (!summary.actionItems || !Array.isArray(summary.actionItems)) {
    issues.push('Missing or invalid "actionItems" array');
  }
  
  if (!summary.estimatedTimeSaved || typeof summary.estimatedTimeSaved !== 'string') {
    issues.push('Missing or invalid "estimatedTimeSaved" field');
  }
  
  if (issues.length > 0) {
    console.log('   ❌ Validation failed:');
    issues.forEach(issue => console.log(`      - ${issue}`));
    console.log();
    return false;
  }
  
  console.log('   ✅ All required fields present');
  console.log(`   📝 TLDR: ${summary.tldr.substring(0, 80)}...`);
  console.log(`   🎯 Key Points: ${summary.keyPoints.length}`);
  console.log(`   📋 Action Items: ${summary.actionItems.length}`);
  console.log(`   👥 Target Audience: ${summary.targetAudience}`);
  console.log(`   ⏱️  Time Saved: ${summary.estimatedTimeSaved}\n`);
  
  results.summaryStructure = true;
  return true;
}

async function testCaching(blogPost) {
  console.log('💾 Test 5: Testing caching behavior...\n');
  
  if (!blogPost) {
    console.log('   ⚠️  Skipping - no blog post available\n');
    return false;
  }
  
  try {
    console.log('   📤 Making first request (should generate new summary)...');
    const response1 = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        content: blogPost.content,
        title: blogPost.title,
        readingTime: blogPost.readingTime,
        postId: blogPost.postId,
      }),
    });
    
    const data1 = await response1.json();
    const firstWasCached = data1.cached;
    
    console.log(`   ${firstWasCached ? '💾 Cached' : '🆕 New'}`);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('   📤 Making second request (should use cache)...');
    const startTime = Date.now();
    const response2 = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        content: blogPost.content,
        title: blogPost.title,
        readingTime: blogPost.readingTime,
        postId: blogPost.postId,
      }),
    });
    
    const elapsedTime = Date.now() - startTime;
    const data2 = await response2.json();
    const secondWasCached = data2.cached;
    
    console.log(`   ${secondWasCached ? '💾 Cached' : '🆕 New'}`);
    console.log(`   ⏱️  Response time: ${elapsedTime}ms`);
    
    if (secondWasCached && elapsedTime < 1000) {
      console.log('   ✅ Caching is working correctly (fast response from cache)\n');
      results.caching = true;
      return true;
    } else if (secondWasCached) {
      console.log('   ⚠️  Cache hit but slow response\n');
      results.caching = true;
      return true;
    } else {
      console.log('   ⚠️  Cache not working (second request generated new summary)\n');
      return false;
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}\n`);
    return false;
  }
}

async function testErrorHandling() {
  console.log('🛡️  Test 6: Testing error handling...\n');
  
  try {
    // Test with missing required fields
    console.log('   📤 Testing with missing postId...');
    const response1 = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        content: 'Test content',
        title: 'Test title',
        readingTime: 5,
        // Missing postId
      }),
    });
    
    const data1 = await response1.json();
    
    if (response1.status === 400 && data1.error && data1.error.includes('Missing')) {
      console.log('   ✅ Properly handles missing required fields');
    } else {
      console.log(`   ⚠️  Unexpected response: ${response1.status}`);
      console.log(`      ${data1.error || 'No error message'}`);
    }
    
    // Test with invalid data
    console.log('   📤 Testing with invalid JSON...');
    const response2 = await fetch(`${supabaseUrl}/functions/v1/summarize-blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: 'invalid json',
    });
    
    if (response2.status >= 400) {
      console.log('   ✅ Properly handles invalid JSON\n');
      results.errorHandling = true;
      return true;
    } else {
      console.log('   ⚠️  Did not reject invalid JSON\n');
      return false;
    }
  } catch (err) {
    console.log(`   ⚠️  Error during error handling test: ${err.message}\n`);
    return false;
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TEST SUMMARY');
  console.log('='.repeat(80));
  console.log();
  
  const tests = [
    { name: 'Database Table Exists', result: results.databaseTable },
    { name: 'Edge Function Deployed', result: results.edgeFunctionDeployed },
    { name: 'Real Post Test', result: results.realPostTest },
    { name: 'Summary Structure Valid', result: results.summaryStructure },
    { name: 'Caching Works', result: results.caching },
    { name: 'Error Handling', result: results.errorHandling },
  ];
  
  tests.forEach(test => {
    const icon = test.result ? '✅' : '❌';
    console.log(`   ${icon} ${test.name}`);
  });
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log();
  console.log(`   Results: ${passed}/${total} tests passed`);
  console.log();
  
  if (passed === total) {
    console.log('   🎉 ALL TESTS PASSED! AI Summarization is working correctly.');
  } else {
    console.log('   ⚠️  Some tests failed. Review the output above for details.');
    console.log();
    console.log('   💡 Next Steps:');
    if (!results.databaseTable) {
      console.log('      - Run migration: supabase/migrations/004_blog_summary_logs.sql');
    }
    if (!results.edgeFunctionDeployed) {
      console.log('      - Deploy edge function: supabase functions deploy summarize-blog');
      console.log('      - Verify OPENAI_API_KEY is set: supabase secrets list');
    }
    if (!results.caching) {
      console.log('      - Check database connection in edge function');
      console.log('      - Verify RLS policies on blog_summary_logs table');
    }
  }
  
  console.log();
  console.log('='.repeat(80));
}

async function main() {
  console.log('🧪 COMPREHENSIVE AI SUMMARIZATION TEST');
  console.log('='.repeat(80));
  console.log();
  console.log(`🔗 Supabase URL: ${supabaseUrl}`);
  console.log();
  
  // Run all tests
  await checkDatabaseTable();
  const blogPost = await getRealBlogPost();
  const summaryData = await testEdgeFunction(blogPost);
  
  if (summaryData) {
    validateSummaryStructure(summaryData);
    await testCaching(blogPost);
  }
  
  await testErrorHandling();
  
  // Print final summary
  await printSummary();
}

main().catch(console.error);

