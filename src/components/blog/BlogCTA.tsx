import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogCTALink, appLinks } from '@/lib/urls';

interface BlogCTAProps {
  variant?: 'buyer' | 'supplier' | 'general';
  postSlug?: string;
  className?: string;
}

export function BlogCTA({ variant = 'general', postSlug, className = '' }: BlogCTAProps) {
  const supplierCTALink = getBlogCTALink(postSlug || 'general', 'supplier');
  const buyerCTALink = getBlogCTALink(postSlug || 'general', 'buyer');

  if (variant === 'supplier') {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 md:p-8 ${className}`}>
        <h3 className="text-xl md:text-2xl font-bold text-emerald-900 mb-3">
          Ready to Grow Your Packaging Business?
        </h3>
        <p className="text-emerald-700 mb-6">
          Join HoleScale to connect with qualified buyers, respond to RFQs, and expand your customer base.
          Get discovered by businesses actively seeking packaging solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <a href={supplierCTALink}>
              Create Supplier Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Link to="/for-suppliers">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'buyer') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 md:p-8 ${className}`}>
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3">
          Find Your Perfect Packaging Partner
        </h3>
        <p className="text-blue-700 mb-6">
          HoleScale connects you with verified packaging suppliers ready to meet your needs.
          Get competitive quotes, compare options, and streamline your procurement process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <a href={buyerCTALink}>
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Link to="/for-buyers">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // General CTA
  return (
    <div className={`bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 md:p-8 ${className}`}>
      <h3 className="text-xl md:text-2xl font-bold mb-3">
        Ready to Transform Your Packaging Procurement?
      </h3>
      <p className="text-muted-foreground mb-6">
        Whether you're sourcing packaging or selling it, HoleScale makes B2B connections simple.
        Join the marketplace that's changing how businesses find and work with packaging partners.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <a href={buyerCTALink}>
            Join HoleScale
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/waitlist">
            Join Waitlist
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default BlogCTA;
