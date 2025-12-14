import { Link } from 'react-router-dom';
import { CheckCircle, Share2, Linkedin, Twitter, Mail, Clock, Lock, Award, TrendingUp, Users, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/marketing/sections/Hero';
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { generateBreadcrumbSchema } from '@/lib/schema';

const Waitlist = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Join Waitlist", url: "https://www.holescale.com/waitlist" },
  ]);

  return (
    <>
      <SEO 
        title="Join the HoleScale Waitlist | Early Access to B2B Marketplace"
        description="Be first in line when HoleScale launches. Get exclusive founding member benefits for the B2B packaging materials marketplace."
        canonical="https://www.holescale.com/waitlist"
        schema={breadcrumbSchema}
      />

      <Navigation />

      {/* Hero - Navy background, white text - compact for above-the-fold */}
      <section className="relative py-8 md:py-12 lg:py-16 bg-primary text-primary-foreground overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Early Access Program</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                Be First in Line
              </h1>

              <p className="text-lg md:text-xl mb-6 text-primary-foreground/90">
                Join businesses waiting for the smarter way to source packaging materials
              </p>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-5 h-5" />
                <span>Launching Q1 2025 · Free to Join</span>
              </div>
            </div>

            {/* Waitlist Form - White card on navy */}
            <div className="bg-card text-foreground rounded-xl p-6 md:p-8 border shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Join the Waitlist</h2>
              <WaitlistForm compact />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Member Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Founding Member Benefits</h2>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Clock className="w-6 h-6 text-primary" />,
                title: "Early Access",
                description: "Be among the first to use the platform. Get a head start on competitors.",
              },
              {
                icon: <Lock className="w-6 h-6 text-primary" />,
                title: "Locked-In Pricing",
                description: "Your rates won't increase for 2 years. Grandfathered into any future pricing changes.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-primary" />,
                title: "Zero Fees (Suppliers)",
                description: "0% transaction fee for first 6 months. Save thousands on early orders.",
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Direct Input",
                description: "Shape the platform with your feedback. Priority feature requests.",
              },
              {
                icon: <Award className="w-6 h-6 text-primary" />,
                title: "Founding Badge",
                description: "Exclusive 'Founding Member' profile badge. Trust signal for future transactions.",
              },
              {
                icon: <Share2 className="w-6 h-6 text-primary" />,
                title: "Co-Marketing",
                description: "Featured in case studies. Joint promotional opportunities.",
              },
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* What is HoleScale (Brief) */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">What You're Signing Up For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">One Platform</div>
              <p className="text-muted-foreground">For packaging & promo sourcing</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">Verified Suppliers</div>
              <p className="text-muted-foreground">Transparent pricing</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">AI-Powered Tools</div>
              <p className="text-muted-foreground">That save hours</p>
            </div>
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-muted-foreground">Your data is secure and never shared</p>
          <p className="text-muted-foreground">Unsubscribe anytime</p>
          <Link to="/privacy" className="text-primary hover:underline text-sm">
            Privacy policy
          </Link>
        </div>
      </section>

      {/* Urgency Element */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-muted-foreground">
            Founding member spots are limited. Join today to secure your benefits.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Waitlist;
