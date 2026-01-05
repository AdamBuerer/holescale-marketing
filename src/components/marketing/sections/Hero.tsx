import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  headline: string | React.ReactNode;
  subheadline: string;
  /** Optional additional text below subheadline (e.g., for supplier-focused messaging) */
  additionalText?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  /** Custom CTA content - when provided, overrides primaryCTA/secondaryCTA */
  customCTA?: React.ReactNode;
  trustIndicators?: string[];
  variant?: 'default' | 'dark' | 'centered';
  className?: string;
  backgroundImage?: {
    src: string;
    alt: string;
  };
  floatingImage?: {
    src: string;
    alt: string;
  };
}

export function Hero({
  headline,
  subheadline,
  additionalText,
  primaryCTA,
  secondaryCTA,
  customCTA,
  trustIndicators,
  variant = 'default',
  className,
  backgroundImage,
  floatingImage,
}: HeroProps) {
  const isDark = variant === 'dark';
  const isCentered = variant === 'centered' && !backgroundImage && !floatingImage;
  const hasBackgroundImage = !!backgroundImage;
  const hasFloatingImage = !!floatingImage;

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        isDark ? 'bg-primary text-primary-foreground' : 'bg-background',
        hasBackgroundImage || hasFloatingImage
          ? 'min-h-0 md:min-h-[85vh] lg:min-h-[90vh]'
          : isCentered
            ? 'pt-10 md:pt-14 lg:pt-16 pb-6 md:pb-8 lg:pb-10'
            : 'py-10 md:py-14 lg:py-16',
        className
      )}
    >
      {/* Background Image */}
      {hasBackgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage.src}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Background gradient for default variant (no background image) */}
      {!isDark && !hasBackgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-muted/30 to-background" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)]" />
        </div>
      )}

      {/* Main Content Container - matches Navigation max-w-7xl container */}
      <div className={cn(
        'relative z-10 h-full',
        (hasBackgroundImage || hasFloatingImage) && 'min-h-[inherit]'
      )}>
        {/* Constrained container matching Navigation */}
        <div className={cn(
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full',
          (hasBackgroundImage || hasFloatingImage) && 'min-h-[inherit]'
        )}>
          {/* Grid layout for desktop, stacked for mobile */}
          <div className={cn(
            (hasFloatingImage || hasBackgroundImage)
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center min-h-[inherit]'
              : ''
          )}>
            {/* Mobile: Floating Image on Top (order-first on mobile) */}
            {hasFloatingImage && (
              <div className="md:hidden w-full flex justify-center pt-2 pb-0 order-first" style={{ minHeight: '40vh' }}>
                <img
                  src={floatingImage.src.replace('.png', '-800.png')}
                  srcSet={`${floatingImage.src.replace('.png', '-800.png')} 800w, ${floatingImage.src} 1200w`}
                  sizes="(max-width: 768px) 90vw, 340px"
                  alt={floatingImage.alt}
                  loading="eager"
                  fetchPriority="high"
                  width={600}
                  height={400}
                  className="w-[90%] max-w-[340px] max-h-[40vh] h-auto object-contain animate-float-mobile"
                />
              </div>
            )}

            {/* Text Content - left aligned with logo */}
            <div className={cn(
              'relative z-10',
              hasFloatingImage || hasBackgroundImage
                ? 'py-4 md:py-16 lg:py-24'
                : ''
            )}>
              <div className={cn(
                'max-w-2xl',
                isCentered && 'mx-auto text-center',
                (hasFloatingImage || hasBackgroundImage) && 'md:max-w-none text-center md:text-left'
              )}>
                <h1 className={cn(
                  'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-3 md:mb-6 tracking-tight',
                  isDark && 'text-primary-foreground'
                )}>
                  {headline}
                </h1>

                <p className={cn(
                  'text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed',
                  additionalText ? 'mb-2 md:mb-4' : 'mb-4 md:mb-8',
                  isDark ? 'text-primary-foreground/90' : 'text-muted-foreground'
                )}>
                  {subheadline}
                </p>

                {additionalText && (
                  <p className={cn(
                    'text-sm sm:text-base md:text-lg mb-4 md:mb-8 leading-relaxed font-medium',
                    isDark ? 'text-primary-foreground/80' : 'text-foreground/80'
                  )}>
                    {additionalText}
                  </p>
                )}

                {customCTA ? (
                  <div className={cn(
                    'flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-8',
                    (hasFloatingImage || hasBackgroundImage) && 'justify-center md:justify-start',
                    '[&>*]:flex-shrink-0 [&>*]:min-w-0'
                  )}>
                    {customCTA}
                  </div>
                ) : (primaryCTA || secondaryCTA) && (
                  <div className={cn(
                    'flex flex-col sm:flex-row gap-2 md:gap-4 mb-4 md:mb-8',
                    (hasFloatingImage || hasBackgroundImage) && 'justify-center md:justify-start'
                  )}>
                    {primaryCTA && (
                      <Button
                        asChild
                        size="lg"
                        className="text-sm md:text-base px-5 md:px-8 py-3 md:py-6 h-auto w-full sm:w-auto"
                      >
                        <Link to={primaryCTA.href}>
                          {primaryCTA.text}
                        </Link>
                      </Button>
                    )}

                    {secondaryCTA && (
                      <Button
                        asChild
                        variant={isDark ? 'outline' : 'ghost'}
                        size="lg"
                        className={cn(
                          'text-sm md:text-base px-5 md:px-8 py-3 md:py-6 h-auto w-full sm:w-auto',
                          isDark && 'border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10'
                        )}
                      >
                        <Link to={secondaryCTA.href} className="inline-flex items-center justify-center gap-2">
                          {secondaryCTA.text}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}

                {trustIndicators && trustIndicators.length > 0 && (
                  <div className={cn(
                    'flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-6 md:gap-y-2 text-xs md:text-base',
                    isCentered && 'justify-center',
                    (hasFloatingImage || hasBackgroundImage) && 'justify-center md:justify-start'
                  )}>
                    {trustIndicators.map((indicator, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-center gap-2',
                          isDark ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}
                      >
                        <span className="text-primary">✓</span>
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop/Tablet: Floating Image on Right - aligned with container edge */}
            {hasFloatingImage && (
              <div className="hidden md:flex items-center justify-end pointer-events-none" style={{ minHeight: '600px' }}>
                <img
                  src={floatingImage.src}
                  srcSet={`${floatingImage.src.replace('.png', '-800.png')} 800w, ${floatingImage.src} 1200w`}
                  sizes="(max-width: 1024px) 50vw, 600px"
                  alt={floatingImage.alt}
                  loading="eager"
                  fetchPriority="high"
                  width={800}
                  height={600}
                  className="w-full max-w-none h-auto max-h-[85vh] object-contain object-right animate-float motion-reduce:animate-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -15px, 0);
          }
        }
        
        @keyframes float-mobile {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-mobile {
          animation: float-mobile 4s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-mobile {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

