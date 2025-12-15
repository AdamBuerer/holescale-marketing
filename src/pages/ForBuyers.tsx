import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Search, FileText, ShoppingCart, TrendingDown, Shield, Clock, Zap, Palette } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";
import { TLDRBlock } from '@/components/ui/TLDRBlock';
import { generateBreadcrumbSchema } from '@/lib/schema';

const ForBuyers = () => {
  useMarketingPageShell();
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);

  const openWaitlistDialog = () => {
    setWaitlistDialogOpen(true);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://holescale.com' },
    { name: 'For Buyers' },
  ]);

  return (
    <>
      <SEO
        title="For Buyers | HoleScale — Source Packaging Materials"
        description="Get competitive quotes from verified packaging suppliers in 24-48 hours. Compare pricing, MOQs, and lead times for corrugated boxes, mailers, and custom packaging. Free to use."
        keywords="source packaging materials, get quotes for custom packaging, find verified packaging suppliers, corrugated boxes sourcing, B2B packaging procurement platform"
        canonical="https://holescale.com/for-buyers"
        schema={breadcrumbSchema}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="relative py-6 sm:py-12 md:py-16 lg:py-20 overflow-hidden min-h-[40vh] flex items-center bg-muted/10">
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <FadeIn delay={100}>
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">For Buyers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 md:mb-8 tracking-tight">
                Source Packaging Materials <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">the Smart Way</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
                Get competitive quotes from verified packaging suppliers in 24-48 hours. Compare pricing, <strong>MOQs</strong>, and <strong>lead times</strong> for <strong>corrugated boxes</strong>, <strong>mailers</strong>, <strong>poly bags</strong>, <strong>labels</strong>, and <strong>custom packaging</strong>. Visualize your products before ordering.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={openWaitlistDialog}
                  className="gap-2 w-full sm:w-auto text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-h-[44px]"
                  aria-label="Get started for free"
                >
                  Get Started — It's Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-2xl mx-auto">
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">24-48h</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Quote Response</div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">Free</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">For Buyers</div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">Q1 2025</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Launch Date</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Sourcing Shouldn't Be This Hard
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              "Calling supplier after supplier for quotes",
              "Waiting days (or weeks) for responses",
              "No idea if you're getting a fair price",
              "Quality surprises when orders arrive",
              "Starting from scratch every time you reorder"
            ].map((pain, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-destructive/10 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{pain}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                HoleScale Makes It Simple
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Post Once, Get Multiple Quotes",
                description: "Describe your packaging needs once. Verified suppliers compete for your business."
              },
              {
                icon: Search,
                title: "Compare Side-by-Side",
                description: "See pricing, MOQs, lead times, and supplier ratings all in one place."
              },
              {
                icon: Palette,
                title: "Visualize Before You Order",
                description: "Create mockups with Canva integration. Know exactly what you're getting before you commit."
              },
              {
                icon: Clock,
                title: "Reorder in One Click",
                description: "Your specs and suppliers are saved. Never start from scratch again."
              }
            ].map((solution, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
                  <div className="bg-primary/10 rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                    <solution.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{solution.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Verified Suppliers You Can Trust
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Every supplier on HoleScale is vetted for:
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              "Business legitimacy",
              "Quality standards",
              "Reliable fulfillment",
              "Responsive communication"
            ].map((trust, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50 text-center">
                  <div className="bg-success/10 rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold">{trust}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Everything You Need
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to streamline your procurement process
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Suppliers",
                description: "Every supplier is vetted for quality, reliability, and capability before joining our network"
              },
              {
                icon: TrendingDown,
                title: "Competitive Quotes",
                description: "Post once, get multiple quotes. Compare pricing, MOQs, and lead times side-by-side"
              },
              {
                icon: Palette,
                title: "Canva Mockups",
                description: "Visualize your branded products before ordering with built-in design tools"
              },
              {
                icon: Clock,
                title: "One-Click Reorder",
                description: "Your specs and suppliers are saved. Never start from scratch again"
              }
            ].map((benefit, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full group">
                  <div className="bg-primary/10 rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <div className="text-center mt-8 sm:mt-12">
              <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                See all platform features
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Simple 3-Step Process
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                From request to delivery in just three easy steps
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {[
              {
                icon: FileText,
                step: 1,
                title: "Post Your RFQ",
                description: "Describe what you need in minutes using our AI-powered form. Upload specs, set quantities and <strong>MOQs</strong>, set deadlines, and you're done."
              },
              {
                icon: Search,
                step: 2,
                title: "Compare Quotes",
                description: "Receive competitive bids from verified suppliers. Compare pricing, reviews, lead times, and portfolios."
              },
              {
                icon: ShoppingCart,
                step: 3,
                title: "Order Securely",
                description: "Choose your supplier, pay securely, and track your order. We hold payment in escrow until you're satisfied."
              }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="text-center group">
                  <div className="bg-primary text-primary-foreground rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
                    <div className="bg-primary/10 rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                      <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="text-center mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                See detailed process
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                Explore features
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link to="/faq" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                View FAQ
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Perfect For
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {[
              {
                title: "E-commerce brands",
                description: "needing custom packaging"
              },
              {
                title: "Food & Beverage",
                description: "sourcing food-grade packaging"
              },
              {
                title: "Retail & D2C brands",
                description: "creating unboxing experiences"
              },
              {
                title: "Procurement teams",
                description: "managing multiple vendors"
              }
            ].map((useCase, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full text-center">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{useCase.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
              Free for Buyers
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Full marketplace access at no cost. Upgrade when you need advanced inventory management, approval workflows, or multi-location support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
              <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                See Pricing
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base md:text-lg hover:gap-3 transition-all duration-300 group min-h-[44px]">
                See Features
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight">
              Ready to Source Smarter?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Launching Q1 2025 · Free to Join · No Credit Card Required
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={openWaitlistDialog}
              className="gap-2 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 h-12 sm:h-14 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 min-h-[44px] w-full sm:w-auto"
            >
              Join the Waitlist — It's Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <WaitlistDialog
        open={waitlistDialogOpen}
        onOpenChange={setWaitlistDialogOpen}
        defaultRole="buyer"
      />

      <Footer />
    </>
  );
};

export default ForBuyers;
