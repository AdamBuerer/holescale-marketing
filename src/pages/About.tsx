import { Link } from 'react-router-dom';
import { 
  Target, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Handshake, 
  Shield,
  FileText,
  DollarSign,
  Package
} from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/marketing/sections/Hero';
import { CTA } from '@/components/marketing/sections/CTA';
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid';
import { StatsGrid } from '@/components/marketing/sections/StatsGrid';
import { generateAboutPageSchema, generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/schema';

const About = () => {
  const organizationSchema = generateOrganizationSchema();
  const aboutPageSchema = generateAboutPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "About", url: "https://www.holescale.com/about" },
  ]);

  return (
    <>
      <SEO
        title="About HoleScale | Our Mission to Transform Packaging Procurement"
        description="Learn about HoleScale's mission to revolutionize packaging materials procurement. Meet our team and discover why we're building the future of B2B packaging marketplaces."
        canonical="https://www.holescale.com/about"
        schema={[aboutPageSchema, organizationSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="About HoleScale"
        subheadline="Filling holes in your scalability"
        variant="centered"
      />

      {/* Mission */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <blockquote className="text-2xl md:text-3xl font-medium text-muted-foreground leading-relaxed">
              "We believe B2B procurement should be simple, transparent, and scalable. HoleScale exists to connect businesses with the suppliers they need to grow, eliminating the friction that holds them back."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">The HoleScale Story</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              HoleScale was born from firsthand experience with the frustrations of B2B packaging procurement. Sourcing packaging materials meant endless emails, price opacity, and uncertainty about supplier reliability. There had to be a better way.
            </p>
            <p>
              We're building the platform we wished existed: a modern marketplace that brings transparency to pricing, quality to supplier relationships, and efficiency to the entire procurement process. By leveraging AI and thoughtful design, we're making it possible for businesses of any size to access the packaging suppliers and tools they need to scale.
            </p>
            <p>
              Based in Colorado and founded in 2024, HoleScale is on a mission to transform how businesses source the packaging materials that power their growth.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">The Problem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fragmented Market</h3>
              <p className="text-muted-foreground">
                Buyers juggle dozens of suppliers across multiple platforms and spreadsheets
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Price Opacity</h3>
              <p className="text-muted-foreground">
                Unclear pricing leads to wasted time and missed opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Uncertainty</h3>
              <p className="text-muted-foreground">
                Vetting suppliers is time-consuming and risky
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Solution</h2>
          <div className="bg-card rounded-xl p-8 border">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">One Platform</div>
                <div className="text-sm text-muted-foreground">Centralized supplier network</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">Transparent</div>
                <div className="text-sm text-muted-foreground">Clear pricing and quotes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">Verified</div>
                <div className="text-sm text-muted-foreground">Vetted, reliable suppliers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">Efficient</div>
                <div className="text-sm text-muted-foreground">AI-powered tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What We Stand For</h2>
          <FeatureGrid
            features={[
              {
                icon: <Target className="w-6 h-6 text-primary" />,
                title: "Transparency",
                description: "Clear pricing, honest communication, no hidden agendas",
              },
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Quality",
                description: "Vetted suppliers, reliable products, consistent experiences",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-primary" />,
                title: "Efficiency",
                description: "Streamlined processes, AI assistance, time saved",
              },
              {
                icon: <Handshake className="w-6 h-6 text-primary" />,
                title: "Partnership",
                description: "We succeed when our users succeed",
              },
              {
                icon: <Lightbulb className="w-6 h-6 text-primary" />,
                title: "Innovation",
                description: "Continuously improving with cutting-edge technology",
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Trust",
                description: "Security, privacy, and reliability in everything we do",
              },
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Leadership</h2>
          <p className="text-lg text-muted-foreground text-center leading-relaxed">
            HoleScale is led by a team with deep experience in technology, marketing, and the packaging industry. We're backed by advisors with expertise in risk management, enterprise technology, security, and supply chain operations.
          </p>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">HoleScale by the Numbers</h2>
          <StatsGrid
            stats={[
              { value: "Q1 2025", label: "Launch date" },
              { value: "$107B", label: "US packaging market" },
              { value: "4.4%", label: "Market CAGR through 2030" },
              { value: "20-30%", label: "Potential cost savings" },
              { value: "2024", label: "Year founded" },
              { value: "Colorado", label: "HQ location" },
            ]}
          />
        </div>
      </section>

      {/* Careers */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're building something special. If you're passionate about transforming B2B commerce, we'd love to hear from you.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">View Open Positions</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        headline="Join Us on This Journey"
        subheadline="Be part of the future of B2B procurement"
        primaryCTA={{ text: "Join Waitlist", href: "/waitlist" }}
      />

      <Footer />
    </>
  );
};

export default About;
