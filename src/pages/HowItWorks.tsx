import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  FileText, 
  List, 
  Scale, 
  MessageSquare, 
  Package,
  Search,
  Zap,
  CreditCard,
  BarChart3,
  Palette,
  ShoppingBag,
  Bell,
  Send,
  Handshake,
  ArrowRight
} from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hero } from '@/components/marketing/sections/Hero';
import { StepTimeline } from '@/components/marketing/sections/StepTimeline';
import { FeatureGrid } from '@/components/marketing/sections/FeatureGrid';
import { FooterCTA } from '@/components/marketing/sections/FooterCTA';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { generateHowToSchema, generateBreadcrumbSchema } from '@/lib/schema';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'suppliers'>('buyers');
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState<'buyer' | 'supplier'>('buyer');

  const openWaitlistDialog = (role: 'buyer' | 'supplier') => {
    setWaitlistRole(role);
    setWaitlistDialogOpen(true);
  };
  const buyerSteps = [
    {
      number: 1,
      title: "Post Your Request",
      description: "Describe what you need — packaging type, quantity, timeline, customization requirements.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      number: 2,
      title: "Receive Competitive Quotes",
      description: "Verified suppliers respond with pricing, MOQs, lead times, and capabilities.",
      icon: <List className="w-6 h-6" />,
    },
    {
      number: 3,
      title: "Compare & Select",
      description: "Review quotes side-by-side. Check supplier ratings and reviews.",
      icon: <Scale className="w-6 h-6" />,
    },
    {
      number: 4,
      title: "Create Mockups",
      description: "Use Canva integration to visualize your branded products before ordering.",
      icon: <Palette className="w-6 h-6" />,
    },
    {
      number: 5,
      title: "Order & Manage",
      description: "Place your order, track progress, and reorder with one click.",
      icon: <Package className="w-6 h-6" />,
    },
  ];

  const supplierSteps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Showcase your capabilities, product catalog, certifications, and specialties.",
      icon: <User className="w-6 h-6" />,
    },
    {
      number: 2,
      title: "Sync Your Catalog",
      description: "Connect Shopify to automatically import products and inventory. No double entry.",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: 3,
      title: "Receive Qualified RFQs",
      description: "Get notified when buyers post requests matching your capabilities.",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      number: 4,
      title: "Submit Quotes",
      description: "Respond quickly with our quote builder. Stand out with fast, professional responses.",
      icon: <Send className="w-6 h-6" />,
    },
    {
      number: 5,
      title: "Win & Fulfill",
      description: "Close deals, manage orders, and build lasting buyer relationships.",
      icon: <Handshake className="w-6 h-6" />,
    },
  ];

  const howToSchema = generateHowToSchema(
    buyerSteps.map(step => ({ name: step.title, text: step.description })),
    "How HoleScale Works for Buyers",
    "Complete guide to using HoleScale's B2B marketplace for packaging materials"
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "How It Works", url: "https://www.holescale.com/how-it-works" },
  ]);

  return (
    <>
      <SEO 
        title="How It Works | HoleScale — B2B Packaging Marketplace"
        description="Learn how HoleScale connects buyers with verified packaging material suppliers. Get quotes in 24-48 hours. Free for buyers."
        canonical="https://www.holescale.com/how-it-works"
        schema={[howToSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="How HoleScale Works"
        subheadline="A smarter way to connect buyers and suppliers"
        variant="centered"
      />

      {/* Persona Toggle Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as 'buyers' | 'suppliers')} 
            className="w-full"
          >
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="buyers" className="text-base">For Buyers</TabsTrigger>
                <TabsTrigger value="suppliers" className="text-base">For Suppliers</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="buyers">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Procurement Made Simple</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From request to delivery, we streamline every step of sourcing packaging materials.
                </p>
              </div>
              <StepTimeline steps={buyerSteps} orientation="vertical" />
              <div className="text-center mt-12">
                <Button size="lg" onClick={() => openWaitlistDialog('buyer')}>
                  Start Sourcing
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="suppliers">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Grow Your Business</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with qualified buyers actively searching for packaging materials.
                </p>
              </div>
              <StepTimeline steps={supplierSteps} orientation="vertical" />
              <div className="text-center mt-12">
                <Button size="lg" onClick={() => openWaitlistDialog('supplier')}>
                  Join as a Supplier
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Modern Procurement</h2>
          </div>

          <FeatureGrid
            features={[
              {
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "AI-Powered RFQ Creation",
                description: "Upload images, describe your needs, and let AI generate detailed specifications",
              },
              {
                icon: <Search className="w-6 h-6 text-primary" />,
                title: "Intelligent Supplier Matching",
                description: "Get recommendations based on product type, location, capacity, and quality ratings",
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: "Real-Time Communication",
                description: "Messaging, file sharing, video calls, and shared calendars in one place",
              },
              {
                icon: <Scale className="w-6 h-6 text-primary" />,
                title: "Transparent Pricing",
                description: "Side-by-side comparisons with no hidden fees",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-primary" />,
                title: "Order Management",
                description: "Track every order from quote to delivery with milestone updates",
              },
              {
                icon: <CreditCard className="w-6 h-6 text-primary" />,
                title: "Secure Payments",
                description: "Escrow options, milestone-based payments, multiple payment methods",
              },
            ]}
            columns={3}
          />

          <div className="text-center mt-12 space-x-6">
            <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              Explore all features
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              See pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Callout */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Coming Soon: Connect HoleScale with your existing tools</h3>
          <p className="text-muted-foreground mb-6">
            QuickBooks • SAP • NetSuite • Salesforce
          </p>
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

export default HowItWorks;
