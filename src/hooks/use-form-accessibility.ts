import { useCallback } from 'react';
import { FieldError } from 'react-hook-form';

/**
 * Hook to generate accessibility props for form fields
 * Provides consistent aria attributes for inputs with validation
 */
export function useFormAccessibility(fieldName: string, error?: FieldError) {
  const getInputProps = useCallback(() => {
    const hasError = !!error;
    const errorId = `${fieldName}-error`;
    const descriptionId = `${fieldName}-description`;

    return {
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errorId : descriptionId,
      'aria-required': true,
    };
  }, [fieldName, error]);

  const getErrorProps = useCallback(() => {
    return {
      id: `${fieldName}-error`,
      role: 'alert' as const,
      'aria-live': 'polite' as const,
    };
  }, [fieldName]);

  const getDescriptionProps = useCallback(() => {
    return {
      id: `${fieldName}-description`,
    };
  }, [fieldName]);

  return {
    getInputProps,
    getErrorProps,
    getDescriptionProps,
    hasError: !!error,
    errorId: `${fieldName}-error`,
    descriptionId: `${fieldName}-description`,
  };
}

/**
 * Generate accessible error message ID
 */
export function getErrorId(fieldName: string): string {
  return `${fieldName}-error`;
}

/**
 * Generate accessible description ID
 */
export function getDescriptionId(fieldName: string): string {
  return `${fieldName}-description`;
}

/**
 * Get aria-describedby value for a field
 * Combines description and error IDs when both exist
 */
export function getAriaDescribedBy(
  fieldName: string,
  hasError: boolean,
  hasDescription: boolean = false
): string | undefined {
  const parts: string[] = [];
  
  if (hasDescription) {
    parts.push(getDescriptionId(fieldName));
  }
  
  if (hasError) {
    parts.push(getErrorId(fieldName));
  }
  
  return parts.length > 0 ? parts.join(' ') : undefined;
}
