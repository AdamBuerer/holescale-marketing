import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { logger } from '@/lib/logger';

export interface RFQDraftData {
  category: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  deliveryDate: string;
  deliveryLocation: string;
  budgetMin: number;
  budgetMax: number;
  certifications: string[];
  verifiedOnly: boolean;
  usaOnly: boolean;
  ecoFriendly: boolean;
  files: File[];
  savedAt?: string;
}

const DRAFT_KEY = 'rfq_draft';
const DRAFT_EXPIRY_DAYS = 7;
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export function useRFQDraft() {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Check if draft exists and is not expired
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const savedAt = parsed.savedAt ? new Date(parsed.savedAt) : null;
        
        if (savedAt) {
          const daysSinceSaved = Math.floor((Date.now() - savedAt.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceSaved < DRAFT_EXPIRY_DAYS) {
            setHasDraft(true);
            setLastSaved(parsed.savedAt);
          } else {
            // Clear expired draft
            localStorage.removeItem(DRAFT_KEY);
          }
        }
      } catch (e) {
        logger.error('Failed to parse draft', { error: e });
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = useCallback((data: Partial<RFQDraftData>) => {
    try {
      const now = new Date();
      const draftData = {
        ...data,
        savedAt: now.toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setLastSaved(format(now, 'h:mm a'));
      setHasDraft(true);
    } catch (e) {
      logger.error('Failed to save draft', { error: e });
      toast.error('Failed to save draft');
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback((): RFQDraftData | null => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        toast.info('Draft loaded');
        return parsed;
      } catch (e) {
        logger.error('Failed to load draft', { error: e });
        return null;
      }
    }
    return null;
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setLastSaved(null);
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    lastSaved,
    autosaveInterval: AUTOSAVE_INTERVAL,
  };
}
