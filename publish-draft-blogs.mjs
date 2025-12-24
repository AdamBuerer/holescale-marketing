import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishDraftBlogs() {
  console.log('Publishing draft blog posts...\n');

  // Get all draft posts
  const { data: draftPosts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status')
    .eq('status', 'draft');

  if (fetchError) {
    console.error('Error fetching draft posts:', fetchError.message);
    return;
  }

  console.log(`Found ${draftPosts.length} draft posts to publish\n`);

  let published = 0;
  let errors = 0;

  for (const post of draftPosts) {
    try {
      console.log(`   Publishing: ${post.title}...`);

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ Published successfully\n`);
      published++;
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log('\n============================================================');
  console.log('📊 Publish Summary:');
  console.log(`   Total: ${draftPosts.length}`);
  console.log(`   Published: ${published}`);
  console.log(`   Errors: ${errors}`);
  console.log('============================================================\n');

  if (published > 0) {
    console.log('🎉 Blog posts published successfully!');
  }
}

publishDraftBlogs();
