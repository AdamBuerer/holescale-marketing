import { Helmet } from 'react-helmet-async';
import { Mail, Download, TrendingUp, Users, DollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";

const Investors = () => {
  useMarketingPageShell({ className: "space-y-16" });
  return (
    <>
      <Helmet>
        <title>Investors - HoleScale | B2B Marketplace Investment Opportunity</title>
        <meta name="description" content="HoleScale is raising pre-seed funding to build the leading B2B marketplace for wholesale packaging materials and promotional products. $850B market opportunity." />
        <meta name="keywords" content="B2B marketplace investment, wholesale marketplace startup, packaging industry investment, supply chain technology, B2B SaaS investment, marketplace funding, promotional products platform" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://holescale.com/investors" />
        <meta property="og:title" content="Invest in HoleScale - B2B Marketplace for Wholesale Sourcing" />
        <meta property="og:description" content="Join us in building the future of B2B wholesale sourcing. $500K pre-seed round." />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://holescale.com/investors" />
        <meta property="twitter:title" content="Invest in HoleScale - B2B Marketplace Investment" />
        <meta property="twitter:description" content="Building the leading B2B marketplace for wholesale packaging. $850B market opportunity." />
        
        <link rel="canonical" href="https://holescale.com/investors" />
      </Helmet>

      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-16 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src="/images/hero-investors.jpg" 
              alt="Modern startup team collaborating in office workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background/95" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Investment Opportunity
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Investing in the Future of
              <span className="block text-primary">B2B Wholesale Sourcing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              HoleScale is transforming how businesses source packaging materials and promotional products. 
              Join us in building the marketplace infrastructure for wholesale manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = 'mailto:adam@holescale.com'}>
                <Mail className="mr-2 h-5 w-5" />
                Contact Investor Relations
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Download Pitch Deck
              </Button>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The Opportunity</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Market Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$850B</div>
                  <p className="text-muted-foreground">
                    Global packaging market growing at 4.2% CAGR, reaching $1.2T by 2028
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Target Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">33M</div>
                  <p className="text-muted-foreground">
                    Small and medium businesses in the US alone need packaging and promotional products
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Problem We Solve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$12B</div>
                  <p className="text-muted-foreground">
                    Wasted annually on inefficient sourcing, multiple middlemen, and manual RFQ processes
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Why Now?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>E-commerce growth driving demand for custom packaging (28% YoY growth)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Fragmented $850B market with no dominant digital platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Supply chain digitization accelerated by pandemic - businesses expect modern solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>SMBs underserved by existing B2B marketplaces focused on large enterprises</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Our Solution */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Solution</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                HoleScale is a B2B marketplace connecting buyers with verified packaging and promotional 
                product suppliers through a modern, streamlined platform.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card>
                  <CardHeader>
                    <CardTitle>For Buyers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Post RFQs to multiple suppliers instantly</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Compare quotes in real-time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Access pre-vetted suppliers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Integrated payment & escrow</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>For Suppliers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Access qualified leads automatically</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Showcase capabilities & certifications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Streamlined quoting process</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Built-in order management</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Traction & Metrics */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Current Traction</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">Pre-Launch</div>
                  <p className="text-sm text-muted-foreground">Platform Status</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <p className="text-sm text-muted-foreground">Suppliers in Pipeline</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">$500K</div>
                  <p className="text-sm text-muted-foreground">Raising Pre-Seed</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">Q1 2026</div>
                  <p className="text-sm text-muted-foreground">Launch Target</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">12-Month Roadmap</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      Q1
                    </div>
                    <div>
                      <div className="font-semibold">Platform Launch</div>
                      <p className="text-sm text-muted-foreground">Launch with 50 verified suppliers, 200 buyer signups</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      Q2
                    </div>
                    <div>
                      <div className="font-semibold">Scale & Optimize</div>
                      <p className="text-sm text-muted-foreground">Reach $100K GMV, expand to 150 suppliers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      Q3
                    </div>
                    <div>
                      <div className="font-semibold">Market Expansion</div>
                      <p className="text-sm text-muted-foreground">Add new product categories, reach $300K monthly GMV</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      Q4
                    </div>
                    <div>
                      <div className="font-semibold">Series A Prep</div>
                      <p className="text-sm text-muted-foreground">Achieve $1M ARR, prepare for Series A fundraise</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Business Model */}
        <section className="container mx-auto px-4 py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Business Model</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Streams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold mb-1">Transaction Fees</div>
                    <p className="text-sm text-muted-foreground">1.5-5% of GMV (tiered by subscription)</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">SaaS Subscriptions</div>
                    <p className="text-sm text-muted-foreground">$49-$499/month for buyers and suppliers</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Premium Features</div>
                    <p className="text-sm text-muted-foreground">Enhanced listings, analytics, priority support</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Payment Processing</div>
                    <p className="text-sm text-muted-foreground">Additional 0.5% on integrated payments</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unit Economics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold mb-1">CAC (Customer Acquisition)</div>
                    <p className="text-sm text-muted-foreground">Target: $150 per buyer, $300 per supplier</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">LTV (Lifetime Value)</div>
                    <p className="text-sm text-muted-foreground">Projected: $2,400 per buyer (3-year)</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">LTV:CAC Ratio</div>
                    <p className="text-sm text-muted-foreground">Target: 16:1 at scale</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Gross Margin</div>
                    <p className="text-sm text-muted-foreground">85%+ (software business)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Team */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The Team</h2>
            
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground mb-6">
                  Led by experienced entrepreneurs with deep domain expertise in B2B marketplaces, 
                  supply chain, and software development.
                </p>
                <div className="text-center">
                  <Button size="lg" variant="outline" onClick={() => window.location.href = 'mailto:adam@holescale.com'}>
                    Request Full Team Bios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-4xl font-bold mb-6">
              Join Us in Building the Future
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              We're raising $500K in pre-seed funding to scale operations, expand our supplier network, 
              and capture market share in the $850B packaging industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = 'mailto:adam@holescale.com'}>
                <Mail className="mr-2 h-5 w-5" />
                Schedule a Meeting
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <Download className="mr-2 h-5 w-5" />
                Download Investor Deck
              </Button>
            </div>
            
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm opacity-75 mb-2">For investor inquiries:</p>
              <a href="mailto:adam@holescale.com" className="text-lg font-semibold hover:underline">
                adam@holescale.com
              </a>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="sr-only">
          <h2>Investment Opportunity in B2B Marketplace</h2>
          <p>
            HoleScale offers investment opportunities in the B2B wholesale marketplace sector. 
            Our platform connects packaging suppliers with businesses seeking promotional products, 
            custom mailer boxes, and wholesale packaging materials. We're currently raising pre-seed 
            funding to expand our marketplace infrastructure and grow our network of verified suppliers.
          </p>
          <p>
            Keywords: B2B marketplace investment, wholesale marketplace startup, packaging industry 
            investment opportunity, supply chain technology investment, B2B SaaS investment, 
            marketplace startup funding, promotional products marketplace, wholesale sourcing platform
          </p>
        </section>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "HoleScale",
            "url": "https://holescale.com",
            "logo": "https://holescale.com/logo.png",
            "description": "B2B marketplace for wholesale packaging materials and promotional products",
            "foundingDate": "2025",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Investor Relations",
              "email": "adam@holescale.com",
              "areaServed": "US",
              "availableLanguage": "English"
            }
          })}
        </script>
      </div>

      <Footer />
    </>
  );
};

export default Investors;
