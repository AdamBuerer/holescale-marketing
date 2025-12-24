import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const HOLESCALE_AUTHOR_ID = 'a12e3454-4b79-43e7-8c13-25dc95853f6a';

async function fixAuthors() {
  console.log('🔧 Fixing author assignments and avatars...\n');

  // Step 1: Update HoleScale author avatar
  console.log('Step 1: Adding avatar to HoleScale author...');
  const { error: avatarError } = await supabase
    .from('blog_authors')
    .update({
      avatar_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop&crop=faces'
    })
    .eq('id', HOLESCALE_AUTHOR_ID);

  if (avatarError) {
    console.error('   ❌ Error updating avatar:', avatarError.message);
  } else {
    console.log('   ✅ Avatar added\n');
  }

  // Step 2: Assign HoleScale author to all posts with null author_id
  console.log('Step 2: Assigning HoleScale author to posts without authors...');

  const { data: postsToUpdate, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, author_id')
    .is('author_id', null);

  if (fetchError) {
    console.error('   ❌ Error fetching posts:', fetchError.message);
    return;
  }

  console.log(`   Found ${postsToUpdate.length} posts without authors\n`);

  let updated = 0;
  for (const post of postsToUpdate) {
    console.log(`   Updating: ${post.title.substring(0, 60)}...`);

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ author_id: HOLESCALE_AUTHOR_ID })
      .eq('id', post.id);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated`);
      updated++;
    }
  }

  console.log('\n============================================================');
  console.log('📊 Summary:');
  console.log(`   Posts updated: ${updated}/${postsToUpdate.length}`);
  console.log(`   Author avatar: Updated`);
  console.log('============================================================\n');

  if (updated > 0) {
    console.log('🎉 All authors fixed! Blog posts should now display properly.');
  }
}

fixAuthors();
