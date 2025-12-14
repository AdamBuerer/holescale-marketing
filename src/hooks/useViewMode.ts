// hooks/useViewMode.ts

import { useState } from 'react';

export type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'holescale-supplier-view-mode';

export function useViewMode(defaultMode: ViewMode = 'grid'): [ViewMode, (mode: ViewMode) => void] {
  // Initialize from localStorage or use default
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored === 'grid' || stored === 'list') ? stored : defaultMode;
    } catch (error) {
      console.error('Error reading view mode from localStorage:', error);
      return defaultMode;
    }
  });

  // Save to localStorage whenever it changes
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving view mode to localStorage:', error);
    }
  };

  return [viewMode, setViewMode];
}

