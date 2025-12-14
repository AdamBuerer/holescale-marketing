import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface RecentItem {
  id: string;
  type: 'product' | 'supplier';
  data: Record<string, unknown>;
  viewedAt: string;
}

export function useRecentlyViewed() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    loadRecentItems();
  }, []);

  const loadRecentItems = () => {
    const stored = localStorage.getItem('recently_viewed');
    if (stored) {
      setRecentItems(JSON.parse(stored));
    }
  };

  const addRecentItem = async (type: 'product' | 'supplier', id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let itemData;
    if (type === 'product') {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, images, price')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        logger.error('Error loading product', { error });
        return;
      }
      itemData = data;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, company_name, company_logo_url, address, city, state, country')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        logger.error('Error loading profile', { error });
        return;
      }
      itemData = data;
    }

    if (!itemData) return;

    const newItem: RecentItem = {
      id,
      type,
      data: itemData,
      viewedAt: new Date().toISOString(),
    };

    const current = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    const filtered = current.filter((item: RecentItem) => 
      !(item.id === id && item.type === type)
    );
    const updated = [newItem, ...filtered].slice(0, 20);
    
    localStorage.setItem('recently_viewed', JSON.stringify(updated));
    setRecentItems(updated);
  };

  const clearRecentItems = () => {
    localStorage.removeItem('recently_viewed');
    setRecentItems([]);
  };

  return { recentItems, addRecentItem, clearRecentItems };
}
