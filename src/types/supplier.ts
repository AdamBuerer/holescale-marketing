// types/supplier.ts

export interface Supplier {
  id: string;
  created_at: string;
  
  // Profile/Company Info
  company_name: string;
  company_logo_url: string | null;
  company_description: string | null;
  company_tagline: string | null;
  slogan?: string | null;
  
  // Location
  location?: string | null;
  city: string | null;
  state: string | null;
  country: string;
  
  // Business Details
  years_in_business: number | null;
  company_size: string | null;
  industry: string | null;
  website?: string | null;
  date_founded?: string | null;
  
  // Product/Service Info
  product_types: string[] | null;
  min_order_quantity: string | null;
  lead_time: string | null;
  certifications: string[] | null;
  
  // Status
  verification_status: 'verified' | 'pending' | 'unverified';
  is_active: boolean;
  featured?: boolean;
  
  // User relationship
  user_id: string;
  
  // Computed/Aggregated Fields (from joins or calculations)
  avg_rating?: number | null;
  review_count?: number;
  is_saved?: boolean; // if current user has favorited this supplier
  response_time_hours?: number | null; // calculate from message data
}

export interface SupplierCardProps {
  supplier: Supplier;
  layout?: 'horizontal' | 'vertical';
  viewerRole?: 'buyer' | 'supplier' | 'admin' | 'anonymous';
  isOwnProfile?: boolean;
  onRequestQuote?: (supplierId: string) => void;
  onMessage?: (supplierId: string) => void;
  onViewProfile?: (supplierId: string) => void;
  onSave?: (supplierId: string, currentlySaved: boolean) => Promise<void>;
  className?: string;
}

export interface SupplierGridProps {
  suppliers: Supplier[];
  isLoading?: boolean;
  viewerRole?: 'buyer' | 'supplier' | 'admin' | 'anonymous';
  currentUserId?: string | null; // Current user's ID to check if profile is own
  onRequestQuote?: (supplierId: string) => void;
  onMessage?: (supplierId: string) => void;
  onViewProfile?: (supplierId: string) => void;
  onSave?: (supplierId: string, currentlySaved: boolean) => Promise<void>;
  emptyState?: React.ReactNode;
  skeletonCount?: number;
}

export interface SupplierListProps extends SupplierGridProps {
  // Same props as grid, but renders horizontal cards
}

// Helper type for badge variants
export type BadgeVariant = 'verified' | 'featured' | 'new';

// Helper type for price level
export type PriceLevel = 1 | 2 | 3;

// Location display helper
export interface LocationDisplay {
  short: string; // "Denver, CO"
  full: string; // "Denver, Colorado, US"
}

