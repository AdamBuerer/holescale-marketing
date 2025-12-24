import { Star, ShoppingCart, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar?: string;
  rating?: number;
  /** Persona type for the testimonial - displays a badge */
  persona?: 'buyer' | 'supplier';
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

const personaConfig = {
  buyer: {
    label: 'BUYER',
    icon: ShoppingCart,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  supplier: {
    label: 'SUPPLIER',
    icon: Store,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-600 dark:text-green-400',
  },
};

export function Testimonials({ testimonials, className }: TestimonialsProps) {
  // Calculate minimum height to prevent CLS (approximate based on content)
  const minCardHeight = '280px';
  
  return (
    <section className={cn('py-12 md:py-16 bg-muted/30', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => {
            const persona = testimonial.persona ? personaConfig[testimonial.persona] : null;
            const PersonaIcon = persona?.icon;

            return (
            <div
              key={index}
              className="bg-card rounded-xl p-4 sm:p-6 border shadow-sm"
              style={{ minHeight: minCardHeight }}
            >
              {/* Persona Badge */}
              {persona && PersonaIcon && (
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4',
                  persona.bgColor,
                  persona.textColor
                )}>
                  <PersonaIcon className={cn('w-3.5 h-3.5', persona.iconColor)} />
                  {persona.label}
                </div>
              )}

              {testimonial.rating && (
                <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < testimonial.rating!
                          ? 'fill-primary text-primary'
                          : 'fill-muted text-muted'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              <blockquote className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed" cite={`${testimonial.author}, ${testimonial.company}`}>
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.author}, ${testimonial.title} at ${testimonial.company}`}
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
                    <span className="text-primary font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="text-sm sm:text-base font-semibold">{testimonial.author}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

