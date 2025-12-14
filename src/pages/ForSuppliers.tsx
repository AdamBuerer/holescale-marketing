import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, DollarSign, TrendingUp, Users, Award, Zap, ShoppingCart, Scale } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";

const ForSuppliers = () => {
  useMarketingPageShell();
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);

  const openWaitlistDialog = () => {
    setWaitlistDialogOpen(true);
  };

  return (
    <>
      <SEO
        title="For Suppliers | HoleScale — Get Qualified B2B Packaging Leads"
        description="Get qualified leads from buyers ready to order packaging materials. Sync your Shopify catalog. Compete on quality, not just price. Join HoleScale's packaging supplier network."
        keywords="sell packaging materials online, B2B packaging leads, packaging materials marketplace for suppliers, qualified buyer leads, packaging supplier lead generation"
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
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-accent/30">
                <Award className="w-4 h-4 text-accent-foreground" />
                <span className="text-xs sm:text-sm font-semibold text-accent-foreground">For Suppliers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 md:mb-8 tracking-tight">
                Get Qualified Leads. <span className="text-accent bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Ready to Order.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
                Join the marketplace where buyers come to you — with purchase intent. Connect with businesses seeking <strong>corrugated boxes</strong>, <strong>mailers</strong>, <strong>food packaging</strong>, <strong>labels</strong>, and <strong>custom packaging</strong> solutions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={openWaitlistDialog}
                  className="gap-2 w-full sm:w-auto text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px]"
                >
                  Join as a Supplier
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-2xl mx-auto">
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-1">Free</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">To Start</div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-1">Quality</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Wins Here</div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-1">Q1 2025</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Launch Date</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Lead Generation Shouldn't Cost a Fortune
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              "Trade shows drain your budget",
              "Google Ads bring unqualified clicks",
              "Cold outreach has dismal conversion",
              "You're competing against distributors with 10x your marketing budget",
              "Your website doesn't generate the leads you need"
            ].map((pain, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-xl p-6 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="bg-destructive/10 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                      <Target className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{pain}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                HoleScale Brings Buyers to You
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: "Qualified B2B Leads",
                description: "Buyers on HoleScale have real projects and real budgets. No more wasted quotes on browsers who never buy."
              },
              {
                icon: Scale,
                title: "Level Playing Field",
                description: "Compete on quality, service, and speed — not marketing budget. Small and mid-size suppliers thrive here."
              },
              {
                icon: ShoppingCart,
                title: "Easy Catalog Management",
                description: "Sync your Shopify store. Your products and inventory stay up to date automatically. No double data entry."
              },
              {
                icon: Zap,
                title: "Professional Quote Tools",
                description: "Respond to RFQs quickly with our quote builder. Win with fast, professional responses."
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "See what buyers are searching for. Spot trends and opportunities in packaging materials."
              }
            ].map((solution, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full">
                  <div className="bg-accent/20 rounded-xl w-14 h-14 flex items-center justify-center mb-5">
                    <solution.icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Works With Tools You Already Use
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-card rounded-2xl p-8 md:p-10 border border-border/50 text-center">
              <div className="bg-accent/20 rounded-xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Shopify Integration</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Sync your product catalog and inventory automatically.
              </p>
              <p className="text-muted-foreground">
                No double data entry. No new systems to learn.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Win on Quality, Not Just Price
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Unlike other marketplaces, buyers see:
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              "Your ratings and reviews",
              "Your response time",
              "Your capabilities and specialties",
              "Your portfolio and certifications"
            ].map((item, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-xl p-6 border border-border/50 text-center">
                  <div className="bg-success/10 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-semibold">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <p className="text-center text-lg text-muted-foreground mt-8">
              Price is just one factor. Quality suppliers win.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Why Suppliers Choose HoleScale
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                The most supplier-friendly B2B marketplace
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Target,
                title: "Qualified B2B Leads",
                description: "Buyers on HoleScale have real projects and real budgets. No more wasted quotes on browsers who never buy."
              },
              {
                icon: Scale,
                title: "Level Playing Field",
                description: "Compete on quality, service, and speed — not marketing budget. Small and mid-size suppliers thrive here."
              },
              {
                icon: ShoppingCart,
                title: "Shopify Integration",
                description: "Sync your product catalog and inventory automatically. No double data entry. No new systems to learn."
              },
              {
                icon: Zap,
                title: "Professional Quote Tools",
                description: "Respond to RFQs quickly with our quote builder. Win with fast, professional responses."
              },
              {
                icon: TrendingUp,
                title: "Market Intelligence",
                description: "See what buyers are searching for. Spot trends and opportunities in packaging materials."
              },
              {
                icon: Award,
                title: "Win on Quality",
                description: "Buyers see your ratings, response time, and capabilities. Price is just one factor — quality suppliers win."
              }
            ].map((benefit, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full group">
                  <div className="bg-accent/20 rounded-xl w-14 h-14 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={700}>
            <div className="text-center mt-12">
              <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                See all platform features
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                How It Works for Suppliers
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Get started in four simple steps
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: 1, title: "Create Profile", desc: "Set up your company profile and product catalog" },
              { step: 2, title: "Browse RFQs", desc: "See requests matching your expertise and capabilities" },
              { step: 3, title: "Submit Quotes", desc: "Send competitive quotes with your best pricing" },
              { step: 4, title: "Win & Deliver", desc: "Close deals, fulfill orders, and get paid fast" }
            ].map((step, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="text-center group">
                  <div className="bg-accent text-accent-foreground rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-5 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full">
                    <h3 className="font-bold mb-3 text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <div className="text-center mt-12">
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                See detailed process for buyers and suppliers
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Simple, Fair Commission Structure
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Pay only when you get paid. No monthly fees on free tier.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-card rounded-2xl p-8 md:p-10 border border-border/50 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Free Tier</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">$0 - $1,000</span>
                      <span className="font-bold text-lg text-foreground">5.0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">$1,000 - $5,000</span>
                      <span className="font-bold text-lg text-foreground">4.5%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">$5,000 - $10,000</span>
                      <span className="font-bold text-lg text-foreground">4.0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">$10,000+</span>
                      <span className="font-bold text-lg text-foreground">3.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 md:p-8 border border-accent/30">
                  <div className="bg-accent/20 rounded-lg px-3 py-1 text-xs font-bold inline-block mb-4">
                    RECOMMENDED
                  </div>
                  <h3 className="text-2xl font-bold mb-6">Professional Tier</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-accent/30">
                      <span className="text-muted-foreground">$0 - $1,000</span>
                      <span className="font-bold text-lg text-accent-foreground">4.0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-accent/30">
                      <span className="text-muted-foreground">$1,000 - $5,000</span>
                      <span className="font-bold text-lg text-accent-foreground">3.5%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-accent/30">
                      <span className="text-muted-foreground">$5,000 - $10,000</span>
                      <span className="font-bold text-lg text-accent-foreground">3.0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">$10,000+</span>
                      <span className="font-bold text-lg text-accent-foreground">2.5%</span>
                    </div>
                  </div>
                  <div className="mt-6 p-3 bg-accent/20 rounded-lg">
                    <p className="text-sm font-semibold text-accent-foreground">
                      Save up to 1% on every order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="text-center mt-10">
              <div className="space-x-6">
                <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                  See all pricing tiers
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                  See features
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                Perfect For
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Packaging material suppliers of all sizes
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[
              "Corrugated box manufacturers",
              "Flexible packaging producers",
              "Label and tag printers",
              "Custom mailer suppliers",
              "Food packaging specialists",
              "Sustainable packaging suppliers"
            ].map((item, idx) => (
              <FadeIn key={idx} delay={100 * (idx + 1)}>
                <div className="bg-card rounded-xl p-6 border border-border/50 text-center hover:shadow-xl hover:border-accent/30 transition-all duration-300">
                  <div className="bg-accent/20 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <p className="font-semibold">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
              Transparent, Fair Pricing
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Free to start. Transaction fees only when you win business. Growth plans from $49/month with lower fees and faster payouts.
            </p>
            <div className="space-x-6">
              <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                See Pricing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-300 group">
                See how it works
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-24 lg:py-28 bg-gradient-to-r from-accent via-accent to-accent/90 text-accent-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 tracking-tight">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl md:text-2xl opacity-95 mb-10 leading-relaxed">
              Launching Q1 2025 · Free to Start
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={openWaitlistDialog}
              className="gap-2 text-lg px-10 h-14 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Join as a Supplier
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base opacity-90 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-accent-foreground/50" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to start</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-accent-foreground/50" />
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Pay only when you win</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Waitlist Dialog */}
      <WaitlistDialog
        open={waitlistDialogOpen}
        onOpenChange={setWaitlistDialogOpen}
        defaultRole="supplier"
      />

      <Footer />
    </>
  );
};

export default ForSuppliers;
