import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifferentiationSectionProps {
  className?: string;
}

const comparisons = [
  {
    traditional: "Call multiple suppliers",
    holescale: "Post once, get quotes",
  },
  {
    traditional: "Wait days for responses",
    holescale: "Quotes in 24-48 hours",
  },
  {
    traditional: "Quality uncertainty",
    holescale: "Verified suppliers",
  },
  {
    traditional: "Price opacity",
    holescale: "Transparent pricing",
  },
  {
    traditional: "Manual reordering",
    holescale: "One-click reorder",
  },
];

const highlights = [
  "Verified US suppliers — quality you can trust",
  "Competitive quotes in 24-48 hours — not days",
  "Built-in mockup tools — visualize before you order",
  "Transparent pricing & MOQs — no surprises",
  "Shopify integration for suppliers — easy catalog management",
];

export function DifferentiationSection({ className }: DifferentiationSectionProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-background', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Not Your Typical Marketplace</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional sourcing means calling 10 suppliers, waiting days for quotes, 
            and hoping quality matches samples. HoleScale changes that.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 bg-muted/50">
              <div className="p-3 sm:p-4 text-center border-r">
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Traditional Sourcing</span>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <span className="text-xs sm:text-sm font-semibold text-primary">HoleScale</span>
              </div>
            </div>
            
            {/* Rows */}
            {comparisons.map((comparison, index) => (
              <div 
                key={index} 
                className={cn(
                  "grid grid-cols-2",
                  index !== comparisons.length - 1 && "border-b"
                )}
              >
                <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-r bg-muted/20">
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{comparison.traditional}</span>
                </div>
                <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{comparison.holescale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 sm:mb-8">Why HoleScale?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-lg border"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
