import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InventoryTransaction } from '@/types/inventory';

export function useInventoryTransactions(inventoryId: string | undefined) {
  return useQuery({
    queryKey: ['inventory-transactions', inventoryId],
    queryFn: async () => {
      if (!inventoryId) return [];
      
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*')
        .eq('inventory_id', inventoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InventoryTransaction[];
    },
    enabled: !!inventoryId,
  });
}

export function useAllTransactions(buyerId: string | undefined) {
  return useQuery({
    queryKey: ['all-inventory-transactions', buyerId],
    queryFn: async () => {
      if (!buyerId) return [];
      
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*, buyer_inventory(*)')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!buyerId,
  });
}
