import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthorSchema() {
  console.log('Checking blog_authors table schema...\n');

  const { data: authors, error } = await supabase
    .from('blog_authors')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  if (authors && authors.length > 0) {
    console.log('Columns in blog_authors:');
    console.log(Object.keys(authors[0]).join(', '));
    console.log('\nSample author:');
    console.log(JSON.stringify(authors[0], null, 2));
  }
}

checkAuthorSchema();
