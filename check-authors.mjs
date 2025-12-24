import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthors() {
  console.log('Checking authors...\n');

  // Get all blog_authors
  const { data: authors, error: authorsError } = await supabase
    .from('blog_authors')
    .select('*');

  if (authorsError) {
    console.error('Error fetching authors:', authorsError.message);
    return;
  }

  console.log(`Found ${authors.length} authors:\n`);
  authors.forEach(author => {
    console.log(`  ${author.name}`);
    console.log(`  Avatar: ${author.avatar_url || 'NONE'}`);
    console.log(`  Bio: ${author.bio?.substring(0, 50) || 'NONE'}...\n`);
  });

  // Check which author_id the new posts are using
  const { data: newPosts, error: postsError } = await supabase
    .from('blog_posts')
    .select('id, title, author_id')
    .order('created_at', { ascending: false })
    .limit(12);

  if (postsError) {
    console.error('Error fetching posts:', postsError.message);
    return;
  }

  console.log('\nNew posts author assignments:');
  const authorCounts = {};
  newPosts.forEach(post => {
    const authorId = post.author_id || 'null';
    authorCounts[authorId] = (authorCounts[authorId] || 0) + 1;
  });

  Object.entries(authorCounts).forEach(([authorId, count]) => {
    const author = authors.find(a => a.id === authorId);
    console.log(`  ${author?.name || 'NULL'}: ${count} posts`);
  });
}

checkAuthors();
