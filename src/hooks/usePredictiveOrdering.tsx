import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface PredictiveOrder {
  productName: string;
  lastOrderDate: string;
  averageDaysBetweenOrders: number;
  nextPredictedDate: string;
  confidence: 'high' | 'medium' | 'low';
  supplierId?: string;
  supplierName?: string;
  lastQuantity?: number;
  lastPrice?: number;
}

export function usePredictiveOrdering() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<PredictiveOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    analyzePurchasePatterns();
  }, [user]);

  const analyzePurchasePatterns = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's completed orders
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          product_name,
          created_at,
          quantity,
          unit_price,
          supplier_id,
          profiles!orders_supplier_id_fkey(company_name)
        `)
        .eq('buyer_id', user.id)
        .eq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (!orders || orders.length === 0) {
        setLoading(false);
        return;
      }

      // Group orders by product name
      const productOrders: Record<string, any[]> = {};
      orders.forEach(order => {
        if (!productOrders[order.product_name]) {
          productOrders[order.product_name] = [];
        }
        productOrders[order.product_name].push(order);
      });

      // Analyze patterns for products ordered multiple times
      const predictions: PredictiveOrder[] = [];
      
      Object.entries(productOrders).forEach(([productName, productOrderList]) => {
        if (productOrderList.length < 2) return; // Need at least 2 orders to predict

        // Sort by date
        productOrderList.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Calculate average days between orders
        let totalDaysBetween = 0;
        for (let i = 1; i < productOrderList.length; i++) {
          const days = Math.floor(
            (new Date(productOrderList[i].created_at).getTime() - 
             new Date(productOrderList[i - 1].created_at).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          totalDaysBetween += days;
        }

        const averageDays = Math.round(totalDaysBetween / (productOrderList.length - 1));
        const lastOrder = productOrderList[productOrderList.length - 1];
        const lastOrderDate = new Date(lastOrder.created_at);
        const daysSinceLastOrder = Math.floor(
          (new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Predict next order date
        const nextPredictedDate = new Date(lastOrderDate);
        nextPredictedDate.setDate(nextPredictedDate.getDate() + averageDays);

        // Determine confidence based on consistency
        let confidence: 'high' | 'medium' | 'low' = 'medium';
        if (productOrderList.length >= 4) {
          confidence = 'high';
        } else if (productOrderList.length === 2) {
          confidence = 'low';
        }

        // Only suggest if we're within 7 days of predicted date
        const daysUntilPredicted = Math.floor(
          (nextPredictedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilPredicted <= 7 && daysUntilPredicted >= -3) {
          predictions.push({
            productName,
            lastOrderDate: lastOrder.created_at,
            averageDaysBetweenOrders: averageDays,
            nextPredictedDate: nextPredictedDate.toISOString(),
            confidence,
            supplierId: lastOrder.supplier_id,
            supplierName: lastOrder.profiles?.company_name || 'Unknown',
            lastQuantity: lastOrder.quantity,
            lastPrice: lastOrder.unit_price,
          });
        }
      });

      // Sort by urgency (soonest predicted dates first)
      predictions.sort((a, b) => 
        new Date(a.nextPredictedDate).getTime() - new Date(b.nextPredictedDate).getTime()
      );

      setPredictions(predictions);
      setLoading(false);
    } catch (error) {
      logger.error('Error analyzing purchase patterns', { error });
      setLoading(false);
    }
  };

  return {
    predictions,
    loading,
    refresh: analyzePurchasePatterns,
  };
}
