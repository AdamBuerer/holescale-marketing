import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook to ensure dialogs have proper accessibility attributes
 * Warns in development if DialogTitle or DialogDescription is missing
 */
export function useAccessibleDialog(options: {
  hasTitle?: boolean;
  hasDescription?: boolean;
  dialogName?: string;
}) {
  const { hasTitle = true, hasDescription = false, dialogName = 'Dialog' } = options;
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (import.meta.env.DEV && !hasWarnedRef.current) {
      if (!hasTitle) {
        logger.warn(
          `[Accessibility Warning] ${dialogName} is missing a DialogTitle. This is required for screen readers. If the dialog has a visual title, wrap it in DialogTitle. If it shouldn't be visible, use VisuallyHidden: <VisuallyHidden><DialogTitle>...</DialogTitle></VisuallyHidden>`
        );
        hasWarnedRef.current = true;
      }
      
      // Description is recommended but not required
      if (!hasDescription && hasTitle) {
        console.info(
          `[Accessibility Info] ${dialogName} doesn't have a DialogDescription. ` +
          `Consider adding one to provide more context for screen reader users.`
        );
      }
    }
  }, [hasTitle, hasDescription, dialogName]);
}
