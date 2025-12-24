import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkExistingBlogs() {
  try {
    // Check if blog_posts table exists - select all columns to see what's available
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Error checking blogs (table may not exist yet):', error.message);
      return { exists: false, posts: [] };
    }

    console.log(`\n✅ Found ${posts.length} existing blog posts:\n`);

    if (posts.length > 0) {
      // First, show the schema
      console.log('Database columns:', Object.keys(posts[0]).join(', '), '\n');

      // Show first post structure as example
      console.log('Example post structure:\n', JSON.stringify(posts[0], null, 2), '\n');

      console.log('All posts:');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Created: ${new Date(post.created_at).toLocaleDateString()}\n`);
      });
    } else {
      console.log('No blog posts found in database.\n');
    }

    return { exists: true, posts };
  } catch (err) {
    console.error('Error:', err.message);
    return { exists: false, posts: [] };
  }
}

checkExistingBlogs();
