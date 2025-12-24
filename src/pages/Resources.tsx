import { useState } from 'react';
import { Download, FileText, User } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/marketing/sections/Hero';
import { CTA } from '@/components/marketing/sections/CTA';
import { DownloadModal } from '@/components/marketing/sections/DownloadModal';
import { generateCollectionPageSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackResourceDownload } from '@/lib/analytics';
import { usePageTracking } from '@/hooks/useAnalytics';

const Resources = () => {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Track page view
  usePageTracking({
    content_group1: 'Marketing',
    content_group2: 'Resources',
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'guides', label: 'Guides & Tutorials' },
    { id: 'insights', label: 'Industry Insights' },
    { id: 'tips', label: 'Procurement Tips' },
    { id: 'products', label: 'Product Spotlights' },
    { id: 'news', label: 'Company News' },
  ];

  const resources = [
    {
      id: 'packaging-guide',
      title: 'Ultimate Guide to Packaging Materials Procurement',
      category: 'guides',
      description: 'Comprehensive guide covering everything you need to know about sourcing packaging materials efficiently.',
      url: '/resources/packaging-guide.html',
    },
    {
      id: 'promo-checklist',
      title: 'Promotional Products Buyer\'s Checklist',
      category: 'guides',
      description: 'Essential checklist to ensure you get the best promotional products for your campaigns.',
      url: '/resources/promo-checklist.html',
    },
    {
      id: 'supplier-scorecard',
      title: 'Supplier Evaluation Scorecard Template',
      category: 'tips',
      description: 'Downloadable template to help you evaluate and compare suppliers systematically.',
      url: '/resources/supplier-scorecard.html',
    },
    {
      id: 'rfq-best-practices',
      title: 'RFQ Best Practices Guide',
      category: 'tips',
      description: 'Learn how to write effective RFQs that get you better quotes and faster responses.',
      url: '/resources/rfq-best-practices.html',
    },
  ];

  const articles = [
    {
      title: 'The Future of B2B Procurement',
      category: 'insights',
      excerpt: 'How technology is transforming how businesses source materials and products.',
      author: 'HoleScale Team',
      date: '2024-12-15',
      readTime: '5 min read',
    },
    {
      title: 'Sustainable Packaging Trends in 2025',
      category: 'insights',
      excerpt: 'Exploring the latest trends in eco-friendly packaging solutions.',
      author: 'HoleScale Team',
      date: '2024-12-10',
      readTime: '7 min read',
    },
    {
      title: '10 Tips for Better Supplier Relationships',
      category: 'tips',
      excerpt: 'Practical advice for building strong partnerships with your suppliers.',
      author: 'HoleScale Team',
      date: '2024-12-05',
      readTime: '4 min read',
    },
  ];

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || newsletterLoading) return;

    setNewsletterLoading(true);
    try {
      if (!supabase) {
        throw new Error('Newsletter service is not configured.');
      }
      const { error } = await supabase.functions.invoke('capture-lead', {
        body: {
          name: 'Newsletter Subscriber',
          email: newsletterEmail,
          company: null,
          resourceId: 'newsletter',
          resourceTitle: 'Newsletter Subscription',
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        },
      });

      if (error) {
        console.error('Newsletter subscription error:', error);
        toast.error('There was an issue subscribing. Please try again.');
      } else {
        toast.success('Thank you for subscribing!');
        setNewsletterEmail('');
      }
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      toast.error('There was an issue subscribing. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleDownload = async (data: { name: string; email: string; company?: string }) => {
    if (!selectedResource) return;
    
    const resource = resources.find(r => r.id === selectedResource);
    if (!resource) return;

    try {
      // Call the capture-lead edge function
      if (!supabase) {
        // Still allow download if supabase not configured
        window.open(resource.url, '_blank');
        setSelectedResource(null);
        return;
      }
      const { data: result, error } = await supabase.functions.invoke('capture-lead', {
        body: {
          name: data.name,
          email: data.email,
          company: data.company || null,
          resourceId: resource.id,
          resourceTitle: resource.title,
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        },
      });

      if (error) {
        console.error('Lead capture error:', error);
        // Still allow download even if lead capture fails
        toast.error('There was an issue saving your information, but your download will proceed.');
      } else {
        toast.success('Thank you! Your download is starting.');
      }

      // Track resource download
      trackResourceDownload(resource.title, resource.category || 'unknown', true);
    } catch (err) {
      console.error('Error capturing lead:', err);
      // Still allow download even if there's an error
      if (resource) {
        trackResourceDownload(resource.title, resource.category || 'unknown', true);
      }
    }
  };

  const collectionPageSchema = generateCollectionPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Resources", url: "https://www.holescale.com/resources" },
  ]);

  return (
    <>
      <SEO 
        title="Resources | HoleScale Blog, Guides & Industry Insights"
        description="Expert guides, industry insights, and procurement best practices from HoleScale. Learn about packaging materials, promotional products, and B2B sourcing strategies."
        canonical="https://www.holescale.com/resources"
        schema={[collectionPageSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="Resources & Insights"
        subheadline="Expert guides, industry trends, and procurement best practices"
        variant="centered"
      />

      {/* Category Filters */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Resource categories">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls={`category-${category.id}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Featured</h2>
          <div className="bg-card rounded-xl p-8 border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                Guides & Tutorials
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-4">Ultimate Guide to Packaging Materials Procurement</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Everything you need to know about sourcing packaging materials efficiently, from RFQ creation to supplier selection and order management.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>15 min read</span>
            </div>
            <Button onClick={() => {
              const element = document.getElementById('downloads');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}>
              Download Free Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={index} className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {categories.find(c => c.id === article.category)?.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides & Downloads */}
      <section id="downloads" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Free Guides & Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedResource(resource.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Free
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Curve</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Get procurement insights and industry updates delivered to your inbox
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground border border-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              aria-label="Email address for newsletter"
              required
            />
            <Button type="submit" variant="secondary" size="lg" disabled={newsletterLoading}>
              {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-sm mt-4 text-primary-foreground/80">
            Weekly insights. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Download Modal */}
      {selectedResource && (
        <DownloadModal
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          resourceTitle={resources.find(r => r.id === selectedResource)?.title || ''}
          resourceUrl={resources.find(r => r.id === selectedResource)?.url || ''}
          onSubmit={handleDownload}
        />
      )}

      <Footer />
    </>
  );
};

export default Resources;
