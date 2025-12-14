import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface SearchSuggestion {
  query: string;
  type: 'recent' | 'trending' | 'recommended';
  count?: number;
  category?: string;
}

export function useSmartSearch() {
  const { user } = useAuth();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<SearchSuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadSearchData();
  }, [user]);

  const loadSearchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get recent searches from user activity
      const { data: recentActivity } = await supabase
        .from('user_activity')
        .select('search_query')
        .eq('user_id', user.id)
        .eq('activity_type', 'search')
        .not('search_query', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentActivity) {
        const uniqueSearches = [...new Set(recentActivity.map(a => a.search_query).filter(Boolean))] as string[];
        setRecentSearches(uniqueSearches);
      }

      // Get trending searches (most searched in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: trendingActivity } = await supabase
        .from('user_activity')
        .select('search_query')
        .eq('activity_type', 'search')
        .not('search_query', 'is', null)
        .gte('created_at', sevenDaysAgo.toISOString())
        .limit(100);

      if (trendingActivity) {
        const searchCounts: Record<string, number> = {};
        trendingActivity.forEach(a => {
          if (a.search_query) {
            searchCounts[a.search_query] = (searchCounts[a.search_query] || 0) + 1;
          }
        });

        const trending = Object.entries(searchCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([query, count]) => ({
            query,
            type: 'trending' as const,
            count,
          }));

        setTrendingSearches(trending);
      }

      // Get recommendations based on user's recent orders/RFQs
      const { data: userRfqs } = await supabase
        .from('rfqs')
        .select('product_name')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (userRfqs) {
        const recommended = userRfqs
          .filter(r => r.product_name)
          .map(r => ({
            query: `${r.product_name} matching items`,
            type: 'recommended' as const,
          }));
        setRecommendations(recommended);
      }

      setLoading(false);
    } catch (error) {
      logger.error('Error loading search data', { error });
      setLoading(false);
    }
  };

  const trackSearch = async (query: string) => {
    if (!user || !query.trim()) return;

    try {
      await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'search',
        search_query: query.trim(),
      });

      // Refresh recent searches
      loadSearchData();
    } catch (error) {
      logger.error('Error tracking search', { error });
    }
  };

  const clearRecentSearches = async () => {
    if (!user) return;

    try {
      // We can't delete from user_activity, so just clear local state
      setRecentSearches([]);
    } catch (error) {
      logger.error('Error clearing searches', { error });
    }
  };

  return {
    recentSearches,
    trendingSearches,
    recommendations,
    loading,
    trackSearch,
    clearRecentSearches,
    refresh: loadSearchData,
  };
}
