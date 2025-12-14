import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MarketInsights {
  pricing?: {
    low: number;
    avg: number;
    high: number;
    sample_count: number;
  };
  lead_times?: {
    avg_days: number;
    min_days: number;
    max_days: number;
  };
  success_rate?: number;
  recommendations?: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
  dataFreshness: 'sufficient' | 'limited' | 'unavailable';
}

export function useMarketInsights(category: string, quantity: number) {
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!category || !quantity) return;

    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('market-insights', {
          body: { category, quantity }
        });

        if (error) throw error;
        setInsights(data);
      } catch (error) {
        logger.error('Error fetching market insights', { error });
        setInsights({
          dataFreshness: 'unavailable',
          recommendations: [{
            type: 'warning',
            message: 'Market data temporarily unavailable'
          }]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [category, quantity]);

  return { insights, isLoading };
}
