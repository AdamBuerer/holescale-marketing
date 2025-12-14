import { ComponentType, lazy, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface LazyRetryOptions {
  maxRetries?: number;
  delay?: number;
  timeout?: number;
}

/**
 * Enhanced lazy loader with retry logic, timeout, and better error handling
 * PERFORMANCE: Reduced default retries and faster timeouts for better UX
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  options: LazyRetryOptions = {}
): React.LazyExoticComponent<T> {
  const { maxRetries = 3, delay = 300, timeout = 8000 } = options;

  return lazy(async () => {
    let lastError: Error | undefined;
    const startTime = performance.now();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Add timeout to prevent hanging
        const module = await Promise.race([
          componentImport(),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Component load timeout')), timeout);
          })
        ]);

        // Log slow loads in development
        if (import.meta.env.DEV) {
          const elapsed = performance.now() - startTime;
          if (elapsed > 1000) {
            logger.warn('Slow chunk load', { elapsed: `${elapsed.toFixed(0)}ms`, attempt: attempt + 1 });
          }
        }

        return module;
      } catch (error) {
        lastError = error as Error;

        // Only log errors in development
        if (import.meta.env.DEV) {
          logger.warn(`Lazy load attempt ${attempt + 1} failed`, { error });
        }

        // Don't retry on the last attempt
        if (attempt < maxRetries - 1) {
          // Quick exponential backoff
          const waitTime = delay * Math.pow(1.5, attempt);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // Log final failure
    logger.error('All lazy load attempts failed', {
      error: lastError,
      maxRetries,
    });

    // Create user-friendly error message for production
    const friendlyError = new Error(
      import.meta.env.PROD
        ? 'Failed to load page. Please refresh your browser.'
        : `Failed to load component after ${maxRetries} attempts: ${lastError?.message}`
    );

    // Attach original error for debugging
    (friendlyError as any).originalError = lastError;

    throw friendlyError;
  });
}

import { SkeletonPage } from '@/components/ui/skeleton';

/**
 * Standard loading fallback component - uses skeleton for better perceived performance
 */
export function LoadingState({ message = "Loading..." }: { message?: string }): ReactNode {
  return <SkeletonPage showHeader={true} />;
}

/**
 * Minimal loading state for inline content
 */
export function LoadingSpinner(): ReactNode {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );
}
