import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Pexels images - free for commercial use
// Format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop
const imageMapping = {
  // BUYER BLOGS
  'hidden-costs-custom-packaging-tooling-dies-setup-fees': {
    // Manufacturing/production line with machinery
    pexelsId: '1108117',
    alt: 'Custom packaging production line showing die cutting and manufacturing equipment'
  },
  'bulk-custom-mailer-boxes-pricing-moq-lead-time-guide': {
    // Stack of cardboard boxes
    pexelsId: '4553618',
    alt: 'Stack of custom printed mailer boxes ready for ecommerce shipping'
  },
  'eco-friendly-packaging-budget-materials-costs-certifications': {
    // Eco-friendly sustainable packaging materials
    pexelsId: '6069113',
    alt: 'Eco-friendly kraft paper packaging materials with bamboo and recycled cardboard'
  },
  'trade-show-swag-kits-order-timeline-checklist': {
    // Conference/trade show booth
    pexelsId: '2774556',
    alt: 'Trade show booth display with branded promotional products and swag kits'
  },
  'custom-subscription-box-packaging-size-guide-costs': {
    // Subscription box unboxing
    pexelsId: '4464482',
    alt: 'Custom printed subscription box with interior branded tissue paper and products'
  },
  'questions-ask-before-large-custom-packaging-promo-order': {
    // Business person reviewing documents/checklist
    pexelsId: '6476808',
    alt: 'Procurement professional reviewing packaging supplier quotes and contracts'
  },

  // SUPPLIER BLOGS
  'promotional-products-marketplace-roi-suppliers': {
    // Business analytics dashboard
    pexelsId: '669615',
    alt: 'Business ROI analytics dashboard showing marketplace performance metrics'
  },
  'eco-trends-margins-2025-buyer-demand-data-suppliers': {
    // Charts and data trends
    pexelsId: '590022',
    alt: 'Business trend charts showing sustainable packaging demand growth data'
  },
  'marketplace-vs-distributor-model-suppliers': {
    // Two paths/roads - decision making
    pexelsId: '1089846',
    alt: 'Business decision crossroads comparing marketplace vs traditional distribution models'
  },
  'marketplace-ready-product-data-sku-image-pricing-checklist': {
    // Product photography setup or spreadsheet
    pexelsId: '4386431',
    alt: 'Product data spreadsheet with SKUs, images, and pricing for marketplace listings'
  },
  'what-distributors-search-keyword-optimization-suppliers': {
    // Search/SEO concept
    pexelsId: '270637',
    alt: 'Search engine optimization concept with keyword research for product listings'
  },
  'marketplace-ads-90-day-playbook-suppliers': {
    // Digital marketing/advertising
    pexelsId: '265087',
    alt: 'Digital marketing dashboard showing marketplace advertising campaign performance'
  }
};

async function updateBlogImages() {
  console.log('🖼️  Updating blog images with Pexels photos...\n');

  let updated = 0;
  let errors = 0;

  for (const [slug, imageData] of Object.entries(imageMapping)) {
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

      console.log(`   Updating: ${post.title.substring(0, 60)}...`);

      // Construct Pexels URL
      const imageUrl = `https://images.pexels.com/photos/${imageData.pexelsId}/pexels-photo-${imageData.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop`;

      // Update with Pexels image
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          featured_image: {
            src: imageUrl,
            alt: imageData.alt
          }
        })
        .eq('id', post.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`   ✅ Updated with Pexels photo ${imageData.pexelsId}\n`);
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
    console.log('🎉 All blog images updated with Pexels photos!');
    console.log('   All images are free for commercial use');
  }
}

updateBlogImages();
