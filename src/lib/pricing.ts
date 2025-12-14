import { supabase } from "@/integrations/supabase/client";

export interface FeeCalculation {
  orderAmount: number;
  supplierCommissionRate: number;
  supplierCommissionAmount: number;
  buyerServiceFeeRate: number;
  buyerServiceFeeAmount: number;
  stripeProcessingFee: number;
  netToSupplier: number;
  totalPaidByBuyer: number;
  breakdown: {
    subtotal: number;
    buyerFee: number;
    total: number;
    supplierReceives: number;
    platformRevenue: number;
  };
}

export const calculateOrderFees = async (
  orderAmount: number,
  supplierTier: string,
  buyerTier: string
): Promise<FeeCalculation> => {
  // Get supplier commission rate
  const { data: commissionRate } = await supabase
    .from('commission_rates')
    .select('base_rate')
    .eq('tier_name', supplierTier)
    .eq('user_type', 'supplier')
    .lte('order_min', orderAmount)
    .or(`order_max.is.null,order_max.gte.${orderAmount}`)
    .maybeSingle();

  const supplierCommissionRate = commissionRate?.base_rate || 5.0;

  // Get buyer service fee rate
  const { data: buyerTierData } = await supabase
    .from('subscription_tiers')
    .select('service_fee_rate')
    .eq('tier_name', buyerTier)
    .eq('user_type', 'buyer')
    .maybeSingle();

  const buyerServiceFeeRate = buyerTierData?.service_fee_rate || 3.5;

  // Calculate fees
  const supplierCommissionAmount = orderAmount * (supplierCommissionRate / 100);
  const buyerServiceFeeAmount = orderAmount * (buyerServiceFeeRate / 100);
  const stripeProcessingFee = (orderAmount * 0.029) + 0.30;
  
  const totalPaidByBuyer = orderAmount + buyerServiceFeeAmount;
  const netToSupplier = orderAmount - supplierCommissionAmount - stripeProcessingFee;
  const platformRevenue = supplierCommissionAmount + buyerServiceFeeAmount - stripeProcessingFee;

  return {
    orderAmount,
    supplierCommissionRate,
    supplierCommissionAmount,
    buyerServiceFeeRate,
    buyerServiceFeeAmount,
    stripeProcessingFee,
    netToSupplier,
    totalPaidByBuyer,
    breakdown: {
      subtotal: orderAmount,
      buyerFee: buyerServiceFeeAmount,
      total: totalPaidByBuyer,
      supplierReceives: netToSupplier,
      platformRevenue
    }
  };
};

export const getUserCurrentTier = async (userId: string) => {
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select(`
      *,
      tier:subscription_tiers(*)
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!subscription) {
    // Get user roles to determine user type
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const userType = roles?.some(r => r.role === "supplier") ? "supplier" : "buyer";

    const { data: freeTier } = await supabase
      .from("subscription_tiers")
      .select("*")
      .eq("tier_name", "free")
      .eq("user_type", userType)
      .maybeSingle();

    if (!freeTier) {
      // Fallback to default free tier structure if not found
      return {
        tier_name: "free",
        service_fee_rate: 3.5,
        user_type: userType,
      };
    }

    return {
      tier_name: "free",
      ...freeTier
    };
  }

  return subscription.tier;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatPercent = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

export const calculateSavings = (
  orderAmount: number,
  currentTierRate: number,
  comparisonTierRate: number
): number => {
  const currentFee = orderAmount * (currentTierRate / 100);
  const newFee = orderAmount * (comparisonTierRate / 100);
  return currentFee - newFee;
};