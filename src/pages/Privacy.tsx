import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container max-w-4xl px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              HOLESCALE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our B2B marketplace platform.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>
              We collect personal information that you provide directly to us, including:
            </p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Company name and business details</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you use our Platform, we automatically collect:
            </p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and activity logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3>2.3 Business Transaction Data</h3>
            <ul>
              <li>RFQ submissions and specifications</li>
              <li>Quotes and pricing information</li>
              <li>Order history and transaction records</li>
              <li>Messages and communications</li>
              <li>Reviews and ratings</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use collected information for the following purposes:
            </p>
            <ul>
              <li>Facilitate transactions between buyers and suppliers</li>
              <li>Process payments and prevent fraud</li>
              <li>Provide customer support</li>
              <li>Send transactional emails and notifications</li>
              <li>Improve and optimize our Platform</li>
              <li>Comply with legal obligations</li>
              <li>Conduct analytics and research</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            <h3>4.1 With Other Users</h3>
            <p>
              When you submit an RFQ or accept a quote, relevant information is shared with the other party to facilitate the transaction.
            </p>

            <h3>4.2 With Service Providers</h3>
            <p>
              We share information with third-party service providers who perform services on our behalf:
            </p>
            <ul>
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>Supabase</strong> - Database and authentication</li>
              <li><strong>Email service providers</strong> - Transactional emails</li>
              <li><strong>Analytics providers</strong> - Platform analytics</li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law or in response to valid requests by public authorities.
            </p>

            <h3>4.4 Business Transfers</h3>
            <p>
              If HOLESCALE is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your information:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Row-level security policies on databases</li>
              <li>Secure authentication and authorization</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited employee access to personal data</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to:
            </p>
            <ul>
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p>
              Deleted user data is retained in backup systems for 30 days before permanent deletion.
            </p>

            <h2>7. Your Rights and Choices</h2>
            <h3>7.1 Access and Update</h3>
            <p>
              You can access and update your personal information through your account settings.
            </p>

            <h3>7.2 Data Deletion</h3>
            <p>
              You can request deletion of your account and associated data by contacting our support team.
            </p>

            <h3>7.3 Marketing Communications</h3>
            <p>
              You can opt out of marketing emails by clicking the "unsubscribe" link in the email or updating your preferences.
            </p>

            <h3>7.4 Cookies</h3>
            <p>
              You can control cookies through your browser settings, though this may limit Platform functionality.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
            </p>

            <h2>11. OAuth Providers</h2>
            <p>
              If you sign in using Google or Apple OAuth, we receive limited information from these providers as permitted by their privacy policies. We do not have access to your password.
            </p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the Platform or sending an email.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us through the Platform's support system.
            </p>

            <h2>14. GDPR Compliance (EU Users)</h2>
            <p>
              If you are located in the European Union, you have additional rights under GDPR:
            </p>
            <ul>
              <li>Right to access your data</li>
              <li>Right to rectification</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h2>15. CCPA Compliance (California Users)</h2>
            <p>
              If you are a California resident, you have rights under the California Consumer Privacy Act:
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                By using HOLESCALE, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
