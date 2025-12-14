import { Palette, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationHighlightsProps {
  className?: string;
}

const integrations = [
  {
    name: "Canva Connect",
    icon: Palette,
    description: "Create mockups and proofs without leaving HoleScale",
    benefit: "Buyer benefit",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "Shopify Sync",
    icon: ShoppingBag,
    description: "Import your product catalog and inventory automatically",
    benefit: "Supplier benefit",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
];

export function IntegrationHighlights({ className }: IntegrationHighlightsProps) {
  return (
    <section className={cn('py-12 md:py-16 bg-muted/30', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Powerful Integrations</h2>
          <p className="text-muted-foreground">
            Connect with the tools you already use
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm text-center"
              >
                <div className={cn(
                  'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4',
                  integration.bgColor
                )}>
                  <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7', integration.color)} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 leading-relaxed">
                  {integration.description}
                </p>
                <span className={cn(
                  'inline-block text-xs font-medium px-2.5 py-1 rounded-full',
                  integration.bgColor,
                  integration.color
                )}>
                  {integration.benefit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
