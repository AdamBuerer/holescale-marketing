import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hero } from '@/components/marketing/sections/Hero';
import { PricingCard } from '@/components/marketing/sections/PricingCard';
import { FAQAccordion } from '@/components/marketing/sections/FAQAccordion';
import { FooterCTA } from '@/components/marketing/sections/FooterCTA';
import { WaitlistDialog } from '@/components/waitlist/WaitlistDialog';
import { generateBreadcrumbSchema } from '@/lib/schema';

const Pricing = () => {
  const [userType, setUserType] = useState<'buyer' | 'supplier'>('buyer');
  const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState<'buyer' | 'supplier'>('buyer');

  const openWaitlistDialog = (role: 'buyer' | 'supplier') => {
    setWaitlistRole(role);
    setWaitlistDialogOpen(true);
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Pricing", url: "https://www.holescale.com/pricing" },
  ]);

  const pricingFAQs = [
    {
      question: "Is HoleScale really free for buyers?",
      answer: "Yes. Our Free tier gives you full marketplace access at no cost. Upgrade to Pro or Business when you need advanced inventory management, approval workflows, or multi-location support.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support credit/debit cards and ACH bank transfers. ACH typically has lower fees for both parties.",
    },
    {
      question: "How do supplier transaction fees work?",
      answer: "Fees are charged only when you complete a sale. Card fees include payment processing. ACH fees are lower and capped at higher tiers. Enterprise suppliers get our lowest rates.",
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes. Upgrade or downgrade at any time. No long-term contracts required.",
    },
    {
      question: "What's the Verified Badge?",
      answer: "Professional and Enterprise suppliers receive a Verified Badge displayed on their profile, signaling to buyers that you've met our quality and reliability standards.",
    },
    {
      question: "Do you offer discounts for annual billing?",
      answer: "Yes. Contact us for annual pricing options with up to 20% savings.",
    },
  ];

  return (
    <>
      <SEO 
        title="Pricing | HoleScale — Transparent B2B Marketplace Pricing"
        description="Simple, transparent pricing. Free for buyers. Supplier plans from $0-$499/month with competitive transaction fees. No hidden costs."
        canonical="https://www.holescale.com/pricing"
        schema={breadcrumbSchema}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="Simple, Transparent Pricing"
        subheadline="No hidden fees. No surprises. Just fair pricing that helps you scale."
        variant="centered"
      />

      {/* Toggle for Buyer/Supplier */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <Tabs value={userType} onValueChange={(v) => setUserType(v as 'buyer' | 'supplier')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="buyer" className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">I'm a Buyer</TabsTrigger>
            <TabsTrigger value="supplier" className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">I'm a Supplier</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Buyer Pricing */}
      {userType === 'buyer' && (
        <section className="py-12 sm:py-16 md:py-24 bg-background overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">For Buyers</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Workflow tools that scale with your business</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 pt-4 sm:pt-6">
              <PricingCard
                name="Free"
                price="$0/month"
                description="Perfect for getting started"
                features={[
                  "1 seat",
                  "1 location",
                  "Marketplace access",
                  "Manual inventory (100 items)",
                  "Limited CSV export",
                  "QuickBooks/Xero sync",
                ]}
                cta={{ text: "Join Waitlist", onClick: () => openWaitlistDialog('buyer') }}
              />

              <PricingCard
                name="Pro"
                price="$99/month"
                description="For growing teams"
                features={[
                  "3 seats",
                  "1 location",
                  "Unlimited inventory",
                  "Low-stock alerts",
                  "Vendor scorecards",
                ]}
                cta={{ text: "Join Waitlist", onClick: () => openWaitlistDialog('buyer') }}
                highlighted
                badge="Most Popular"
              />

              <PricingCard
                name="Business"
                price="$299/month"
                description="Multi-location support"
                features={[
                  "10 seats",
                  "3+ locations",
                  "+$49/additional location",
                  "Approval workflows",
                  "Budget controls",
                  "SLA support",
                ]}
                cta={{ text: "Join Waitlist", onClick: () => openWaitlistDialog('buyer') }}
              />

              <PricingCard
                name="Enterprise"
                price="Custom"
                description="For large organizations"
                features={[
                  "Unlimited seats",
                  "Unlimited locations",
                  "SSO",
                  "ERP integrations (NetSuite, SAP)",
                  "Custom workflows",
                  "Dedicated CSM",
                ]}
                cta={{ text: "Contact Sales", href: "/contact" }}
              />
            </div>

            <p className="text-center text-muted-foreground mt-8">
              We believe procurement should be accessible. Start free and upgrade when you need advanced features.
            </p>
          </div>
        </section>
      )}

      {/* Supplier Pricing */}
      {userType === 'supplier' && (
        <>
          <section className="py-12 sm:py-16 md:py-24 bg-background overflow-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">For Suppliers</h2>
                <p className="text-base sm:text-lg text-muted-foreground">Get qualified leads. Pay only when you win.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6">
                <PricingCard
                  name="Starter"
                  price="$0/month"
                  description="Perfect for testing the platform"
                  features={[
                    "Card: 6% + $0.30",
                    "ACH: 6%",
                    "Max 50 SKUs",
                    "Email support",
                    "5-day payouts",
                  ]}
                  cta={{ text: "Get Started", onClick: () => openWaitlistDialog('supplier') }}
                />

                <PricingCard
                  name="Growth"
                  price="$49/month"
                  description="For growing suppliers"
                  features={[
                    "Card: 4.5% + $0.30",
                    "ACH: 3%",
                    "Unlimited SKUs",
                    "Chat support",
                    "3-day payouts",
                    "Verified badge",
                  ]}
                  cta={{ text: "Get Started", onClick: () => openWaitlistDialog('supplier') }}
                  highlighted
                  badge="Most Popular"
                />

                <PricingCard
                  name="Professional"
                  price="$149/month"
                  description="Advanced features"
                  features={[
                    "Card: 3.5% + $0.30",
                    "ACH: 1.5% (cap $50)",
                    "Next-day payouts",
                    "Priority support",
                    "SSO",
                    "Advanced analytics",
                  ]}
                  cta={{ text: "Get Started", onClick: () => openWaitlistDialog('supplier') }}
                />

                <PricingCard
                  name="Enterprise"
                  price="$499/month"
                  description="For high-volume suppliers"
                  features={[
                    "Card: Interchange + 0.5%",
                    "ACH: 0.5% (cap $25)",
                    "API/ERP integrations",
                    "Dedicated CSM",
                    "Smart-Rail architecture",
                  ]}
                  cta={{ text: "Contact Sales", href: "/contact" }}
                />
              </div>
            </div>
          </section>

          {/* Transaction Fee Explanation */}
          <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why do suppliers pay transaction fees?</h2>
              </div>

              <div className="bg-card rounded-xl p-8 border mb-8">
                <p className="text-lg text-muted-foreground mb-6">
                  Unlike traditional marketplaces that tax every transaction at 15-20%, HoleScale uses a <strong>Smart-Rail payment architecture</strong>. Our fees cover payment processing costs while delivering qualified buyers directly to you. The more you grow, the more you save — Enterprise suppliers pay just Interchange + 0.5%, the lowest in the industry.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-semibold">Buyer places order:</span>
                    <span className="text-2xl font-bold">$10,000</span>
                  </div>
                  <div className="text-center text-muted-foreground">↓</div>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <span className="font-semibold">Supplier receives (Growth tier):</span>
                    <span className="text-2xl font-bold text-primary">$9,550</span>
                  </div>
                  <div className="text-center text-muted-foreground">↓</div>
                  <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
                    <span className="font-semibold">HoleScale fee (4.5%):</span>
                    <span className="text-2xl font-bold text-destructive">$450</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="text-xl font-bold mb-3">Smart-Rail Architecture Benefits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Lower fees than traditional marketplaces (15-20%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Fees decrease as you grow (Enterprise: Interchange + 0.5%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Qualified leads only — no wasted quotes on browsers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Fast payouts (next-day for Professional+)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Early Adopter Benefits */}
          <section className="py-12 sm:py-16 md:py-24 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Founding Supplier Benefits</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">0% transaction fee for first 6 months</div>
                    <div className="text-sm opacity-90">Save thousands on early orders</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Locked-in pricing for 2 years</div>
                    <div className="text-sm opacity-90">Your rates won't increase</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Priority placement in search results</div>
                    <div className="text-sm opacity-90">Get seen by more buyers</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Direct input on feature development</div>
                    <div className="text-sm opacity-90">Shape the platform</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Co-marketing opportunities</div>
                    <div className="text-sm opacity-90">Featured in case studies</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Founding Supplier badge</div>
                    <div className="text-sm opacity-90">Exclusive profile badge</div>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" variant="secondary">
                <Link to="/waitlist">Claim Your Spot</Link>
              </Button>
            </div>
          </section>
        </>
      )}

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Questions</h2>
          </div>

          <FAQAccordion items={pricingFAQs} />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Compare</h2>
          </div>

          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="HoleScale pricing comparison with alternatives">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left font-semibold"></th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">HoleScale</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">Alibaba</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">Direct Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Buyer Fees</th>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Free</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Free</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">N/A</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Supplier Transaction Fee</th>
                    <td className="px-6 py-4 text-center text-primary font-semibold">3.5-5.5%</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">5-8%</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">N/A</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Verified Suppliers</th>
                    <td className="px-6 py-4 text-center text-primary font-semibold" aria-label="Yes">✓</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Limited</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Varies</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">Integrated Messaging</th>
                    <td className="px-6 py-4 text-center text-primary font-semibold" aria-label="Yes">✓</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Basic</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">No</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-4 font-medium">US-Focused</th>
                    <td className="px-6 py-4 text-center text-primary font-semibold" aria-label="Yes">✓</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">No</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">Varies</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-12 space-x-6">
            <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              Explore features
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              See how it works
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

export default Pricing;
