import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Source set entry for responsive images
 */
export interface SrcSetEntry {
  src: string;
  width: number;
  format?: 'webp' | 'jpeg' | 'avif';
}

/**
 * Props for LazyImage component
 */
export interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  /** Primary image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional srcSet for responsive images (string or array of entries) */
  srcSet?: string | SrcSetEntry[];
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Blur placeholder data URL */
  blurDataURL?: string;
  /** Fallback image source if primary fails */
  fallbackSrc?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Enable WebP format support (default: true) */
  enableWebP?: boolean;
}

/**
 * Converts srcSet array to string format
 */
function formatSrcSet(entries: SrcSetEntry[]): string {
  return entries.map(entry => {
    const format = entry.format ? `.${entry.format}` : '';
    return `${entry.src}${format} ${entry.width}w`;
  }).join(', ');
}

/**
 * Gets WebP version of image URL (if supported)
 */
function getWebPUrl(url: string): string {
  // If URL already has format extension, replace it
  if (url.match(/\.(jpg|jpeg|png)$/i)) {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  // Otherwise append .webp (assumes server can serve WebP)
  return `${url}.webp`;
}

/**
 * Lazy-loaded image component with responsive image support
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Responsive images with srcSet
 * - WebP format with JPEG fallback
 * - Blur placeholder support
 * - Automatic fallback handling
 * 
 * @example
 * ```tsx
 * <LazyImage
 *   src="/image.jpg"
 *   alt="Description"
 *   srcSet={[
 *     { src: "/image-small.jpg", width: 640 },
 *     { src: "/image-large.jpg", width: 1280 }
 *   ]}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   enableWebP={true}
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  srcSet,
  sizes,
  blurDataURL,
  fallbackSrc = '/images/placeholder-product.jpg',
  className = '',
  onLoad,
  onError,
  enableWebP = true,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [currentSrcSet, setCurrentSrcSet] = useState<string | undefined>(
    typeof srcSet === 'string' ? srcSet : srcSet ? formatSrcSet(srcSet) : undefined
  );
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update srcSet when prop changes
  useEffect(() => {
    if (typeof srcSet === 'string') {
      setCurrentSrcSet(srcSet);
    } else if (Array.isArray(srcSet)) {
      setCurrentSrcSet(formatSrcSet(srcSet));
    } else {
      setCurrentSrcSet(undefined);
    }
  }, [srcSet]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false); // Try loading fallback
    } else {
      setHasError(true);
      onError?.();
    }
  }, [onError, fallbackSrc, currentSrc]);

  // Determine if we should use picture element (WebP support + srcSet)
  const usePicture = enableWebP && currentSrcSet && !hasError;

  return (
    <div className={`relative overflow-hidden ${className}`} ref={containerRef}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Responsive image with WebP support */}
      {isInView && !hasError && usePicture && (
        <picture>
          {/* WebP source */}
          <source
            srcSet={currentSrcSet.split(',').map(entry => {
              const [url, width] = entry.trim().split(' ');
              return `${getWebPUrl(url)} ${width}`;
            }).join(', ')}
            sizes={sizes}
            type="image/webp"
          />
          {/* JPEG fallback */}
          <img
            ref={imgRef}
            src={currentSrc}
            srcSet={currentSrcSet}
            sizes={sizes}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            {...props}
          />
        </picture>
      )}

      {/* Standard image (no WebP or no srcSet) */}
      {isInView && !hasError && !usePicture && (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={currentSrcSet}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-sm text-muted-foreground">Failed to load image</span>
        </div>
      )}
    </div>
  );
}
