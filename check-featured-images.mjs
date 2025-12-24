import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFeaturedImages() {
  console.log('Checking featured images...\n');

  // Get all blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, featured_image, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${posts.length} blog posts\n`);

  // Separate old and new posts (new ones were created today)
  const today = new Date().toDateString();
  const newPosts = posts.filter(p => new Date(p.created_at).toDateString() === today);
  const oldPosts = posts.filter(p => new Date(p.created_at).toDateString() !== today);

  console.log(`Old posts (${oldPosts.length}):`);
  oldPosts.slice(0, 3).forEach(post => {
    console.log(`  ${post.title}`);
    console.log(`  Image: ${JSON.stringify(post.featured_image)}\n`);
  });

  console.log(`\nNew posts (${newPosts.length}):`);
  newPosts.slice(0, 3).forEach(post => {
    console.log(`  ${post.title}`);
    console.log(`  Image: ${JSON.stringify(post.featured_image)}\n`);
  });
}

checkFeaturedImages();
