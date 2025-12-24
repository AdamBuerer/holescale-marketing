import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const HOLESCALE_AUTHOR_ID = 'a12e3454-4b79-43e7-8c13-25dc95853f6a';

async function fixAuthorAvatar() {
  console.log('🔧 Fixing HoleScale author avatar...\n');

  const { error } = await supabase
    .from('blog_authors')
    .update({
      avatar: '/favicon.svg'  // Use local path instead of absolute URL
    })
    .eq('id', HOLESCALE_AUTHOR_ID);

  if (error) {
    console.error('❌ Error updating avatar:', error.message);
    return;
  }

  console.log('✅ Avatar updated successfully!');
  console.log('   Changed from: https://holescale.com/favicon.svg');
  console.log('   Changed to: /favicon.svg');
}

fixAuthorAvatar();
