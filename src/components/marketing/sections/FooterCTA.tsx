import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FooterCTAProps {
  onBuyerCTA?: () => void;
  onSupplierCTA?: () => void;
  className?: string;
}

export function FooterCTA({ onBuyerCTA, onSupplierCTA, className }: FooterCTAProps) {
  return (
    <section className={cn(
      'py-16 md:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5',
      className
    )}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
          Ready to transform how you source — or sell — packaging materials?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Join businesses already on the waitlist. Be first in line when we launch.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Button 
            size="lg" 
            onClick={onBuyerCTA}
            className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto min-h-[44px] w-full sm:w-auto"
          >
            I'm a Buyer
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onSupplierCTA}
            className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto min-h-[44px] w-full sm:w-auto"
          >
            I'm a Supplier
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Launching Q1 2025 · Free to Join · No Credit Card Required
        </p>
      </div>
    </section>
  );
}
