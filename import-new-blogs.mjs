#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key to bypass RLS for imports
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Service role key not found, using anon key (may fail due to RLS)');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Importing New Blog Posts to HoleScale\n');

async function importBlogs() {
  // Read JSON files - try multiple possible locations
  const possiblePaths = [
    {
      buyer: '/Users/adambuerer/Downloads/1files/buyer-blogs.json',
      supplier: '/Users/adambuerer/Downloads/1files/supplier-blogs.json'
    },
    {
      buyer: join(__dirname, '1files', 'buyer-blogs.json'),
      supplier: join(__dirname, '1files', 'supplier-blogs.json')
    },
    {
      buyer: join(__dirname, '..', 'Downloads', '1files', 'buyer-blogs.json'),
      supplier: join(__dirname, '..', 'Downloads', '1files', 'supplier-blogs.json')
    }
  ];

  let buyerBlogs, supplierBlogs;
  let foundFiles = false;

  for (const paths of possiblePaths) {
    try {
      buyerBlogs = JSON.parse(readFileSync(paths.buyer, 'utf-8'));
      supplierBlogs = JSON.parse(readFileSync(paths.supplier, 'utf-8'));
      foundFiles = true;
      console.log(`✅ Found blog files at: ${paths.buyer}\n`);
      break;
    } catch (err) {
      // Try next path
      continue;
    }
  }

  if (!foundFiles) {
    console.error('❌ Could not find blog JSON files in any expected location');
    process.exit(1);
  }

  const allBlogs = [...buyerBlogs.blogs, ...supplierBlogs.blogs];

  console.log(`📊 Found ${allBlogs.length} blog posts to import\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  // Get default author ID (use first available author)
  const { data: authors } = await supabase
    .from('authors')
    .select('id')
    .limit(1);

  const defaultAuthorId = authors?.[0]?.id || null;

  // Get or create category IDs
  const categoryMap = {
    'Buyer Education': null,
    'Supplier Education': null,
  };

  for (const categoryName of Object.keys(categoryMap)) {
    const { data: existingCat } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (existingCat) {
      categoryMap[categoryName] = existingCat.id;
    } else {
      // Create category
      const { data: newCat } = await supabase
        .from('blog_categories')
        .insert({
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/ /g, '-'),
          description: `${categoryName} articles and guides`,
        })
        .select('id')
        .single();

      categoryMap[categoryName] = newCat?.id;
    }
  }

  for (const blog of allBlogs) {
    try {
      // Check if slug already exists
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id, slug')
        .eq('slug', blog.slug)
        .single();

      if (existingPost) {
        console.log(`   ⏭️  Skipping "${blog.title}" (slug already exists)`);
        skipped++;
        continue;
      }

      console.log(`   Importing: ${blog.title}...`);

      // Map JSON structure to existing database schema
      const postData = {
        slug: blog.slug,
        title: blog.title,
        subtitle: blog.meta_description?.substring(0, 200) || '', // Use meta description as subtitle
        excerpt: blog.meta_description || '',
        content: blog.content_html, // content field (not content_html)
        featured_image: {
          src: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000000000000)}?w=1200&h=630&fit=crop`,
          alt: blog.featured_image_alt || blog.title
        },
        author_id: defaultAuthorId,
        category_id: categoryMap[blog.category] || null,
        content_type: blog.funnel_stage === 'Top' ? 'article' : 'guide',
        status: 'draft',  // Insert as draft first to avoid trigger issues
        is_featured: false,
        reading_time: Math.ceil(blog.estimated_word_count / 200),
        word_count: blog.estimated_word_count,
        table_of_contents: [], // Will be populated by UI if needed
        seo: {
          metaTitle: blog.meta_title,
          metaDescription: blog.meta_description,
          keywords: blog.target_keywords || [],
          canonicalUrl: `https://holescale.com/blog/${blog.slug}`,
          ogImage: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000000000000)}?w=1200&h=630&fit=crop`
        },
        views: 0,
        likes: 0,
        comments_count: 0,
        shares: 0,
        published_at: new Date().toISOString(),
      };

      const { data: newPost, error: insertError } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log(`   ✅ Imported successfully\n`);
      imported++;
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Import Summary:`);
  console.log(`   Total: ${allBlogs.length}`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped: ${skipped} (already exist)`);
  console.log(`   Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');

  if (imported > 0) {
    console.log('🎉 New blog posts imported successfully!');
    console.log('\nYou now have ' + (12 + imported) + ' total blog posts!\n');
    console.log('Next steps:');
    console.log('1. Visit /blog to see all your posts');
    console.log('2. Update featured images for new posts');
    console.log('3. Assign proper authors to posts\n');
  } else if (skipped === allBlogs.length) {
    console.log('ℹ️  All blog posts already exist in database.');
  }
}

importBlogs().catch(console.error);
