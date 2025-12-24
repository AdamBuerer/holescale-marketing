import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOldPostsAuthors() {
  console.log('Checking author assignments for old vs new posts...\n');

  // Get all posts with author info
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, author_id, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  const today = new Date().toDateString();
  const oldPosts = posts.filter(p => new Date(p.created_at).toDateString() !== today);
  const newPosts = posts.filter(p => new Date(p.created_at).toDateString() === today);

  console.log(`Old posts (${oldPosts.length}):`);
  console.log('Sample authors:');
  oldPosts.slice(0, 5).forEach(post => {
    console.log(`  ${post.title.substring(0, 50)}...`);
    console.log(`  Author ID: ${post.author_id}\n`);
  });

  // Get author details
  const { data: authors } = await supabase
    .from('blog_authors')
    .select('*');

  console.log('\nAvailable authors:');
  authors.forEach(author => {
    console.log(`  ${author.name} (ID: ${author.id})`);
    console.log(`  Avatar: ${author.avatar_url || 'NONE'}\n`);
  });

  console.log(`\nNew posts (${newPosts.length}) - all have author_id: ${newPosts[0]?.author_id || 'NULL'}`);
}

checkOldPostsAuthors();
