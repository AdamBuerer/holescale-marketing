import { Link } from 'react-router-dom';
import { Package, Box, ShoppingBag, Truck, Award, CheckCircle, Search } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema } from '@/lib/schema';

const SupplierDirectory = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.holescale.com/' },
    { name: 'Supplier Directory', url: 'https://www.holescale.com/suppliers' },
  ]);

  const supplierCategories = [
    {
      name: 'Corrugated Box Manufacturers',
      description: 'Find verified suppliers of corrugated boxes, shipping boxes, and custom corrugated packaging solutions.',
      icon: Box,
      keywords: ['corrugated boxes', 'shipping boxes', 'cardboard boxes', 'RSC boxes'],
      useCases: [
        'E-commerce fulfillment packaging',
        'Retail product boxes',
        'Shipping and distribution',
        'Custom printed corrugated boxes',
      ],
    },
    {
      name: 'Flexible Packaging Suppliers',
      description: 'Source poly mailers, bubble mailers, padded envelopes, and flexible packaging materials.',
      icon: ShoppingBag,
      keywords: ['poly mailers', 'bubble mailers', 'padded envelopes', 'flexible packaging'],
      useCases: [
        'E-commerce shipping',
        'Small product packaging',
        'Lightweight shipping solutions',
        'Cost-effective mailers',
      ],
    },
    {
      name: 'Food-Grade Container Suppliers',
      description: 'Connect with suppliers of food-safe packaging, containers, and compliant food packaging materials.',
      icon: Package,
      keywords: ['food packaging', 'food-grade containers', 'food-safe packaging', 'FDA compliant'],
      useCases: [
        'CPG food products',
        'Beverage packaging',
        'Restaurant takeout containers',
        'Food service packaging',
      ],
    },
    {
      name: 'Sustainable Packaging Solutions',
      description: 'Find eco-friendly packaging suppliers offering recycled, compostable, and sustainable materials.',
      icon: Award,
      keywords: ['sustainable packaging', 'eco-friendly packaging', 'recycled packaging', 'compostable materials'],
      useCases: [
        'Eco-conscious brands',
        'Sustainable product lines',
        'Corporate sustainability goals',
        'Green packaging initiatives',
      ],
    },
    {
      name: 'Shipping Supplies',
      description: 'Source packing tape, bubble wrap, void fill, labels, and other shipping supplies.',
      icon: Truck,
      keywords: ['shipping supplies', 'packing tape', 'bubble wrap', 'void fill', 'shipping labels'],
      useCases: [
        'Warehouse operations',
        'E-commerce fulfillment',
        'Distribution centers',
        'Shipping departments',
      ],
    },
    {
      name: 'Custom Packaging Solutions',
      description: 'Find suppliers specializing in custom packaging, branded boxes, and specialty packaging designs.',
      icon: Award,
      keywords: ['custom packaging', 'branded boxes', 'custom printed packaging', 'specialty packaging'],
      useCases: [
        'Branded product packaging',
        'Luxury packaging',
        'Custom printed boxes',
        'Specialty product packaging',
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Packaging Supplier Directory | Find Verified B2B Packaging Suppliers"
        description="Browse our directory of verified packaging suppliers. Find corrugated box manufacturers, flexible packaging suppliers, food-grade container suppliers, and sustainable packaging solutions. Compare quotes from vetted suppliers."
        keywords="packaging suppliers, corrugated box manufacturers, flexible packaging suppliers, food packaging suppliers, sustainable packaging, B2B packaging marketplace, packaging supplier directory"
        canonical="https://www.holescale.com/suppliers"
        schema={breadcrumbSchema}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Packaging Supplier Directory
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Browse our network of verified <strong>packaging suppliers</strong> across multiple categories. Find <strong>corrugated box manufacturers</strong>, <strong>flexible packaging suppliers</strong>, <strong>food-grade container suppliers</strong>, and <strong>sustainable packaging</strong> solutions. All suppliers are pre-vetted for quality and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Why Use HoleScale's Supplier Directory</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Our <strong>packaging supplier directory</strong> connects you with verified manufacturers and distributors across the United States. Every supplier in our network undergoes a verification process to ensure quality, reliability, and business credentials.
              </p>
              <p>
                Whether you're sourcing <strong>corrugated boxes</strong> for e-commerce fulfillment, <strong>poly mailers</strong> for shipping, <strong>food-grade containers</strong> for CPG products, or <strong>sustainable packaging</strong> for eco-conscious brands, our directory helps you find the right suppliers quickly.
              </p>
              <p>
                Post a request for quote (RFQ) and receive competitive bids from multiple suppliers in 24-48 hours. Compare pricing, minimum order quantities (MOQs), lead times, and supplier ratings to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Categories */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Browse by Supplier Category</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {supplierCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 md:p-8 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Common Use Cases:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {category.useCases.map((useCase, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/waitlist">Find Suppliers</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How to Find Packaging Suppliers</h2>
            
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Browse Supplier Categories</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explore our supplier directory by category — from <strong>corrugated box manufacturers</strong> to <strong>flexible packaging suppliers</strong> and <strong>sustainable packaging</strong> solutions. Each category includes verified suppliers with detailed profiles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Post a Request for Quote (RFQ)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Create an RFQ with your packaging requirements: product type, quantities, dimensions, materials, and deadlines. Our platform matches you with relevant suppliers in your chosen category.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Receive Competitive Quotes</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Get quotes from multiple verified suppliers within 24-48 hours. Compare pricing, MOQs, lead times, and supplier ratings side-by-side to find the best fit for your needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Compare and Order</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Review supplier profiles, certifications, and past performance. Communicate directly with suppliers, negotiate terms, and place orders — all within the HoleScale platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Packaging Suppliers?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join HoleScale to access our network of verified packaging suppliers and start receiving competitive quotes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/waitlist">Join the Waitlist</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SupplierDirectory;

