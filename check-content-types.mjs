import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContentTypes() {
  console.log('Checking distinct content_type values in blog_posts...\n');

  // Get all distinct content_type values
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('content_type');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  const uniqueTypes = [...new Set(posts.map(p => p.content_type))];
  console.log('Distinct content_type values found:');
  console.log(uniqueTypes);
  console.log('\nCount by type:');
  uniqueTypes.forEach(type => {
    const count = posts.filter(p => p.content_type === type).length;
    console.log(`  ${type}: ${count} posts`);
  });
}

checkContentTypes();
