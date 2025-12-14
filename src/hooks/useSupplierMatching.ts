import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface SupplierMatch {
  supplier_id: string;
  match_score: number;
  match_reasons: Array<{
    factor: string;
    weight: number;
    matched: boolean;
  }>;
  supplier: {
    id: string;
    company_name: string;
    location: string;
    avatar_url?: string;
    certifications?: string[];
  };
}

export function useSupplierMatching(rfqId?: string) {
  const [matches, setMatches] = useState<SupplierMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!rfqId) return;

    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase.functions.invoke('match-suppliers', {
          body: { rfqId, buyerId: user?.id }
        });

        if (error) throw error;
        setMatches(data.matches || []);
      } catch (error) {
        logger.error('Error fetching supplier matches', { error });
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [rfqId]);

  return { matches, isLoading };
}
