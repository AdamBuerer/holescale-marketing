import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
  initAutoTracking,
  type PageViewParams,
} from '@/lib/analytics';

/**
 * Hook to track page views on route changes
 */
export function usePageTracking(customParams?: PageViewParams) {
  const location = useLocation();

  useEffect(() => {
    trackPageView({
      page_path: location.pathname,
      page_location: window.location.href,
      ...customParams,
    });
  }, [location.pathname, customParams]);
}

/**
 * Hook to track scroll depth for a specific page
 */
export function useScrollTracking(enabled = true) {
  const maxScroll = useRef(0);
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );

      if (scrollPercent > maxScroll.current) {
        maxScroll.current = scrollPercent;
        
        // Track milestones
        const milestones = [25, 50, 75, 90, 100];
        const milestone = milestones.find(m => 
          scrollPercent >= m && 
          scrollPercent < m + 1 && 
          !trackedMilestones.current.has(m)
        );

        if (milestone) {
          trackedMilestones.current.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const throttledHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandler);
      clearTimeout(scrollTimeout);
    };
  }, [enabled]);
}

/**
 * Hook to track time on page
 */
export function useTimeOnPageTracking(enabled = true) {
  const startTime = useRef(Date.now());
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const milestones = [10, 30, 60, 120, 300, 600];
    let currentIndex = 0;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);

      if (currentIndex < milestones.length && elapsed >= milestones[currentIndex]) {
        if (!trackedMilestones.current.has(milestones[currentIndex])) {
          trackedMilestones.current.add(milestones[currentIndex]);
          trackTimeOnPage(milestones[currentIndex]);
        }
        currentIndex++;
      }

      if (currentIndex >= milestones.length) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled]);
}

/**
 * Hook to initialize analytics auto-tracking
 */
export function useAnalyticsInit() {
  useEffect(() => {
    // Small delay to ensure analytics scripts are loaded
    const timer = setTimeout(() => {
      initAutoTracking();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
}

/**
 * Hook to track form interactions
 */
export function useFormTracking(formName: string, formLocation?: string) {
  const hasStarted = useRef(false);

  const trackStart = useCallback(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      const { trackFormStart } = require('@/lib/analytics');
      trackFormStart(formName, formLocation);
    }
  }, [formName, formLocation]);

  const trackSubmit = useCallback((success: boolean, errorMessage?: string) => {
    const { trackFormSubmit } = require('@/lib/analytics');
    trackFormSubmit(formName, success, formLocation, errorMessage);
  }, [formName, formLocation]);

  const trackFieldInteraction = useCallback((fieldName: string, interactionType: 'focus' | 'blur' | 'change') => {
    const { trackFormFieldInteraction } = require('@/lib/analytics');
    trackFormFieldInteraction(formName, fieldName, interactionType);
  }, [formName]);

  return {
    trackStart,
    trackSubmit,
    trackFieldInteraction,
  };
}

