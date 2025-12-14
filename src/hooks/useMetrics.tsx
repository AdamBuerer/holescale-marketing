import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface DailyMetric {
  total_gmv?: string | number;
  total_net_revenue?: string | number;
  orders_placed?: number;
  active_buyers?: number;
  active_suppliers?: number;
  overall_conversion_rate?: number;
  avg_order_value?: string | number;
}

interface CustomerHealth {
  health_score?: number;
  churn_risk_score?: number;
  customer_segment?: string;
}

// Hook for executive dashboard metrics
export function useExecutiveMetrics() {
  return useQuery({
    queryKey: ['executive-metrics'],
    queryFn: async () => {
      const today = new Date();
      
      // Get this month's metrics
      const { data: thisMonthData, error: thisMonthError } = await supabase
        .from('daily_metrics')
        .select('*')
        .gte('metric_date', format(startOfMonth(today), 'yyyy-MM-dd'))
        .lte('metric_date', format(endOfMonth(today), 'yyyy-MM-dd'));

      if (thisMonthError) throw thisMonthError;

      // Get last month's metrics for comparison
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from('daily_metrics')
        .select('*')
        .gte('metric_date', format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'))
        .lte('metric_date', format(endOfMonth(subMonths(today, 1)), 'yyyy-MM-dd'));

      if (lastMonthError) throw lastMonthError;

      // Aggregate metrics
      const aggregateMetrics = (data: DailyMetric[]) => ({
        gmv: data.reduce((sum, d) => sum + (Number(d.total_gmv) || 0), 0),
        netRevenue: data.reduce((sum, d) => sum + (Number(d.total_net_revenue) || 0), 0),
        orders: data.reduce((sum, d) => sum + (d.orders_placed || 0), 0),
        activeBuyers: Math.max(...data.map(d => d.active_buyers || 0), 0),
        activeSuppliers: Math.max(...data.map(d => d.active_suppliers || 0), 0),
        rfqToOrderRate: data[data.length - 1]?.overall_conversion_rate || 0,
        avgOrderValue: data.length > 0 ? data.reduce((sum, d) => sum + (Number(d.avg_order_value) || 0), 0) / data.length : 0,
      });

      const thisMonthMetrics = aggregateMetrics(thisMonthData || []);
      const lastMonthMetrics = aggregateMetrics(lastMonthData || []);

      // Calculate growth rates
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        current: thisMonthMetrics,
        previous: lastMonthMetrics,
        growth: {
          gmv: calculateGrowth(thisMonthMetrics.gmv, lastMonthMetrics.gmv),
          netRevenue: calculateGrowth(thisMonthMetrics.netRevenue, lastMonthMetrics.netRevenue),
          orders: calculateGrowth(thisMonthMetrics.orders, lastMonthMetrics.orders),
          activeBuyers: calculateGrowth(thisMonthMetrics.activeBuyers, lastMonthMetrics.activeBuyers),
          activeSuppliers: calculateGrowth(thisMonthMetrics.activeSuppliers, lastMonthMetrics.activeSuppliers),
        },
      };
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// Hook for pipeline metrics
export function usePipelineMetrics() {
  return useQuery({
    queryKey: ['pipeline-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_health' as any)
        .select('*')
        .order('week', { ascending: false })
        .limit(12); // Last 12 weeks

      if (error) throw error;
      return data;
    },
  });
}

// Hook for customer health scores
export function useCustomerHealth(segment?: string) {
  return useQuery({
    queryKey: ['customer-health', segment],
    queryFn: async () => {
      let query = supabase
        .from('customer_health_scores')
        .select('*')
        .order('health_score', { ascending: false });

      if (segment) {
        query = query.eq('customer_segment', segment);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate summary stats
      const typedData = (data || []) as CustomerHealth[];
      const summary = {
        totalCustomers: typedData.length,
        avgHealthScore: typedData.length > 0 ? typedData.reduce((sum: number, c: CustomerHealth) => sum + (c.health_score || 0), 0) / typedData.length : 0,
        highRisk: typedData.filter((c: CustomerHealth) => (c.churn_risk_score || 0) >= 70).length,
        healthy: typedData.filter((c: CustomerHealth) => (c.health_score || 0) >= 70).length,
        atRisk: typedData.filter((c: CustomerHealth) => c.customer_segment === 'at_risk').length,
        powerUsers: typedData.filter((c: CustomerHealth) => c.customer_segment === 'power_user').length,
      };

      return { customers: data, summary };
    },
  });
}

// Hook for cohort analysis
export function useCohortAnalysis() {
  return useQuery({
    queryKey: ['cohort-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohort_retention' as any)
        .select('*')
        .order('signup_cohort', { ascending: false })
        .limit(12); // Last 12 months

      if (error) throw error;
      return data;
    },
  });
}

// Hook for revenue trends
export function useRevenueTrends(months: number = 12) {
  return useQuery({
    queryKey: ['revenue-trends', months],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_by_month' as any)
        .select('*')
        .order('month', { ascending: false })
        .limit(months);

      if (error) throw error;
      return data;
    },
  });
}
