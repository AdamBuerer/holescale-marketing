import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: string | ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({ features, columns = 3, className }: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  const gridColsMobile = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:gap-6 md:gap-8', gridColsMobile[columns], gridCols[columns], className)}>
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 mb-3 sm:mb-4">
            {typeof feature.icon === 'string' ? (
              <span className="text-xl sm:text-2xl">{feature.icon}</span>
            ) : (
              feature.icon
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

