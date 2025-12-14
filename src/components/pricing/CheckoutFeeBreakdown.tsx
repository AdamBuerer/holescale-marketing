import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateOrderFees, formatCurrency, formatPercent, getUserCurrentTier } from "@/lib/pricing";
import { logger } from "@/lib/logger";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface CheckoutFeeBreakdownProps {
  orderId: string;
  orderAmount: number;
  supplierId: string;
  buyerId: string;
}

export const CheckoutFeeBreakdown = ({ 
  orderId, 
  orderAmount, 
  supplierId, 
  buyerId 
}: CheckoutFeeBreakdownProps) => {
  const [feeBreakdown, setFeeBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateCheckoutFees();
  }, [orderAmount]);

  const calculateCheckoutFees = async () => {
    try {
      setLoading(true);
      const supplierTier = await getUserCurrentTier(supplierId);
      const buyerTier = await getUserCurrentTier(buyerId);
      
      const fees = await calculateOrderFees(
        orderAmount,
        supplierTier.tier_name,
        buyerTier.tier_name
      );

      setFeeBreakdown(fees);

      // Save to transaction_fees table for record
      await supabase.from("transaction_fees").insert({
        order_id: orderId,
        supplier_id: supplierId,
        buyer_id: buyerId,
        order_amount: orderAmount,
        supplier_commission_rate: fees.supplierCommissionRate,
        supplier_commission_amount: fees.supplierCommissionAmount,
        buyer_service_fee_rate: fees.buyerServiceFeeRate,
        buyer_service_fee_amount: fees.buyerServiceFeeAmount,
        stripe_processing_fee: fees.stripeProcessingFee,
        net_to_supplier: fees.netToSupplier,
        total_paid_by_buyer: fees.totalPaidByBuyer
      });
    } catch (error) {
      logger.error("Error calculating fees", { error });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6 max-w-md mx-auto border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!feeBreakdown) {
    return (
      <div className="bg-card rounded-lg shadow p-6 max-w-md mx-auto border">
        <p className="text-center text-muted-foreground">Unable to calculate fees</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow p-6 max-w-md mx-auto border">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Subtotal:</span>
          <span className="font-semibold">{formatCurrency(feeBreakdown.orderAmount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Service Fee ({formatPercent(feeBreakdown.buyerServiceFeeRate)}):
          </span>
          <span>{formatCurrency(feeBreakdown.buyerServiceFeeAmount)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between">
          <span className="font-bold">Total You Pay:</span>
          <span className="font-bold text-xl text-primary">
            {formatCurrency(feeBreakdown.totalPaidByBuyer)}
          </span>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground mb-2">Supplier Receives:</div>
          <div className="font-bold text-green-600">
            {formatCurrency(feeBreakdown.netToSupplier)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            After {formatPercent(feeBreakdown.supplierCommissionRate)} commission
          </div>
        </div>

        {feeBreakdown.buyerServiceFeeRate > 0 && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-xs">
              💡 <strong>Tip:</strong> Upgrade to Professional tier for zero service fees! 
              You'd save {formatCurrency(feeBreakdown.buyerServiceFeeAmount)} on this order.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};