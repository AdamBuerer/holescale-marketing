import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface AccordionPersistenceOptions {
  storageKey: string;
  defaultOpen?: string[];
}

export function useAccordionPersistence({ storageKey, defaultOpen = [] }: AccordionPersistenceOptions) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // Try to load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(Object.entries(parsed)
          .filter(([_, isOpen]) => isOpen)
          .map(([key]) => key));
      }
    } catch (error) {
      logger.warn('Failed to load accordion state from localStorage', { error });
    }
    // Use defaults if no saved state
    return new Set(defaultOpen);
  });

  // Save to localStorage whenever expandedSections changes
  useEffect(() => {
    try {
      const stateObject: Record<string, boolean> = {};
      expandedSections.forEach(key => {
        stateObject[key] = true;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(stateObject));
    } catch (error) {
      logger.warn('Failed to save accordion state to localStorage', { error });
    }
  }, [expandedSections, storageKey]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const clearState = () => {
    try {
      localStorage.removeItem(storageKey);
      setExpandedSections(new Set(defaultOpen));
    } catch (error) {
      logger.warn('Failed to clear accordion state from localStorage', { error });
    }
  };

  return {
    expandedSections,
    toggleSection,
    clearState,
  };
}
