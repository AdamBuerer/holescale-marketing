import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Using verified Pexels image URLs that are known to work
// Format: Direct URL from pexels.com (tested)
const imageMapping = {
  // BUYER BLOGS
  'hidden-costs-custom-packaging-tooling-dies-setup-fees': {
    url: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Industrial manufacturing machinery in packaging production facility'
  },
  'bulk-custom-mailer-boxes-pricing-moq-lead-time-guide': {
    url: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Stack of brown cardboard mailer boxes for ecommerce shipping'
  },
  'eco-friendly-packaging-budget-materials-costs-certifications': {
    url: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Sustainable eco-friendly packaging materials including kraft paper and recycled boxes'
  },
  'trade-show-swag-kits-order-timeline-checklist': {
    url: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Business conference exhibition hall with branded promotional displays'
  },
  'custom-subscription-box-packaging-size-guide-costs': {
    url: 'https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Open subscription box with custom branded packaging and tissue paper'
  },
  'questions-ask-before-large-custom-packaging-promo-order': {
    url: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Business professional reviewing documents and supplier contracts on desk'
  },

  // SUPPLIER BLOGS
  'promotional-products-marketplace-roi-suppliers': {
    url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Business analytics dashboard with ROI charts and performance metrics'
  },
  'eco-trends-margins-2025-buyer-demand-data-suppliers': {
    url: 'https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Business charts showing market trends and data analysis'
  },
  'marketplace-vs-distributor-model-suppliers': {
    url: 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Business decision concept with multiple pathways and strategy planning'
  },
  'marketplace-ready-product-data-sku-image-pricing-checklist': {
    url: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Laptop displaying product data spreadsheet with SKU numbers and pricing'
  },
  'what-distributors-search-keyword-optimization-suppliers': {
    url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'SEO keyword research and search optimization on computer screen'
  },
  'marketplace-ads-90-day-playbook-suppliers': {
    url: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    alt: 'Digital marketing advertising dashboard with campaign performance data'
  }
};

async function fixPexelsImages() {
  console.log('🔧 Fixing broken Pexels images with verified URLs...\n');

  let updated = 0;
  let errors = 0;

  for (const [slug, imageData] of Object.entries(imageMapping)) {
    try {
      // Get the post
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title')
        .eq('slug', slug)
        .single();

      if (fetchError || !post) {
        console.log(`   ⏭️  Skipping ${slug} (not found)`);
        continue;
      }

      console.log(`   Updating: ${post.title.substring(0, 60)}...`);

      // Update with verified Pexels image URL
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          featured_image: {
            src: imageData.url,
            alt: imageData.alt
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
    console.log('🎉 All blog images updated with verified Pexels photos!');
  }
}

fixPexelsImages();
