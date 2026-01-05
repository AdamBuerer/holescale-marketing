import { useState } from 'react';
import { Check } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/FadeIn';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";
import { useToast } from '@/hooks/use-toast';

type Persona = 'all' | 'marketing' | 'procurement' | 'events';

interface PersonaContent {
  headline: string;
  subhead: string;
  benefits: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
  cta: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  productType: string;
  quantity: string;
  timeline: string;
  message: string;
}

const personaContent: Record<Persona, PersonaContent> = {
  marketing: {
    headline: "Custom Packaging That Photographs Beautifully",
    subhead: "Create unboxing experiences your customers will share",
    benefits: [
      { icon: "✦", title: "Design Support", desc: "Work with suppliers who understand brand guidelines and color matching" },
      { icon: "◆", title: "Premium Finishes", desc: "Foil stamping, spot UV, soft-touch laminates—all available" },
      { icon: "●", title: "Sustainable & Beautiful", desc: "Eco-friendly options that don't look 'brown and boring'" },
      { icon: "■", title: "Proof Approval", desc: "Digital proofs before production—no surprises" }
    ],
    cta: "Get Design-Forward Quotes"
  },
  procurement: {
    headline: "Transparent Pricing. No Hidden Fees.",
    subhead: "Compare MOQs, lead times, and landed costs in one place",
    benefits: [
      { icon: "✦", title: "Real Pricing Upfront", desc: "See tooling, setup, and per-unit costs before you commit" },
      { icon: "◆", title: "Volume Tiers", desc: "Understand exactly where price breaks hit—500, 1K, 5K, 10K units" },
      { icon: "●", title: "Vendor Consolidation", desc: "Boxes, inserts, and promo items—one platform, one invoice" },
      { icon: "■", title: "Vetted Suppliers", desc: "Quality-checked manufacturers with reliability ratings" }
    ],
    cta: "Compare Supplier Pricing"
  },
  events: {
    headline: "Rush Production. Guaranteed Delivery.",
    subhead: "Get trade show swag and event materials on time—every time",
    benefits: [
      { icon: "✦", title: "In-Hand Date Calculator", desc: "See real delivery dates, not just production time" },
      { icon: "◆", title: "Rush Options", desc: "24-hour, 48-hour, and 5-day production available" },
      { icon: "●", title: "Instant Proofs", desc: "Get approvals fast—no back-and-forth delays" },
      { icon: "■", title: "Inventory Visibility", desc: "Real-time stock levels—no backordered surprises" }
    ],
    cta: "Get Rush Quotes Now"
  },
  all: {
    headline: "Custom Packaging & Promo Products, Simplified",
    subhead: "Get quotes from vetted suppliers. Compare pricing. No surprises.",
    benefits: [
      { icon: "✦", title: "Transparent Pricing", desc: "See real costs—tooling, setup, and per-unit—before you commit" },
      { icon: "◆", title: "Multiple Quotes", desc: "Compare suppliers side-by-side on quality, price, and lead time" },
      { icon: "●", title: "Vetted Suppliers", desc: "Quality-checked manufacturers with proven track records" },
      { icon: "■", title: "One Platform", desc: "Boxes, mailers, swag, inserts—consolidate your vendors" }
    ],
    cta: "Get Free Quotes"
  }
};

const stats = [
  { value: "48hr", label: "Average Quote Time" },
  { value: "0", label: "Hidden Fees" },
  { value: "100%", label: "Price Transparency" }
];

const categories = [
  { name: "Custom Mailer Boxes", icon: "📦", popular: true },
  { name: "Rigid Gift Boxes", icon: "🎁", popular: false },
  { name: "Promotional Products", icon: "🎯", popular: true },
  { name: "Branded Apparel", icon: "👕", popular: false },
  { name: "Trade Show Materials", icon: "🎪", popular: true },
  { name: "Corporate Gift Sets", icon: "✨", popular: false },
  { name: "Subscription Box Packaging", icon: "📬", popular: true },
  { name: "Food-Safe Packaging", icon: "🍽️", popular: false }
];

