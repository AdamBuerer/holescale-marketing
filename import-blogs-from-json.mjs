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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🚀 Importing Blog Posts to HoleScale\n');

async function importBlogs() {
  // Read JSON files
  const buyerBlogs = JSON.parse(
    readFileSync(join(__dirname, '1files', 'buyer-blogs.json'), 'utf-8')
  );
  const supplierBlogs = JSON.parse(
    readFileSync(join(__dirname, '1files', 'supplier-blogs.json'), 'utf-8')
  );

  const allBlogs = [...buyerBlogs.blogs, ...supplierBlogs.blogs];

  console.log(`📊 Found ${allBlogs.length} blog posts to import\n`);

  let imported = 0;
  let errors = 0;

  for (const blog of allBlogs) {
    try {
      console.log(`   Importing: ${blog.title}...`);

      // Calculate read time
      const readTime = Math.ceil(blog.estimated_word_count / 200);

      // Insert blog post
      const { data: post, error: postError } = await supabase
        .from('blog_posts')
        .insert({
          slug: blog.slug,
          title: blog.title,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
          content_html: blog.content_html,
          excerpt: blog.meta_description, // Use meta description as excerpt
          category: blog.category,
          persona: blog.persona,
          funnel_stage: blog.funnel_stage,
          target_keywords: blog.target_keywords,
          schema_type: blog.schema_type,
          featured_image_alt: blog.featured_image_alt,
          publish_status: 'published',
          published_at: new Date().toISOString(),
          estimated_word_count: blog.estimated_word_count,
          read_time_minutes: readTime,
        })
        .select()
        .single();

      if (postError) {
        if (postError.code === '23505') {
          // Duplicate slug - update instead
          console.log(`   ⚠️  Post exists, updating...`);
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({
              title: blog.title,
              meta_title: blog.meta_title,
              meta_description: blog.meta_description,
              content_html: blog.content_html,
              excerpt: blog.meta_description,
              category: blog.category,
              persona: blog.persona,
              funnel_stage: blog.funnel_stage,
              target_keywords: blog.target_keywords,
              estimated_word_count: blog.estimated_word_count,
              read_time_minutes: readTime,
            })
            .eq('slug', blog.slug);

          if (updateError) throw updateError;

          // Get the updated post for links
          const { data: existingPost } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', blog.slug)
            .single();

          post = existingPost;
        } else {
          throw postError;
        }
      }

      // Insert internal links
      if (blog.internal_links && blog.internal_links.length > 0 && post) {
        // Delete existing links first
        await supabase
          .from('blog_internal_links')
          .delete()
          .eq('blog_post_id', post.id);

        // Insert new links
        const links = blog.internal_links.map(link => ({
          blog_post_id: post.id,
          anchor_text: link.anchor,
          target_url: link.url,
        }));

        const { error: linksError } = await supabase
          .from('blog_internal_links')
          .insert(links);

        if (linksError) {
          console.log(`   ⚠️  Could not insert links: ${linksError.message}`);
        }
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
  console.log(`   Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');

  if (imported > 0) {
    console.log('🎉 Blog posts imported successfully!');
    console.log('\nNext steps:');
    console.log('1. Visit /blog to see your blog index');
    console.log('2. Visit /blog/[slug] to see individual posts');
    console.log('3. Update featured images for each post\n');
  }
}

importBlogs().catch(console.error);
