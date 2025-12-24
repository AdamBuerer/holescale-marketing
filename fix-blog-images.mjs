import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Map of slugs to real Unsplash photo IDs for packaging/business images
const imageMapping = {
  'hidden-costs-custom-packaging-tooling-dies-setup-fees': 'photo-1587293852726-70cdb56c2866', // Manufacturing/tools
  'bulk-custom-mailer-boxes-pricing-moq-lead-time-guide': 'photo-1578575437130-527eed3abbec', // Cardboard boxes
  'eco-friendly-packaging-budget-materials-costs-certifications': 'photo-1532996122724-e3c354a0b15b', // Sustainable/eco materials
  'trade-show-swag-kits-order-timeline-checklist': 'photo-1540575467063-178a50c2df87', // Conference/trade show
  'custom-subscription-box-packaging-size-guide-costs': 'photo-1607083206869-4c7672e72a8a', // Subscription box
  'questions-ask-before-large-custom-packaging-promo-order': 'photo-1454165804606-c3d57bc86b40', // Business planning/checklist
  'promotional-products-marketplace-roi-suppliers': 'photo-1460925895917-afdab827c52f', // Business analytics/ROI
  'eco-trends-margins-2025-buyer-demand-data-suppliers': 'photo-1559827260-dc66d52bef19', // Trends/data
  'marketplace-vs-distributor-model-suppliers': 'photo-1556155092-490a1ba16284', // Business comparison
  'marketplace-ready-product-data-sku-image-pricing-checklist': 'photo-1551288049-bebda4e38f71', // Data/spreadsheet
  'what-distributors-search-keyword-optimization-suppliers': 'photo-1432888498266-38ffec3eaf0a', // Search/SEO
  'marketplace-ads-90-day-playbook-suppliers': 'photo-1533750349088-cd871a92f312' // Digital marketing/ads
};

async function fixBlogImages() {
  console.log('🖼️  Updating blog featured images...\n');

  let updated = 0;
  let errors = 0;

  for (const [slug, photoId] of Object.entries(imageMapping)) {
    try {
      // Get the post
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, featured_image')
        .eq('slug', slug)
        .single();

      if (fetchError || !post) {
        console.log(`   ⏭️  Skipping ${slug} (not found)`);
        continue;
      }

      console.log(`   Updating: ${post.title}...`);

      // Update with real Unsplash URL
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          featured_image: {
            ...post.featured_image,
            src: `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop`
          }
        })
        .eq('id', post.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ Updated successfully\n`);
      updated++;
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log('\n============================================================');
  console.log('📊 Update Summary:');
  console.log(`   Total: ${Object.keys(imageMapping).length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);
  console.log('============================================================\n');

  if (updated > 0) {
    console.log('🎉 Blog images updated successfully!');
  }
}

fixBlogImages();
