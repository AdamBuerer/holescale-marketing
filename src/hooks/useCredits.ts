import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { CreditBalances, CreditTransaction, CreditType } from '@/types/credits';

export function useCredits() {
  const [balances, setBalances] = useState<CreditBalances | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBalances(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('get-credit-balances');

      if (error) throw error;

      setBalances(data.data);
    } catch (error) {
      logger.error('Error fetching credit balances', { error });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load credit balances',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBalances();

    const channel = supabase
      .channel('credit-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_credits' },
        () => fetchBalances()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_connects' },
        () => fetchBalances()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBalances]);

  const purchaseCredits = useCallback(
    async (creditType: CreditType, packageSize: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('purchase-credits', {
          body: {
            creditType,
            packageSize,
            successUrl: `${window.location.origin}/dashboard?credit_purchase=success`,
            cancelUrl: `${window.location.origin}/dashboard?credit_purchase=cancelled`,
          },
        });

        if (error) throw error;

        if (data.url) {
          window.open(data.url, '_blank');
        }
      } catch (error) {
        logger.error('Error purchasing credits', { error });
        toast({
          variant: 'destructive',
          title: 'Purchase Failed',
          description: 'Failed to initiate credit purchase',
        });
      }
    },
    [toast]
  );

  const checkCreditAvailability = useCallback(
    async (featureKey: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('check-credit-availability', {
          body: { featureKey },
        });

        if (error) throw error;
        return data;
      } catch (error) {
        logger.error('Error checking credit availability', { error });
        return null;
      }
    },
    []
  );

  return {
    balances,
    loading,
    refreshBalances: fetchBalances,
    purchaseCredits,
    checkCreditAvailability,
  };
}

export function useCreditTransactions(creditType?: CreditType, limit: number = 50) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const table = creditType === 'connects' 
          ? 'connect_transactions' 
          : creditType === 'ai_credits'
          ? 'ai_credit_transactions'
          : null;

        if (!table && creditType) {
          setTransactions([]);
          return;
        }

        if (!table) {
          const [connectsResult, aiResult] = await Promise.all([
            supabase
              .from('connect_transactions')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(limit),
            supabase
              .from('ai_credit_transactions')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(limit),
          ]);

          const allTransactions = [
            ...(connectsResult.data || []),
            ...(aiResult.data || []),
          ].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          setTransactions(allTransactions.slice(0, limit) as CreditTransaction[]);
        } else {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) throw error;
          setTransactions((data || []) as CreditTransaction[]);
        }
      } catch (error) {
        logger.error('Error fetching transactions', { error });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [creditType, limit]);

  return { transactions, loading };
}
