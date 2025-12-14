import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface ActivityItem {
  id: string;
  type: 'rfq_posted' | 'quote_received' | 'order_placed' | 'message_sent' | 'product_added';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string;
  relatedUrl?: string;
}

export function useRecentActivity(limit = 5) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadRecentActivity();
  }, [user]);

  const loadRecentActivity = async () => {
    if (!user) return;

    try {
      const activities: ActivityItem[] = [];

      // Get recent RFQs
      const { data: rfqs } = await supabase
        .from('rfqs')
        .select('id, title, created_at')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (rfqs) {
        rfqs.forEach(rfq => {
          activities.push({
            id: `rfq-${rfq.id}`,
            type: 'rfq_posted',
            title: 'Posted RFQ',
            description: rfq.title,
            timestamp: rfq.created_at,
            relatedId: rfq.id,
            relatedUrl: `/rfq/${rfq.id}`,
          });
        });
      }

      // Get recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, created_at')
        .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3);

      if (orders) {
        orders.forEach(order => {
          activities.push({
            id: `order-${order.id}`,
            type: 'order_placed',
            title: 'Order Placed',
            description: `Order #${order.id.substring(0, 8)}`,
            timestamp: order.created_at,
            relatedId: order.id,
            relatedUrl: `/orders/${order.id}`,
          });
        });
      }

      // Get recent products (for suppliers)
      const { data: products } = await supabase
        .from('products')
        .select('id, name, created_at')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (products) {
        products.forEach(product => {
          activities.push({
            id: `product-${product.id}`,
            type: 'product_added',
            title: 'Product Added',
            description: product.name,
            timestamp: product.created_at,
            relatedId: product.id,
            relatedUrl: `/products/${product.id}`,
          });
        });
      }

      // Sort by timestamp and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      setActivities(sortedActivities);
      setLoading(false);
    } catch (error) {
      logger.error('Error loading recent activity', { error });
      setLoading(false);
    }
  };

  return { activities, loading, refresh: loadRecentActivity };
}
