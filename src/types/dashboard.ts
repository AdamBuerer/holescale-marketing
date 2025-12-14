export interface DashboardStats {
  activeRFQs: number;
  pendingOrders: number;
  favoriteSuppliers: number;
  unreadMessages: number;
  totalProducts?: number;
  pendingQuotes?: number;
  totalRevenue?: number;
  pendingDesigns?: number;
  approvedDesigns?: number;
  pendingSamples?: number;
  shippedSamples?: number;
}

export interface BuyerStats {
  activeRFQs: number;
  pendingOrders: number;
  favoriteSuppliers: number;
  unreadMessages: number;
}

export interface SupplierStats {
  totalProducts: number;
  activeRFQs: number;
  pendingQuotes: number;
  pendingOrders: number;
  totalRevenue: number;
  favoriteSuppliers: number;
  unreadMessages: number;
}
