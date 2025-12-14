import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

type ActivityType = 'view_supplier' | 'view_product' | 'search' | 'create_rfq' | 'add_favorite';

export const useActivityTracker = () => {
  const trackActivity = async (
    activityType: ActivityType,
    data: {
      supplierId?: string;
      productId?: string;
      searchQuery?: string;
      categoryId?: string;
      metadata?: Record<string, any>;
    } = {}
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from('user_activity').insert({
        user_id: session.user.id,
        activity_type: activityType,
        supplier_id: data.supplierId,
        product_id: data.productId,
        search_query: data.searchQuery,
        category_id: data.categoryId,
        metadata: data.metadata,
      });
    } catch (error) {
      logger.error('Error tracking activity', { error });
    }
  };

  return { trackActivity };
};
