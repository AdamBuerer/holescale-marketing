import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/marketing/sections/Hero';
import { FAQAccordion } from '@/components/marketing/sections/FAQAccordion';
import { FooterCTA } from '@/components/marketing/sections/FooterCTA';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState<'buyer' | 'supplier'>('buyer');

  const openWaitlistDialog = (role: 'buyer' | 'supplier') => {
    setWaitlistRole(role);
    setWaitlistDialogOpen(true);
  };

  const generalFAQs = [
    {
      question: "What is HoleScale?",
      answer: "HoleScale is a B2B marketplace connecting buyers with verified packaging material suppliers. Buyers get competitive quotes; suppliers get qualified leads.",
    },
    {
      question: "When is HoleScale launching?",
      answer: "We're launching Q1 2025. Join the waitlist to get early access.",
    },
    {
      question: "Is HoleScale free?",
      answer: "Yes for buyers on our Free tier. Suppliers have tiered options starting with a free Starter plan.",
    },
  ];

  const buyerFAQs = [
    {
      question: "How do I find packaging suppliers?",
      answer: (
        <>
          Post your requirements and receive competitive quotes from verified suppliers within 24-48 hours. Compare pricing, MOQs, and lead times side-by-side.{' '}
          <Link to="/how-it-works" className="text-primary hover:underline font-semibold">
            See how it works
          </Link>.
        </>
      ),
    },
    {
      question: "How are suppliers verified?",
      answer: (
        <>
          We vet suppliers for business legitimacy, capabilities, quality standards, and reliable fulfillment before they can quote on your projects.{' '}
          <Link to="/features" className="text-primary hover:underline font-semibold">
            Learn more about our verification process
          </Link>.
        </>
      ),
    },
    {
      question: "What if I need something custom or complex?",
      answer: "HoleScale handles custom orders. Describe your requirements in detail and suppliers will respond with tailored quotes for your specific needs.",
    },
    {
      question: "How quickly will I receive quotes?",
      answer: "Most buyers receive multiple competitive quotes within 24-48 hours.",
    },
    {
      question: "Can I see samples before ordering?",
      answer: (
        <>
          Yes. You can request samples from suppliers and use our Canva integration to create mockups and visualize your branded products.{' '}
          <Link to="/features" className="text-primary hover:underline font-semibold">
            See all features
          </Link>.
        </>
      ),
    },
    {
      question: "What types of products can I source?",
      answer: "Corrugated boxes, mailers, poly bags, food packaging, labels, shipping supplies, protective packaging, sustainable packaging, and more.",
    },
  ];

  const supplierFAQs = [
    {
      question: "How much does it cost to join as a supplier?",
      answer: (
        <>
          We have a free Starter tier and paid plans (Growth $49/mo, Professional $149/mo, Enterprise $499/mo) with additional features and lower transaction fees.{' '}
          <Link to="/pricing" className="text-primary hover:underline font-semibold">
            See full pricing details
          </Link>.
        </>
      ),
    },
    {
      question: "How do you qualify leads?",
      answer: "Buyers must provide project details, quantities, timelines, and business information. You receive RFQs from buyers with real intent and real budgets.",
    },
    {
      question: "Will I be competing on price alone?",
      answer: (
        <>
          No. Buyers see your profile, ratings, response time, capabilities, and verified badge — not just price. Quality suppliers win on service and reliability.{' '}
          <Link to="/features" className="text-primary hover:underline font-semibold">
            Learn about our features
          </Link>.
        </>
      ),
    },
    {
      question: "How does Shopify integration work?",
      answer: (
        <>
          Connect your Shopify store to automatically sync your product catalog and inventory. No manual data entry required.{' '}
          <Link to="/features" className="text-primary hover:underline font-semibold">
            See integration details
          </Link>.
        </>
      ),
    },
    {
      question: "What types of suppliers do you accept?",
      answer: "Corrugated box manufacturers, flexible packaging producers, mailer suppliers, label printers, food packaging specialists, sustainable packaging suppliers, and related businesses serving B2B buyers.",
    },
    {
      question: "How do transaction fees work?",
      answer: (
        <>
          Fees are charged only when you complete a sale. Higher tiers have lower fees. Enterprise suppliers pay just Interchange + 0.5% — the lowest in the industry.{' '}
          <Link to="/pricing" className="text-primary hover:underline font-semibold">
            View pricing tiers
          </Link>.
        </>
      ),
    },
  ];

  const pricingFAQs = [
    {
      question: "Are there any hidden fees?",
      answer: "No. Our pricing is fully transparent. Buyers never pay fees. Suppliers pay only the subscription and transaction fees listed on our pricing page.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, ACH transfers, and wire transfers. Additional payment options may be available for enterprise customers.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Supplier subscriptions can be cancelled at any time with no long-term contracts. We don't offer refunds on completed transactions, but our dispute resolution process protects both parties.",
    },
    {
      question: "Do you offer financing or payment terms?",
      answer: "Extended payment terms and financing options are planned for future release. Enterprise customers may have access to custom payment arrangements.",
    },
  ];

  const securityFAQs = [
    {
      question: "How do you protect my data?",
      answer: "We use industry-standard security practices including SSL encryption, secure data storage, and regular security audits. We're compliant with GDPR and CCPA regulations.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes. All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor. We never store your full payment details on our servers.",
    },
    {
      question: "Who can see my RFQs and business information?",
      answer: "You control your privacy settings. RFQs can be visible to all suppliers or limited to selected categories. Your business information is only shared with suppliers you choose to engage with.",
    },
  ];

  const gettingStartedFAQs = [
    {
      question: "How do I join the waitlist?",
      answer: "Click the 'Join Waitlist' button on our homepage and fill out the short form. You'll receive updates about our launch and early access opportunities.",
    },
    {
      question: "What are the founding member benefits?",
      answer: "Founding members (early waitlist signups) receive: priority platform access, locked-in pricing for 2 years, 0% transaction fees for 6 months (suppliers), founding member badges, and direct input on feature development.",
    },
    {
      question: "Can I use HoleScale on mobile?",
      answer: "Yes! HoleScale is fully responsive and works on desktop, tablet, and mobile devices. A dedicated mobile app is planned for future release.",
    },
  ];

  const allFAQs = [
    ...generalFAQs,
    ...buyerFAQs,
    ...supplierFAQs,
    ...pricingFAQs,
    ...securityFAQs,
    ...gettingStartedFAQs,
  ];

  const filteredFAQs = searchQuery
    ? allFAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allFAQs;

  // Extract text from answers for schema (schema needs plain text, not JSX)
  const extractTextFromAnswer = (answer: string | React.ReactNode): string => {
    if (typeof answer === 'string') return answer;
    if (React.isValidElement(answer)) {
      const props = answer.props as { children?: React.ReactNode };
      const children = props?.children;
      if (Array.isArray(children)) {
        return children
          .filter((child: unknown) => typeof child === 'string')
          .join(' ');
      }
      if (typeof children === 'string') return children;
    }
    return 'See our website for details.';
  };
  
  const faqsForSchema = allFAQs.map(faq => ({
    question: faq.question,
    answer: extractTextFromAnswer(faq.answer)
  }));
  
  const faqSchema = generateFAQSchema(faqsForSchema);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "FAQ", url: "https://www.holescale.com/faq" },
  ]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO 
        title="FAQ | HoleScale — Frequently Asked Questions"
        description="Get answers about HoleScale for buyers and suppliers. Learn about pricing, features, verification, and how to get started on our B2B marketplace."
        canonical="https://www.holescale.com/faq"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="Frequently Asked Questions"
        subheadline="Everything you need to know about HoleScale"
        variant="centered"
      />

      {/* Search Bar */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search frequently asked questions"
          />
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-background border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto gap-2" aria-label="FAQ categories navigation">
            {[
              { id: 'general', label: 'General' },
              { id: 'buyers', label: 'For Buyers' },
              { id: 'suppliers', label: 'For Suppliers' },
              { id: 'pricing', label: 'Pricing & Payments' },
              { id: 'security', label: 'Security & Privacy' },
              { id: 'getting-started', label: 'Getting Started' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Jump to ${item.label} section`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {searchQuery ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              <FAQAccordion items={filteredFAQs} />
            </div>
          ) : (
            <>
              <div id="general">
                <h2 className="text-3xl font-bold mb-6">General Questions</h2>
                <FAQAccordion items={generalFAQs} />
              </div>

              <div id="buyers">
                <h2 className="text-3xl font-bold mb-6">For Buyers</h2>
                <FAQAccordion items={buyerFAQs} />
              </div>

              <div id="suppliers">
                <h2 className="text-3xl font-bold mb-6">For Suppliers</h2>
                <FAQAccordion items={supplierFAQs} />
              </div>

              <div id="pricing">
                <h2 className="text-3xl font-bold mb-6">Pricing & Payments</h2>
                <FAQAccordion items={pricingFAQs} />
              </div>

              <div id="security">
                <h2 className="text-3xl font-bold mb-6">Security & Privacy</h2>
                <FAQAccordion items={securityFAQs} />
              </div>

              <div id="getting-started">
                <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
                <FAQAccordion items={gettingStartedFAQs} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-muted-foreground">We're here to help</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 border text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <a href="mailto:support@holescale.com" className="text-primary hover:underline">
                support@holescale.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">Response within 24 hours</p>
            </div>

            <div className="bg-card rounded-xl p-8 border text-center">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schedule a Call</h3>
              <Button asChild>
                <Link to="/contact">Book a Demo</Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Talk to our team</p>
            </div>
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

export default FAQ;