const testimonials = [
  {
    quote: "Finally, a platform where I can see real pricing without playing the 'request a quote and wait' game.",
    author: "Sarah M.",
    role: "Procurement Manager",
    company: "DTC Beauty Brand"
  },
  {
    quote: "We needed 2,000 custom boxes in 10 days for a product launch. HoleScale connected us with a supplier who delivered in 8.",
    author: "Marcus T.",
    role: "Marketing Director",
    company: "Consumer Electronics"
  },
  {
    quote: "Consolidated three vendors into one. Saved 23% on our annual packaging spend.",
    author: "Jennifer L.",
    role: "Operations Lead",
    company: "Subscription Box Company"
  }
];

const faqs = [
  {
    q: "What are the typical MOQs for custom packaging?",
    a: "MOQs vary by product and printing method. Digital printing starts as low as 50-100 units. Flexographic and offset printing typically require 500-1,000+ units for cost efficiency. We show MOQs upfront for every supplier."
  },
  {
    q: "How long does custom packaging production take?",
    a: "Standard production is 2-3 weeks after proof approval. Rush options (24-hour to 5-day) are available from select suppliers at premium rates. We calculate your in-hand date including shipping."
  },
  {
    q: "Are there hidden fees I should know about?",
    a: "Common 'hidden' fees include tooling/dies ($150-$500), plate charges, setup fees, and shipping. On HoleScale, suppliers must disclose all fees upfront—we show your true landed cost."
  },
  {
    q: "Can I get samples before placing a large order?",
    a: "Yes. Most suppliers offer sample programs ranging from free generic samples to paid custom samples ($50-$200). We recommend always approving a physical sample before production."
  }
];

