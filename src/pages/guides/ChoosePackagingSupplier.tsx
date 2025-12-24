import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Search, FileText, Shield, DollarSign, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { generateArticleSchema } from '@/lib/schema';

const ChoosePackagingSupplier = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.holescale.com/' },
    { name: 'Guides', url: 'https://www.holescale.com/resources' },
    { name: 'How to Choose the Right Packaging Supplier', url: 'https://www.holescale.com/guides/choose-packaging-supplier' },
  ]);

  const articleSchema = generateArticleSchema({
    headline: 'How to Choose the Right Packaging Supplier for Your CPG Brand',
    description: 'A comprehensive guide to selecting the right packaging supplier for your CPG brand, including evaluation criteria, questions to ask, and red flags to avoid.',
    author: 'HoleScale Team',
    datePublished: '2024-12-01',
    dateModified: '2024-12-01',
    image: 'https://www.holescale.com/og-image.png',
  });

  return (
    <>
      <SEO
        title="How to Choose the Right Packaging Supplier for Your CPG Brand | HoleScale Guide"
        description="Learn how to choose the right packaging supplier for your CPG brand. This comprehensive guide covers evaluation criteria, questions to ask, certifications to verify, and red flags to avoid when selecting packaging suppliers."
        keywords="choose packaging supplier, CPG packaging supplier, packaging supplier selection, how to find packaging suppliers, packaging supplier evaluation, B2B packaging procurement"
        canonical="https://www.holescale.com/guides/choose-packaging-supplier"
        schema={[breadcrumbSchema, articleSchema]}
      />

      <Navigation />

      <article className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Home</Link>
              {' / '}
              <Link to="/resources" className="hover:text-foreground">Resources</Link>
              {' / '}
              <span>How to Choose the Right Packaging Supplier</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to Choose the Right Packaging Supplier for Your CPG Brand
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Selecting the right packaging supplier is critical for CPG brands. This guide covers everything you need to know to make an informed decision, from evaluation criteria to questions you should ask.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>By HoleScale Team</span>
              <span>•</span>
              <time dateTime="2024-12-01">December 1, 2024</time>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choosing the Right Packaging Supplier Matters</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For CPG brands, your packaging supplier is more than just a vendor — they're a critical partner in your supply chain. The right <strong>packaging supplier</strong> can help you reduce costs, improve product quality, ensure compliance, and scale your operations. The wrong choice can lead to production delays, quality issues, compliance problems, and increased costs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're sourcing <strong>corrugated boxes</strong> for retail products, <strong>flexible packaging</strong> for food items, or <strong>custom packaging</strong> for specialty products, this guide will help you evaluate and select the best supplier for your needs.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Evaluation Criteria</h2>
              
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">Quality and Reliability</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Assess the supplier's track record for consistent quality. Look for:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Certifications (ISO, FSC, FDA compliance for food packaging)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Quality control processes and testing procedures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Customer references and case studies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Defect rates and quality metrics</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-start gap-4">
                    <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">Pricing and MOQs</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Understand the supplier's pricing structure:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Transparent pricing with no hidden fees</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Minimum order quantities (MOQs) that align with your needs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Volume discounts and pricing tiers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Total cost of ownership (including shipping, setup fees)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6 border">
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">Lead Times and Capacity</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Evaluate the supplier's ability to meet your timeline:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Standard lead times for your product type</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Rush order capabilities and expedited options</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Production capacity and scalability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>On-time delivery track record</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions to Ask Potential Suppliers</h2>
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Business and Experience</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• How long have you been in business?</li>
                  <li>• What industries do you primarily serve?</li>
                  <li>• Can you provide customer references in my industry?</li>
                  <li>• What's your annual production capacity?</li>
                </ul>
              </div>

              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Product and Quality</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• What certifications do you hold (ISO, FSC, FDA, etc.)?</li>
                  <li>• What quality control processes do you have in place?</li>
                  <li>• Can you provide samples before placing an order?</li>
                  <li>• What's your typical defect rate?</li>
                  <li>• Do you offer custom packaging solutions?</li>
                </ul>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Logistics and Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• What are your standard lead times?</li>
                  <li>• Do you offer rush orders? What are the additional costs?</li>
                  <li>• What shipping options do you provide?</li>
                  <li>• How do you handle order tracking and communication?</li>
                  <li>• What's your return/refund policy?</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Red Flags to Watch For</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Unclear or Hidden Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      If a supplier is reluctant to provide transparent pricing or has many hidden fees, proceed with caution.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">No Certifications or Quality Processes</h3>
                    <p className="text-sm text-muted-foreground">
                      For food packaging, FDA compliance is essential. For sustainable packaging, look for FSC or other relevant certifications.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Poor Communication or Responsiveness</h3>
                    <p className="text-sm text-muted-foreground">
                      If a supplier is slow to respond during the sales process, they may be even slower after you place an order.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Unrealistic Promises</h3>
                    <p className="text-sm text-muted-foreground">
                      Be wary of suppliers who promise extremely low prices or impossibly fast lead times without justification.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Using a B2B Packaging Marketplace</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Platforms like HoleScale simplify the supplier selection process by:
              </p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Pre-vetting suppliers</strong> for quality and reliability, so you only see verified options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Transparent pricing</strong> from multiple suppliers, making comparison easy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Supplier ratings and reviews</strong> from other buyers to inform your decision</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Faster quote turnaround</strong> — get multiple quotes in 24-48 hours instead of weeks</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                By posting a request for quote (RFQ) on a marketplace, you can compare multiple <strong>packaging suppliers</strong> simultaneously, saving time and ensuring you get competitive pricing.
              </p>
            </section>

            <section className="mb-12 bg-primary/5 rounded-xl p-8 border border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Choosing the right packaging supplier requires careful evaluation of quality, pricing, capacity, and reliability. By asking the right questions, verifying certifications, and using tools like B2B marketplaces to compare options, you can find a supplier that meets your CPG brand's needs and helps you scale successfully.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/waitlist">Find Verified Packaging Suppliers</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/suppliers">Browse Supplier Directory</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
};

export default ChoosePackagingSupplier;

