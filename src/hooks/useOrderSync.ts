import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface SyncOrderToInventoryData {
  orderId: string;
  buyerId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  supplierId: string;
  sku?: string;
}

export function useSyncOrderToInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SyncOrderToInventoryData) => {
      // Check if item already exists in inventory
      const { data: existingItem, error: findError } = await supabase
        .from('buyer_inventory')
        .select('*')
        .eq('buyer_id', data.buyerId)
        .eq('product_name', data.productName)
        .maybeSingle();

      if (findError) throw findError;

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity_on_hand + data.quantity;
        
        const { error: updateError } = await supabase
          .from('buyer_inventory')
          .update({
            quantity_on_hand: newQuantity,
            unit_cost: data.unitPrice,
            last_restock_date: new Date().toISOString(),
            preferred_supplier_id: data.supplierId,
          })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;

        // Create transaction record
        await supabase.from('inventory_transactions').insert({
          inventory_id: existingItem.id,
          buyer_id: data.buyerId,
          transaction_type: 'restock',
          quantity_change: data.quantity,
          quantity_after: newQuantity,
          reference_order_id: data.orderId,
          notes: `Auto-synced from order delivery`,
        });

        return { action: 'updated', item: existingItem };
      } else {
        // Create new inventory item
        const { data: newItem, error: insertError } = await supabase
          .from('buyer_inventory')
          .insert({
            buyer_id: data.buyerId,
            product_name: data.productName,
            sku: data.sku,
            quantity_on_hand: data.quantity,
            min_threshold: Math.ceil(data.quantity * 0.2), // 20% of initial quantity
            max_threshold: data.quantity * 2,
            reorder_point: Math.ceil(data.quantity * 0.3),
            unit_cost: data.unitPrice,
            last_restock_date: new Date().toISOString(),
            preferred_supplier_id: data.supplierId,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Create initial transaction
        await supabase.from('inventory_transactions').insert({
          inventory_id: newItem.id,
          buyer_id: data.buyerId,
          transaction_type: 'restock',
          quantity_change: data.quantity,
          quantity_after: data.quantity,
          reference_order_id: data.orderId,
          notes: `Initial stock from order delivery`,
        });

        return { action: 'created', item: newItem };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      
      toast({
        title: result.action === 'created' ? 'Item added to inventory' : 'Inventory updated',
        description: `${result.item.product_name} has been synced from your order`,
      });
    },
    onError: (error: unknown) => {
      logger.error('Error syncing order to inventory', { error });
      toast({
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Failed to sync order to inventory',
        variant: 'destructive',
      });
    },
  });
}
