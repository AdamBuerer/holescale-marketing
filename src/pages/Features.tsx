import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  Scale,
  MessageSquare,
  Package,
  CreditCard,
  Users,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Zap,
  Shield,
  Lock,
  CheckCircle,
  Palette,
  Star,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Hero } from '@/components/marketing/sections/Hero';
import { FeatureBlock } from '@/components/marketing/sections/FeatureBlock';
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid';
import { FooterCTA } from '@/components/marketing/sections/FooterCTA';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { generateItemListSchema, generateBreadcrumbSchema } from '@/lib/schema';

const Features = () => {
  const [activeSection, setActiveSection] = useState('core-features');
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState<'buyer' | 'supplier'>('buyer');

  const openWaitlistDialog = (role: 'buyer' | 'supplier') => {
    setWaitlistRole(role);
    setWaitlistDialogOpen(true);
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['core-features', 'buyer-tools', 'supplier-tools', 'ai-intelligence', 'security'];
          // Use a larger offset for detection (e.g., 250px) to switch when the header effectively "hits" the section + sticky nav
          const scrollPosition = window.scrollY + 250;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              // Check if the section is covering the top part of the viewing area
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for sticky nav (64px) + sticky sub-nav (56px) + breathing room (20px) = ~140px
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const features = [
    { name: "Advanced Search & Filtering", description: "Find exactly what you need with powerful filters" },
    { name: "Request for Quote (RFQ) System", description: "Submit detailed requests in minutes, not hours" },
    { name: "Proposal Management", description: "Compare quotes side-by-side and make informed decisions" },
    { name: "Real-Time Communication", description: "Collaborate seamlessly with integrated messaging" },
    { name: "Order Management Dashboard", description: "Track everything from quote to delivery" },
    { name: "Secure Payment Processing", description: "Protected transactions you can trust" },
  ];

  const itemListSchema = generateItemListSchema(features);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Features", url: "https://www.holescale.com/features" },
  ]);

  return (
    <>
      <SEO
        title="Features | HoleScale — Packaging Procurement Platform"
        description="Verified suppliers, competitive quoting, Canva mockups, Shopify integration, and more. See what makes HoleScale the smarter B2B procurement platform."
        canonical="https://www.holescale.com/features"
        schema={[itemListSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="Features Built for Modern B2B"
        subheadline="Everything you need to source smarter or sell better"
        variant="centered"
      />

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-16 z-40 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex overflow-x-auto gap-2 py-3 sm:justify-center scrollbar-hide"
            aria-label="Feature sections navigation"
          >
            {[
              { id: 'core-features', label: 'Core Features' },
              { id: 'buyer-tools', label: 'Buyer Tools' },
              { id: 'supplier-tools', label: 'Supplier Tools' },
              { id: 'ai-intelligence', label: 'AI & Intelligence' },
              { id: 'security', label: 'Security & Compliance' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  scrollToSection(item.id);
                }}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Core Features */}
      <section id="core-features" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Platform Features</h2>
          </div>

          <div className="space-y-0">
            <FeatureBlock
              title="Advanced Search & Filtering"
              description="Find exactly what you need with powerful filters"
              image="/images/advanced-search.jpg"
              imageAlt="Advanced Search & Filtering interface showing magnifying glass, filter tags, and filtering controls"
              bullets={[
                "Product type, material, and customization filters",
                "Location and lead time filtering",
                "Price range and MOQ options",
                "Supplier rating and verification badges",
                "Sustainability certifications",
              ]}
            />

            <FeatureBlock
              title="Request for Quote (RFQ) System"
              description="Submit detailed requests in minutes, not hours"
              image="/images/rfq.jpg"
              imageAlt="RFQ creation interface showing form fields and file upload options"
              bullets={[
                "Product specifications and quantities",
                "File uploads (logos, designs, inspiration)",
                "Budget and timeline requirements",
                "AI-suggested fields and quantities",
                "Voice-to-RFQ (coming soon)",
              ]}
              reverse
            />

            <FeatureBlock
              title="Proposal Management"
              description="Compare quotes side-by-side and make informed decisions"
              image="/images/proposal.jpg"
              imageAlt="Quote comparison interface showing side-by-side pricing and supplier details"
              bullets={[
                "Detailed pricing breakdowns",
                "Lead time comparisons",
                "Sample availability indicators",
                "Supplier credentials and reviews",
                "Mockup previews",
              ]}
            />

            <FeatureBlock
              title="Real-Time Communication"
              description="Collaborate seamlessly with integrated messaging"
              image="/images/comms.jpg"
              imageAlt="Team collaboration interface with messaging and video calling features"
              bullets={[
                "Instant messaging with notifications",
                "File and design sharing",
                "Video and audio calls",
                "Shared calendar for scheduling",
                "Message history and search",
              ]}
              reverse
            />

            <FeatureBlock
              title="Order Management Dashboard"
              description="Track everything from quote to delivery"
              image="/images/order-management.jpg"
              imageAlt="Order tracking dashboard showing timeline and milestone updates"
              bullets={[
                "Order status timeline",
                "Production milestone tracking",
                "Shipment tracking integration",
                "Order history and reordering",
                "Invoicing and receipts",
              ]}
            />

            <FeatureBlock
              title="Secure Payment Processing"
              description="Protected transactions you can trust"
              image="/images/security.jpg"
              imageAlt="Secure payment interface with multiple payment options and security badges"
              bullets={[
                "Multiple payment methods",
                "Escrow service (optional)",
                "Milestone-based payments",
                "Automated invoicing",
                "PCI-compliant processing",
              ]}
              reverse
            />
          </div>
        </div>
      </section>

      {/* Buyer-Specific Tools */}
      <section id="buyer-tools" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Buyers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your procurement process
            </p>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Verified Supplier Network",
                description: "Quality suppliers vetted for reliability and capability",
              },
              {
                icon: <FileText className="w-6 h-6 text-primary" />,
                title: "Competitive Quoting",
                description: "Get multiple quotes from packaging suppliers with one request",
              },
              {
                icon: <Palette className="w-6 h-6 text-primary" />,
                title: "Canva Mockups",
                description: "Visualize your custom packaging designs before ordering",
              },
              {
                icon: <DollarSign className="w-6 h-6 text-primary" />,
                title: "Transparent Pricing",
                description: "See pricing and MOQs upfront, no surprises",
              },
              {
                icon: <Package className="w-6 h-6 text-primary" />,
                title: "Order Management",
                description: "Track orders and reorder packaging easily",
              },
              {
                icon: <Star className="w-6 h-6 text-primary" />,
                title: "Supplier Reviews",
                description: "Real ratings from real buyers",
              },
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* Supplier-Specific Tools */}
      <section id="supplier-tools" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">For Suppliers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools to help you grow your business and win more deals
            </p>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Qualified Lead Generation",
                description: "Connect with buyers actively searching for packaging materials",
              },
              {
                icon: <ShoppingCart className="w-6 h-6 text-primary" />,
                title: "Shopify Integration",
                description: "Sync your product catalog automatically",
              },
              {
                icon: <FileText className="w-6 h-6 text-primary" />,
                title: "Quote Builder",
                description: "Respond to RFQs quickly and professionally",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-primary" />,
                title: "Analytics Dashboard",
                description: "See what buyers are searching for",
              },
              {
                icon: <Scale className="w-6 h-6 text-primary" />,
                title: "Profile & Portfolio",
                description: "Showcase your packaging capabilities and certifications",
              },
              {
                icon: <RefreshCw className="w-6 h-6 text-primary" />,
                title: "Fair Competition",
                description: "Win on quality, not just price",
              },
            ]}
            columns={3}
          />
        </div>
      </section>

      {/* AI & Intelligence */}
      <section id="ai-intelligence" className="py-16 md:py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Intelligence</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI-Powered RFQ Creation</h3>
              <p className="text-muted-foreground">
                Image/video analysis for product identification, automated description generation, smart quantity suggestions, budget estimation
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Intelligent Matching</h3>
              <p className="text-muted-foreground">
                Buyer-supplier matching algorithms, personalized recommendations, trend analysis and insights
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Price Optimization (Coming Soon)</h3>
              <p className="text-muted-foreground">
                Market price benchmarking, negotiation insights, cost-saving recommendations
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Virtual Samples (Coming Soon)</h3>
              <p className="text-muted-foreground">
                AI-generated product mockups, 3D visualization, AR preview capabilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section id="security" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Security</h2>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Shield className="w-6 h-6 text-primary" />,
                title: "Data Protection",
                description: "SSL encryption, GDPR & CCPA compliant, regular security audits",
              },
              {
                icon: <CreditCard className="w-6 h-6 text-primary" />,
                title: "Payment Security",
                description: "PCI DSS compliant, encrypted transactions, fraud protection",
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-primary" />,
                title: "Supplier Verification",
                description: "Identity verification, quality certifications, performance monitoring",
              },
              {
                icon: <Lock className="w-6 h-6 text-primary" />,
                title: "Access Controls",
                description: "Role-based permissions, two-factor authentication, audit logging",
              },
            ]}
            columns={2}
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HoleScale vs. Traditional Procurement</h2>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="HoleScale vs Traditional Procurement comparison">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">Traditional</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">HoleScale</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Supplier Discovery</th>
                    <td className="px-6 py-4 text-center text-muted-foreground">Days/Weeks</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Minutes</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Quote Turnaround</th>
                    <td className="px-6 py-4 text-center text-muted-foreground">1-2 Weeks</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">24-48 Hours</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Price Transparency</th>
                    <td className="px-6 py-4 text-center text-muted-foreground">Limited</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Full</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Communication</th>
                    <td className="px-6 py-4 text-center text-muted-foreground">Email/Phone</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Integrated Platform</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Order Tracking</th>
                    <td className="px-6 py-4 text-center text-muted-foreground">Manual</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Real-Time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-12 space-x-6">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              See how it works
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              View pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FooterCTA
        onBuyerCTA={() => openWaitlistDialog('buyer')}
        onSupplierCTA={() => openWaitlistDialog('supplier')}
      />

      {/* Waitlist Dialog */}
      <WaitlistDialog
        open={waitlistDialogOpen}
        onOpenChange={setWaitlistDialogOpen}
        defaultRole={waitlistRole}
      />

      <Footer />
    </>
  );
};

export default Features;

