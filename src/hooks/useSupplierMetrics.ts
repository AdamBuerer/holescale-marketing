import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface SupplierMetrics {
  successRate: number;
  totalEarned: number;
}

/**
 * Hook to fetch supplier metrics (success rate and total earned)
 * Uses database functions for efficient calculation
 */
export function useSupplierMetrics(supplierId: string | null | undefined) {
  return useQuery({
    queryKey: ['supplier-metrics', supplierId],
    queryFn: async (): Promise<SupplierMetrics> => {
      if (!supplierId) {
        return { successRate: 0, totalEarned: 0 };
      }

      try {
        // Calculate success rate using database function
        const { data: successRateData, error: successRateError } = await supabase
          .rpc('calculate_supplier_success_rate', { supplier_profile_id: supplierId });

        if (successRateError) {
          logger.error('Error calculating success rate', { error: successRateError, supplierId });
        }

        // Calculate total earned using database function
        const { data: totalEarnedData, error: totalEarnedError } = await supabase
          .rpc('calculate_supplier_total_earned', { supplier_profile_id: supplierId });

        if (totalEarnedError) {
          logger.error('Error calculating total earned', { error: totalEarnedError, supplierId });
        }

        return {
          successRate: successRateData ? Number(successRateData) : 0,
          totalEarned: totalEarnedData ? Number(totalEarnedData) : 0,
        };
      } catch (error) {
        logger.error('Error fetching supplier metrics', { error, supplierId });
        return { successRate: 0, totalEarned: 0 };
      }
    },
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

