import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureBlockProps {
  title: string;
  description: string;
  bullets: string[];
  image?: string;
  imageAlt?: string;
  reverse?: boolean;
  className?: string;
}

export function FeatureBlock({
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse = false,
  className,
}: FeatureBlockProps) {
  return (
    <div className={cn('py-12 md:py-16', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-8 lg:gap-12 items-center',
            reverse && 'lg:grid-flow-dense'
          )}
        >
          {/* Text Content */}
          <div className={cn(reverse && 'lg:col-start-2')}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
            <ul className="space-y-3">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image or Placeholder */}
          <div className={cn(reverse && 'lg:col-start-1 lg:row-start-1')}>
            {image ? (
              <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
                <img
                  src={image}
                  alt={imageAlt || title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-muted-foreground text-sm">Image placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

