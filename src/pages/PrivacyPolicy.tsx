import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { generateBreadcrumbSchema } from '@/lib/schema';

export default function PrivacyPolicy() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.holescale.com/" },
    { name: "Privacy Policy", url: "https://www.holescale.com/privacy" },
  ]);

  return (
    <>
      <SEO 
        title="Privacy Policy | HoleScale"
        description="How HoleScale collects, uses, and protects your data. Our commitment to your privacy."
        canonical="https://www.holescale.com/privacy"
        schema={breadcrumbSchema}
      />

      <Navigation />

      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 20, 2024</p>

          {/* Table of Contents */}
          <nav className="mb-12 p-6 bg-muted/30 rounded-lg">
            <h2 className="font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#data-collection" className="text-primary hover:underline">1. What Data We Collect</a></li>
              <li><a href="#data-use" className="text-primary hover:underline">2. How We Use Data</a></li>
              <li><a href="#data-sharing" className="text-primary hover:underline">3. Data Sharing Policies</a></li>
              <li><a href="#your-rights" className="text-primary hover:underline">4. Your Rights</a></li>
              <li><a href="#cookies" className="text-primary hover:underline">5. Cookie Policy</a></li>
              <li><a href="#contact" className="text-primary hover:underline">6. Contact Information</a></li>
            </ul>
          </nav>

          <div className="prose prose-slate max-w-none space-y-8">
            <section id="data-collection">
              <h2 className="text-2xl font-semibold mb-4">1. What Data We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name, email address, phone number, and business details when you create an account</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Communication records and support interactions</li>
                <li>Usage data and analytics to improve our services</li>
              </ul>
            </section>

            <section id="data-use">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Communicate with you about your account and our services</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Protect our platform and users from fraud and abuse</li>
              </ul>
            </section>

            <section id="data-sharing">
              <h2 className="text-2xl font-semibold mb-4">3. Data Sharing Policies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Service providers who assist us in operating our platform (e.g., payment processors, email services)</li>
                <li>Business partners when necessary to fulfill your requests</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section id="your-rights">
              <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under GDPR and CCPA, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-semibold mb-4">5. Cookie Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookies through your browser settings.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us at{" "}
                <a href="mailto:privacy@holescale.com" className="text-primary hover:underline">
                  privacy@holescale.com
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
