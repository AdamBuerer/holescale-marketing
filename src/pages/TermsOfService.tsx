import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { generateBreadcrumbSchema } from '@/lib/schema';

export default function TermsOfService() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Terms of Service", url: "https://www.holescale.com/terms" },
  ]);

  return (
    <>
      <SEO 
        title="Terms of Service | HoleScale"
        description="HoleScale terms of service and user agreement for the B2B marketplace platform."
        canonical="https://www.holescale.com/terms"
        schema={breadcrumbSchema}
      />

      <Navigation />

      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 20, 2024</p>

          {/* Table of Contents */}
          <nav className="mb-12 p-6 bg-muted/30 rounded-lg">
            <h2 className="font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a></li>
              <li><a href="#use-of-service" className="text-primary hover:underline">2. Use of Service</a></li>
              <li><a href="#user-accounts" className="text-primary hover:underline">3. User Accounts</a></li>
              <li><a href="#prohibited" className="text-primary hover:underline">4. Prohibited Activities</a></li>
              <li><a href="#intellectual-property" className="text-primary hover:underline">5. Intellectual Property</a></li>
              <li><a href="#limitation" className="text-primary hover:underline">6. Limitation of Liability</a></li>
              <li><a href="#contact" className="text-primary hover:underline">7. Contact Information</a></li>
            </ul>
          </nav>

          <div className="prose prose-slate max-w-none space-y-8">
            <section id="acceptance">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using HoleScale, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section id="use-of-service">
              <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                HoleScale provides a B2B marketplace platform connecting buyers and suppliers of packaging materials and promotional products. You agree to use the service only for lawful purposes and in accordance with these Terms.
              </p>
            </section>

            <section id="user-accounts">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section id="prohibited">
              <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users may not engage in fraudulent activities, spam, or any behavior that violates applicable laws or these terms. Prohibited activities include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fraudulent or deceptive practices</li>
                <li>Spam or unsolicited communications</li>
                <li>Violation of intellectual property rights</li>
                <li>Any activity that could harm the platform or other users</li>
              </ul>
            </section>

            <section id="intellectual-property">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on HoleScale, including text, graphics, logos, and software, is the property of HoleScale or its licensors and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section id="limitation">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                HoleScale shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@holescale.com" className="text-primary hover:underline">
                  legal@holescale.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
