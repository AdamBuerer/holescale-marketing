import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface OnboardingState {
  hasCompletedProfile: boolean;
  hasPostedRFQ: boolean;
  hasReceivedQuote: boolean;
  hasPlacedOrder: boolean;
  hasAddedProduct: boolean;
  hasReceivedMessage: boolean;
  firstVisit: boolean;
  currentStep: string | null;
}

export type OnboardingStep = 
  | 'welcome'
  | 'completeProfile'
  | 'createFirstRFQ'
  | 'addFirstProduct'
  | 'waitingForQuotes'
  | 'reviewQuotes'
  | 'completed';

export function useOnboardingV2() {
  const { user, roles } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    hasCompletedProfile: false,
    hasPostedRFQ: false,
    hasReceivedQuote: false,
    hasPlacedOrder: false,
    hasAddedProduct: false,
    hasReceivedMessage: false,
    firstVisit: false,
    currentStep: null,
  });
  const [loading, setLoading] = useState(true);

  const primaryRole = roles?.[0];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadOnboardingState();
  }, [user]);

  const loadOnboardingState = async () => {
    if (!user) return;

    try {
      // Check first visit
      const firstVisitKey = `onboarding_welcomed_${user.id}`;
      const hasSeenWelcome = localStorage.getItem(firstVisitKey);

      // Check profile completion
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_name, address, city, state, country, phone')
        .eq('id', user.id)
        .maybeSingle();

      const hasCompletedProfile = !!(
        profile?.company_name && 
        (profile?.city || profile?.state || profile?.country)
      );

      // Check RFQs
      const { data: rfqs } = await supabase
        .from('rfqs')
        .select('id')
        .eq('buyer_id', user.id)
        .limit(1);

      // Check quotes
      const { data: quotes } = await supabase
        .from('quotes')
        .select('id')
        .eq('supplier_id', user.id)
        .limit(1);

      const { count: quotesReceived } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .in('rfq_id', rfqs?.map(r => r.id) || []);

      // Check orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', user.id)
        .limit(1);

      // Check products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('supplier_id', user.id)
        .limit(1);

      // Check messages
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`)
        .limit(1);

      setState({
        hasCompletedProfile,
        hasPostedRFQ: (rfqs?.length || 0) > 0,
        hasReceivedQuote: (quotesReceived || 0) > 0,
        hasPlacedOrder: (orders?.length || 0) > 0,
        hasAddedProduct: (products?.length || 0) > 0,
        hasReceivedMessage: (conversations?.length || 0) > 0,
        firstVisit: !hasSeenWelcome,
        currentStep: null,
      });

      setLoading(false);
    } catch (error) {
      logger.error('Error loading onboarding state', { error });
      setLoading(false);
    }
  };

  const getNextStep = (): OnboardingStep | null => {
    if (state.firstVisit) return 'welcome';
    
    if (primaryRole === 'buyer') {
      if (!state.hasCompletedProfile) return 'completeProfile';
      if (!state.hasPostedRFQ) return 'createFirstRFQ';
      if (!state.hasReceivedQuote) return 'waitingForQuotes';
      if (!state.hasPlacedOrder) return 'reviewQuotes';
      return 'completed';
    }
    
    if (primaryRole === 'supplier') {
      if (!state.hasCompletedProfile) return 'completeProfile';
      if (!state.hasAddedProduct) return 'addFirstProduct';
      return 'completed';
    }

    return null;
  };

  const markWelcomeSeen = () => {
    if (!user) return;
    localStorage.setItem(`onboarding_welcomed_${user.id}`, 'true');
    setState(prev => ({ ...prev, firstVisit: false }));
  };

  const completeStep = (step: OnboardingStep) => {
    setState(prev => {
      const updates: Partial<OnboardingState> = {};
      
      if (step === 'completeProfile') updates.hasCompletedProfile = true;
      if (step === 'createFirstRFQ') updates.hasPostedRFQ = true;
      if (step === 'addFirstProduct') updates.hasAddedProduct = true;
      
      return { ...prev, ...updates };
    });
  };

  const getProgress = (): number => {
    if (primaryRole === 'buyer') {
      const steps = [
        state.hasCompletedProfile,
        state.hasPostedRFQ,
        state.hasReceivedQuote,
        state.hasPlacedOrder,
      ];
      return (steps.filter(Boolean).length / steps.length) * 100;
    }
    
    if (primaryRole === 'supplier') {
      const steps = [
        state.hasCompletedProfile,
        state.hasAddedProduct,
      ];
      return (steps.filter(Boolean).length / steps.length) * 100;
    }

    return 0;
  };

  return {
    state,
    loading,
    nextStep: getNextStep(),
    progress: getProgress(),
    markWelcomeSeen,
    completeStep,
    refresh: loadOnboardingState,
  };
}
