import { 
  FileText, 
  Inbox, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  Search, 
  Package, 
  FileSearch,
  DollarSign,
  Building,
  Users,
  ClipboardList,
  TrendingUp
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Pre-configured empty states for common scenarios
 * Import and use directly in your pages
 */

// BUYER EMPTY STATES

export const EmptyRFQs = ({ onCreate, onBrowse }: { onCreate: () => void; onBrowse: () => void }) => (
  <EmptyState
    icon={ClipboardList}
    title="No RFQs Yet"
    description="Create your first Request for Quote to get started receiving competitive bids from verified suppliers."
    primaryAction={{
      label: "Create First RFQ",
      onClick: onCreate,
    }}
    secondaryAction={{
      label: "Browse Suppliers",
      onClick: onBrowse,
    }}
    helpText="Most buyers receive 5+ quotes within 24 hours"
  />
);

export const EmptyQuotes = ({ onViewRFQs }: { onViewRFQs: () => void }) => (
  <EmptyState
    icon={DollarSign}
    title="No Quotes Yet"
    description="Your RFQs are live! Suppliers are reviewing them. You'll be notified when quotes start coming in."
    primaryAction={{
      label: "View My RFQs",
      onClick: onViewRFQs,
    }}
    helpText="Average response time: 24-48 hours"
  />
);

export const EmptyOrders = ({ onViewQuotes }: { onViewQuotes: () => void }) => (
  <EmptyState
    icon={ShoppingCart}
    title="No Orders Yet"
    description="Once you accept a quote, your orders will appear here for easy tracking and management."
    primaryAction={{
      label: "View Pending Quotes",
      onClick: onViewQuotes,
    }}
    helpText="Track everything from payment to delivery"
  />
);

export const EmptyMessages = ({ onFindSuppliers }: { onFindSuppliers: () => void }) => (
  <EmptyState
    icon={MessageSquare}
    title="No Messages"
    description="Start a conversation with a supplier by requesting a quote or asking a question."
    primaryAction={{
      label: "Find Suppliers",
      onClick: onFindSuppliers,
    }}
    helpText="Direct messaging with verified suppliers"
  />
);

export const EmptyFavorites = ({ onExplore }: { onExplore: () => void }) => (
  <EmptyState
    icon={Star}
    title="No Favorites Yet"
    description="Save your preferred suppliers for quick access and streamlined ordering."
    primaryAction={{
      label: "Explore Suppliers",
      onClick: onExplore,
    }}
    helpText="Build your network of trusted suppliers"
  />
);

export const EmptyProducts = ({ onBrowse }: { onBrowse: () => void }) => (
  <EmptyState
    icon={Package}
    title="No Products Found"
    description="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
    primaryAction={{
      label: "Browse All Products",
      onClick: onBrowse,
    }}
  />
);

export const EmptySearchResults = ({ onClearFilters, onCreateRFQ }: { onClearFilters: () => void; onCreateRFQ: () => void }) => (
  <EmptyState
    icon={Search}
    title="No Results Found"
    description="Try adjusting your filters or search terms. Or create a custom RFQ to get exactly what you need."
    primaryAction={{
      label: "Clear Filters",
      onClick: onClearFilters,
    }}
    secondaryAction={{
      label: "Create Custom RFQ",
      onClick: onCreateRFQ,
    }}
    helpText="Can't find what you're looking for? Suppliers can create custom solutions"
  />
);

// SUPPLIER EMPTY STATES

export const EmptySupplierProducts = ({ onAddProduct, onBulkUpload }: { onAddProduct: () => void; onBulkUpload?: () => void }) => (
  <EmptyState
    icon={Package}
    title="No Products Yet"
    description="Add products to your catalog to attract more buyers and showcase your capabilities."
    primaryAction={{
      label: "Add First Product",
      onClick: onAddProduct,
    }}
    secondaryAction={onBulkUpload ? {
      label: "Bulk Upload",
      onClick: onBulkUpload,
    } : undefined}
    helpText="Suppliers with complete catalogs get 3x more inquiries"
  />
);

export const EmptyRFQMarketplace = ({ onClearFilters, onUpdateProfile }: { onClearFilters: () => void; onUpdateProfile: () => void }) => (
  <EmptyState
    icon={FileSearch}
    title="No Matching RFQs"
    description="No RFQs match your current filters. Broaden your search or update your profile to see more opportunities."
    primaryAction={{
      label: "Clear Filters",
      onClick: onClearFilters,
    }}
    secondaryAction={{
      label: "Update Profile",
      onClick: onUpdateProfile,
    }}
    helpText="Complete profiles get matched with 5x more RFQs"
  />
);

export const EmptySupplierQuotes = ({ onExploreRFQs }: { onExploreRFQs: () => void }) => (
  <EmptyState
    icon={DollarSign}
    title="No Quotes Submitted"
    description="Browse the RFQ marketplace and submit competitive quotes to win new business."
    primaryAction={{
      label: "Explore RFQs",
      onClick: onExploreRFQs,
    }}
    helpText="Average quote acceptance rate: 35%"
  />
);

export const EmptySupplierOrders = ({ onExploreRFQs }: { onExploreRFQs: () => void }) => (
  <EmptyState
    icon={ShoppingCart}
    title="No Orders Yet"
    description="Orders appear here when buyers accept your quotes. Start by browsing and quoting on active RFQs."
    primaryAction={{
      label: "Explore RFQs",
      onClick: onExploreRFQs,
    }}
    helpText="First-time suppliers typically land their first order within 2 weeks"
  />
);

// ADMIN EMPTY STATES

export const EmptyUsers = () => (
  <EmptyState
    icon={Users}
    title="No Users Found"
    description="No users match your current filters or search criteria."
  />
);

export const EmptyPendingVerifications = () => (
  <EmptyState
    icon={Building}
    title="No Pending Verifications"
    description="All supplier verification requests have been processed. New requests will appear here."
    helpText="Great job staying on top of verifications!"
  />
);

export const EmptyAnalytics = () => (
  <EmptyState
    icon={TrendingUp}
    title="No Data Yet"
    description="Analytics data will appear here once there's activity in the system."
    helpText="Check back later for insights"
  />
);
