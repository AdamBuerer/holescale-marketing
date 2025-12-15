import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  DollarSign,
  FileText,
  Shield,
  MessageSquare,
  Package,
  CreditCard,
  Clock,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/marketing/sections/Hero';
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid';
import { StepTimeline } from '@/components/marketing/sections/StepTimeline';
import { Testimonials } from '@/components/marketing/sections/Testimonials';
import { PersonaTabs } from '@/components/marketing/sections/PersonaTabs';
import { DifferentiationSection } from '@/components/marketing/sections/DifferentiationSection';
import { IntegrationHighlights } from '@/components/marketing/sections/IntegrationHighlights';
import { FooterCTA } from '@/components/marketing/sections/FooterCTA';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { TrustBadges } from '@/components/marketing/TrustBadges';
import { generateOrganizationSchema, generateWebSiteSchema, generateSoftwareApplicationSchema } from '@/lib/schema';

const Home = () => {
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);

  const openWaitlistDialog = () => {
    setWaitlistDialogOpen(true);
  };

  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const softwareAppSchema = generateSoftwareApplicationSchema({
    description: 'B2B packaging marketplace connecting buyers with verified packaging suppliers. Get competitive quotes for corrugated boxes, mailers, labels, and custom packaging in 24-48 hours. Free for buyers.',
    features: [
      'RFQ Management',
      'Verified Supplier Network',
      'Competitive Bidding',
      'Quote Comparison',
      'Real-time Communication',
      'Order Tracking',
      'Secure Payments',
    ],
  });

  return (
    <>
      <SEO
        title="HoleScale | B2B Packaging Materials Marketplace"
        description="Connect with verified packaging suppliers. Get competitive quotes for corrugated boxes, mailers, labels, and custom packaging in 24-48 hours. Free for buyers."
        canonical="https://www.holescale.com/"
        schema={[organizationSchema, websiteSchema, softwareAppSchema]}
      />

      <Navigation />

      {/* Hero Section */}
      <Hero
        headline={
          <>
            Streamline Your{' '}
            {/* Mobile: Line break + Full Gradient Phrase */}
            <span className="md:hidden block mt-1">
              <span className="text-accent bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Packaging Procurement
              </span>
            </span>

            {/* Desktop: Inline Packaging + Gradient Procurement */}
            <span className="hidden md:inline">
              Packaging <span className="text-accent bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Procurement</span>
            </span>
          </>
        }
        subheadline="Connect directly with verified packaging suppliers. Get competitive quotes in 24-48 hours."
        additionalText="Suppliers: Get qualified leads from buyers ready to order."
        customCTA={
          <>
            <Button
              size="lg"
              onClick={openWaitlistDialog}
              className="text-sm md:text-base px-8 md:px-10 py-3 md:py-6 h-auto w-full sm:w-auto"
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-sm md:text-base px-6 md:px-8 py-3 md:py-6 h-auto w-full sm:w-auto"
            >
              <Link to="/how-it-works" className="inline-flex items-center justify-center gap-2">
                See How It Works
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </Button>
          </>
        }
        trustIndicators={[
          "Launching Q1 2025",
          "Free to Join"
        ]}
        backgroundImage={{
          src: "/images/kraft-bg.jpg",
          alt: "Soft beige gradient background"
        }}
        floatingImage={{
          src: "/images/cutout-products.png",
          alt: "Custom packaging materials including corrugated boxes, mailers, poly bags, and shipping supplies"
        }}
      />

      {/* Waitlist Dialog */}
      <WaitlistDialog
        open={waitlistDialogOpen}
        onOpenChange={setWaitlistDialogOpen}
        defaultRole="both"
      />

      {/* Introduction */}
      <section className="py-8 sm:py-10 md:py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            HoleScale is a <strong className="text-foreground">B2B packaging materials marketplace</strong> connecting buyers with verified packaging suppliers. Whether you're sourcing <strong className="text-foreground">corrugated boxes</strong>, <strong className="text-foreground">poly mailers</strong>, <strong className="text-foreground">food-grade containers</strong>, <strong className="text-foreground">shipping supplies</strong>, or <strong className="text-foreground">sustainable packaging</strong>, our platform streamlines procurement with competitive quotes, transparent pricing, and verified supplier networks.
          </p>
          <TrustBadges variant="compact" className="mt-6" />
        </div>
      </section>

      {/* Value Proposition Metrics Bar */}
      <section className="py-8 sm:py-10 md:py-12 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Speed Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    Quotes in &lt;48 Hours
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    7x faster than the industry standard of 2 weeks.
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-16 bg-slate-300 dark:bg-slate-700"></div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-px h-16 bg-slate-300 dark:bg-slate-700"></div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    15-20% Cost Reduction
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Free access to competitive bidding that drives prices down.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    Zero-Risk Sourcing
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We pre-vet suppliers so you only deal with the top 1%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Procurement Shouldn't Be This Hard</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3 sm:mb-4">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Price Opacity</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Tired of unclear pricing, hidden MOQs, and endless back-and-forth emails?
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Fragmented Market</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Juggling dozens of supplier portals and spreadsheets?
              </p>
            </div>

            <div className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Quality Uncertainty</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Worried about supplier reliability and product quality?
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-lg sm:text-xl text-muted-foreground">
              HoleScale brings it all together in one platform.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (Brief) */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Simple. Streamlined. Scalable.</h2>
          </div>

          <StepTimeline
            steps={[
              {
                number: 1,
                title: "Post Your Requirements",
                description: "Submit RFQs with specifications, quantities, lead times, and deadlines",
              },
              {
                number: 2,
                title: "Receive Competitive Quotes",
                description: "Verified suppliers compete for your business with transparent pricing and MOQs",
              },
              {
                number: 3,
                title: "Compare & Order",
                description: "Review proposals, select the best fit, and manage everything in one place",
              },
            ]}
            orientation="horizontal"
          />

          <div className="text-center mt-8 sm:mt-12">
            <Button asChild size="lg" className="min-h-[44px] text-sm sm:text-base px-6 sm:px-8">
              <Link to="/waitlist">Get Early Access</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Leading Businesses Choose HoleScale</h2>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Verified Suppliers",
                description: "Every supplier vetted for quality and reliability",
              },
              {
                icon: <DollarSign className="w-6 h-6 text-primary" />,
                title: "Transparent Pricing",
                description: "Compare quotes side-by-side, no hidden fees",
              },
              {
                icon: <FileText className="w-6 h-6 text-primary" />,
                title: "Streamlined RFQs",
                description: "AI-assisted request creation in minutes, not hours",
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: "Real-Time Communication",
                description: "Chat, calls, and file sharing in one place",
              },
              {
                icon: <Package className="w-6 h-6 text-primary" />,
                title: "Order Management",
                description: "Track every order from quote to delivery",
              },
              {
                icon: <CreditCard className="w-6 h-6 text-primary" />,
                title: "Secure Payments",
                description: "Protected transactions with milestone-based options",
              },
            ]}
            columns={3}
          />

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base hover:gap-3 transition-all min-h-[44px]">
              See all platform features
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Built for Your Needs - Enhanced Tabs */}
      <PersonaTabs
        onBuyerCTA={() => openWaitlistDialog()}
        onSupplierCTA={() => openWaitlistDialog()}
      />

      {/* Why HoleScale - Differentiation */}
      <DifferentiationSection />

      {/* Integrations */}
      <IntegrationHighlights />

      {/* Market Opportunity Callout */}
      <section className="py-8 sm:py-10 md:py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            HoleScale addresses the <strong className="text-foreground">$107 billion</strong> US packaging materials market with modern procurement technology — connecting businesses with verified suppliers for corrugated, flexible, and specialty packaging.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">What Our Early Users Are Saying</h2>
          </div>

          <Testimonials
            testimonials={[
              {
                quote: "Finally, a platform that makes sourcing packaging simple. We got three competitive quotes in under 48 hours.",
                author: "Sarah Johnson",
                title: "Marketing Director",
                company: "E-commerce Brand",
                rating: 5,
                persona: 'buyer',
              },
              {
                quote: "The leads we get through HoleScale are qualified buyers ready to order, not just browsers wasting our time.",
                author: "Mike Chen",
                title: "Sales Manager",
                company: "Packaging Manufacturer",
                rating: 5,
                persona: 'supplier',
              },
              {
                quote: "HoleScale has transformed how we source packaging. The transparency and speed are unmatched — we cut our procurement time by 70%.",
                author: "Emily Rodriguez",
                title: "Operations Manager",
                company: "E-commerce Fulfillment",
                rating: 5,
                persona: 'buyer',
              },
            ]}
          />
        </div>
      </section>

      {/* Waitlist Signup Section (Primary Conversion) */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be First in Line When We Launch</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Be first in line when we launch. Early members get exclusive benefits.
          </p>

          <div className="bg-card rounded-xl p-8 border max-w-2xl mx-auto text-foreground text-left">
            <WaitlistForm />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Dual Persona */}
      <FooterCTA
        onBuyerCTA={openWaitlistDialog}
        onSupplierCTA={openWaitlistDialog}
      />

      <Footer />
    </>
  );
};

export default Home;
