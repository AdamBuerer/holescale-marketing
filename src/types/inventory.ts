// Buyer Inventory Type Definitions

export type TransactionType = 'restock' | 'consumption' | 'adjustment';
export type AlertType = 'low_stock' | 'out_of_stock' | 'overstock' | 'reorder_recommended';
export type InventoryStatus = 'healthy' | 'low_stock' | 'out_of_stock' | 'overstock';

export interface BuyerInventoryItem {
  id: string;
  buyer_id: string;
  product_id: string | null;
  product_name: string;
  sku: string | null;
  barcode: string | null;
  quantity_on_hand: number;
  min_threshold: number;
  max_threshold: number;
  reorder_point: number;
  unit_cost: number | null;
  location: string | null;
  last_restock_date: string | null;
  last_consumption_date: string | null;
  preferred_supplier_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  buyer_id: string;
  transaction_type: TransactionType;
  quantity_change: number;
  quantity_after: number;
  reference_order_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface InventoryAlert {
  id: string;
  buyer_id: string;
  inventory_id: string;
  alert_type: AlertType;
  triggered_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

export interface AddInventoryItemFormData {
  product_name: string;
  sku?: string;
  barcode?: string;
  quantity_on_hand: number;
  min_threshold: number;
  max_threshold: number;
  reorder_point: number;
  unit_cost?: number;
  location?: string;
  preferred_supplier_id?: string;
  notes?: string;
  product_id?: string;
}

export interface AdjustInventoryFormData {
  transaction_type: TransactionType;
  quantity_change: number;
  notes?: string;
}