export default function GetQuotes() {
  useMarketingPageShell({ className: "space-y-0" });
  const { toast } = useToast();
  const [activePersona, setActivePersona] = useState<Persona>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    productType: '',
    quantity: '',
    timeline: '',
    message: ''
  });

  const content = personaContent[activePersona];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      if (!supabase) {
        throw new Error('Quote request service is not configured. Please try again later.');
      }

      // Submit quote request - use contact form endpoint as it handles similar data
      // In the future, this could be a dedicated 'submit-quote-request' edge function
      const { data: result, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          company: formData.company || null,
          userType: 'buyer', // Quote requests are typically from buyers
          subject: `Quote Request: ${formData.productType}`,
          message: `Product Type: ${formData.productType}\nQuantity: ${formData.quantity}\nTimeline: ${formData.timeline}\nRole: ${formData.role}\n\nAdditional Details:\n${formData.message || 'None'}`,
          joinWaitlist: false,
        },
      });

      if (error) {
        throw error;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to submit quote request');
      }

      setSubmitted(true);
      toast({
        title: "Quote request submitted!",
        description: "We've received your request and will be in touch soon.",
      });
    } catch (error) {
      console.error('Quote request submission error:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit quote request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO
        title="Get Free Quotes | Custom Packaging & Promo Products | HoleScale"
        description="Get transparent pricing from vetted suppliers. Compare quotes for custom packaging, mailer boxes, promotional products, and more. No hidden fees."
        canonical="https://www.holescale.com/get-quotes"
        schema={[faqSchema]}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <FadeIn>
            {/* Persona Selector */}
            <div className="mb-8">
              <span className="block text-white/60 text-sm uppercase tracking-wider mb-3">
                I'm looking for:
              </span>
              <div className="flex justify-center gap-2 flex-wrap">
                {([
                  { id: 'all' as Persona, label: 'Everything' },
                  { id: 'marketing' as Persona, label: 'Brand & Design' },
                  { id: 'procurement' as Persona, label: 'Best Pricing' },
                  { id: 'events' as Persona, label: 'Fast Turnaround' }
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePersona(tab.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activePersona === tab.id
                        ? 'bg-white/10 border border-white/40 text-white'
                        : 'border border-white/20 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-tight">
              {content.headline}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/75 max-w-2xl mx-auto mb-10">
              {content.subhead}
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center gap-8 sm:gap-12 mb-10 flex-wrap">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-bold text-purple-300 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-white/50 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="#quote-form"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/40 transition-all md:hover:scale-105 active:scale-95"
              >
                {content.cta}
              </a>
              <a
                href="#how-it-works"
                className="inline-block px-8 py-4 border border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Buyers Choose HoleScale
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {content.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="block text-2xl text-purple-600 mb-4">{benefit.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What Are You Sourcing?
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Get quotes for any custom packaging or promotional product
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <a
                  key={i}
                  href="#quote-form"
                  className="relative flex items-center gap-3 px-6 py-5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-purple-200 rounded-xl transition-all group"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-sm font-medium flex-1">{cat.name}</span>
                  {cat.popular && (
                    <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg uppercase">
                      Popular
                    </span>
                  )}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { num: "01", title: "Tell Us What You Need", desc: "Product type, quantity, timeline, and any design requirements" },
                { num: "02", title: "Get Matched With Suppliers", desc: "We connect you with vetted suppliers who fit your specs" },
                { num: "03", title: "Compare Quotes", desc: "Review pricing, lead times, and capabilities side-by-side" },
                { num: "04", title: "Order With Confidence", desc: "Approve proofs, place your order, track delivery" }
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <span className="block text-6xl md:text-7xl font-bold text-purple-100 mb-4 tracking-tighter">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              What Buyers Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10"
                >
                  <p className="text-white/85 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="flex flex-col gap-1">
                    <strong className="text-white">{t.author}</strong>
                    <span className="text-sm text-white/60">
                      {t.role}, {t.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quote Request Form */}
      <section id="quote-form" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <div className="lg:sticky lg:top-24">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get Your Free Quote
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Tell us what you need. We'll connect you with suppliers who can deliver.
                </p>

                <div className="space-y-4">
                  {[
                    "No obligation—quotes are free",
                    "Response within 48 hours",
                    "All pricing includes setup fees",
                    "Your info stays private"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Form */}
            <div className="bg-gray-50 p-8 md:p-10 rounded-2xl">
              <FadeIn>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Quote Request Received!</h3>
                    <p className="text-gray-600">
                      We'll match you with suppliers and send quotes within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Jane Smith"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Work Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@company.com"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Company *
                        </label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Acme Corp"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Your Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select your role</option>
                          <option value="marketing">Marketing / Brand</option>
                          <option value="procurement">Procurement / Ops</option>
                          <option value="events">Events / Admin</option>
                          <option value="founder">Founder / Owner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1.5">
                        What do you need? *
                      </label>
                      <select
                        id="productType"
                        name="productType"
                        required
                        value={formData.productType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select product type</option>
                        <option value="mailer-boxes">Custom Mailer Boxes</option>
                        <option value="rigid-boxes">Rigid / Gift Boxes</option>
                        <option value="promo-products">Promotional Products</option>
                        <option value="apparel">Branded Apparel</option>
                        <option value="trade-show">Trade Show Materials</option>
                        <option value="gift-sets">Corporate Gift Sets</option>
                        <option value="subscription">Subscription Box Packaging</option>
                        <option value="food-packaging">Food-Safe Packaging</option>
                        <option value="other">Other / Multiple</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Estimated Quantity
                        </label>
                        <select
                          id="quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select quantity</option>
                          <option value="50-250">50 - 250 units</option>
                          <option value="250-500">250 - 500 units</option>
                          <option value="500-1000">500 - 1,000 units</option>
                          <option value="1000-5000">1,000 - 5,000 units</option>
                          <option value="5000-10000">5,000 - 10,000 units</option>
                          <option value="10000+">10,000+ units</option>
                          <option value="not-sure">Not sure yet</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Timeline
                        </label>
                        <select
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                          <option value="">When do you need it?</option>
                          <option value="rush">ASAP / Rush (1-2 weeks)</option>
                          <option value="standard">Standard (3-4 weeks)</option>
                          <option value="flexible">Flexible (1-2 months)</option>
                          <option value="planning">Just planning ahead</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us more about your project—dimensions, materials, design requirements, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Get My Free Quotes →'}
                    </Button>
                  </form>
                )}
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white p-7 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Simplify Your Sourcing?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Join buyers who've discovered transparent pricing and reliable suppliers.
            </p>
            <a
              href="#quote-form"
              className="inline-block px-10 py-5 bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-lg shadow-xl transition-all md:hover:scale-105 active:scale-95"
            >
              Get Your Free Quote
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
