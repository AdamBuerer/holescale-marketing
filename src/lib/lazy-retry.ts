/**
 * Lazy loading utility with retry mechanism
 *
 * Handles chunk loading failures gracefully by retrying with exponential backoff.
 * This helps with intermittent network issues and CDN failures.
 */

import { lazy, ComponentType } from 'react';

interface LazyRetryOptions {
  retries?: number;
  delay?: number;
  onError?: (error: Error, attempt: number) => void;
}

/**
 * Creates a lazy component with automatic retry on chunk loading failure
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyRetryOptions = {}
) {
  const { retries = 3, delay = 1000, onError } = options;

  return lazy(async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add cache-busting on retry attempts to handle stale chunks
        if (attempt > 0) {
          // Small delay before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
        }

        return await importFn();
      } catch (error) {
        lastError = error as Error;

        if (onError) {
          onError(lastError, attempt);
        }

        // Log retry attempt
        if (attempt < retries) {
          console.warn(
            `[LazyRetry] Chunk load failed, retrying (${attempt + 1}/${retries})...`,
            lastError.message
          );
        }
      }
    }

    // All retries exhausted
    console.error('[LazyRetry] Failed to load chunk after retries:', lastError);

    // Throw a more descriptive error
    throw new Error(
      `Failed to load page component after ${retries} retries. ` +
      `Please check your internet connection and reload the page.`
    );
  });
}

/**
 * Preloads a lazy component to improve navigation performance
 */
export function preloadComponent(
  importFn: () => Promise<{ default: ComponentType<unknown> }>
) {
  importFn().catch(() => {
    // Silently fail preloading - component will be loaded on demand
  });
}
