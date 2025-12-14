import { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PersonaTabsProps {
  onBuyerCTA?: () => void;
  onSupplierCTA?: () => void;
  className?: string;
}

const buyerBenefits = [
  {
    text: "Get quotes from verified suppliers in 24-48 hours",
    highlight: "24-48 hours",
  },
  {
    text: "Compare pricing, MOQs, and lead times side-by-side",
    highlight: "side-by-side",
  },
  {
    text: "Create mockups instantly with Canva integration",
    highlight: "Canva integration",
  },
  {
    text: "Transparent pricing before you commit",
    highlight: "Transparent pricing",
  },
  {
    text: "Reorder with one click — no hunting for old specs",
    highlight: "one click",
  },
];

const supplierBenefits = [
  {
    text: "Receive qualified leads from buyers ready to order",
    highlight: "qualified leads",
  },
  {
    text: "Showcase your capabilities to buyers actively searching",
    highlight: "actively searching",
  },
  {
    text: "Sync your Shopify catalog — no double data entry",
    highlight: "Shopify catalog",
  },
  {
    text: "Compete on quality and service, not just price",
    highlight: "quality and service",
  },
  {
    text: "Access analytics on what buyers are searching for",
    highlight: "analytics",
  },
];

export function PersonaTabs({ onBuyerCTA, onSupplierCTA, className }: PersonaTabsProps) {
  const [activeTab, setActiveTab] = useState<'buyers' | 'suppliers'>('buyers');

  return (
    <section className={cn('py-16 md:py-24 bg-muted/30', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Your Needs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're sourcing products or selling them, HoleScale works for you.
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'buyers' | 'suppliers')} 
          className="max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 md:mb-8">
            <TabsTrigger value="buyers" className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">For Buyers</TabsTrigger>
            <TabsTrigger value="suppliers" className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">For Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="buyers" className="space-y-6">
            <div className="bg-card rounded-xl p-4 sm:p-6 md:p-8 border shadow-sm">
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {buyerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                onClick={onBuyerCTA}
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-4 sm:px-6"
              >
                Find Suppliers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <div className="bg-card rounded-xl p-4 sm:p-6 md:p-8 border shadow-sm">
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {supplierBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                onClick={onSupplierCTA}
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-4 sm:px-6"
              >
                Get Qualified Leads
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
