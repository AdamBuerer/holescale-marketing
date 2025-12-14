export type CreditType = 'connects' | 'ai_credits';

export interface CreditBalances {
  connects: number;
  ai_credits: number;
  subscription_tier: string;
  subscription_status: string;
  monthly_connect_allowance: number;
  monthly_ai_credit_allowance: number;
  connect_discount_percent: number;
  ai_credit_discount_percent: number;
  next_refill_date: string;
  total_connects_used: number;
  total_ai_credits_spent: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  related_entity_id?: string;
  related_entity_type?: string;
  balance_after: number;
  expires_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreditPackage {
  credits: number;
  price: number;
  savings?: string;
  popular?: boolean;
}

export const CONNECT_PACKAGES: Record<string, CreditPackage> = {
  '10': { credits: 10, price: 1.50 },
  '20': { credits: 20, price: 3.00 },
  '40': { credits: 40, price: 6.00 },
  '80': { credits: 80, price: 12.00 },
  '100': { credits: 100, price: 14.00, savings: '7%' },
  '200': { credits: 200, price: 27.00, savings: '10%', popular: true },
  '500': { credits: 500, price: 65.00, savings: '13%' },
};

export const AI_CREDIT_PACKAGES: Record<string, CreditPackage> = {
  '50': { credits: 50, price: 10.00 },
  '150': { credits: 150, price: 25.00, savings: '17%', popular: true },
  '500': { credits: 500, price: 75.00, savings: '25%' },
  '1000': { credits: 1000, price: 125.00, savings: '38%' },
};
