import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

/**
 * Smart Breadcrumbs component that auto-generates breadcrumbs from the current path
 * or uses provided items for custom breadcrumb trails.
 */
export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if no items provided
  const generatedItems = items || generateBreadcrumbs(location.pathname);

  if (generatedItems.length === 0 && !showHome) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-muted-foreground py-2", className)}>
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          {generatedItems.length > 0 && <ChevronRight className="h-4 w-4" />}
        </>
      )}

      {generatedItems.map((item, index) => {
        const isLast = index === generatedItems.length - 1;

        return (
          <div key={index} className="flex items-center space-x-1">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-foreground font-medium")}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Generate breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Path label mapping for better readability
  const labelMap: Record<string, string> = {
    buyer: 'Buyer Portal',
    supplier: 'Supplier Portal',
    admin: 'Admin Panel',
    dashboard: 'Dashboard',
    rfqs: 'RFQs',
    'rfq-marketplace': 'RFQ Marketplace',
    quotes: 'Quotes',
    orders: 'Orders',
    messages: 'Messages',
    products: 'Products',
    inventory: 'Inventory',
    analytics: 'Analytics',
    settings: 'Settings',
    profile: 'Profile',
    support: 'Support',
    notifications: 'Notifications',
    favorites: 'Favorites',
    'rfq/new': 'Create RFQ',
    vendors: 'Vendors',
    samples: 'Samples',
    budgets: 'Budgets',
    explore: 'Explore',
    warehouse: 'Warehouse',
    resources: 'Resources',
    help: 'Help',
    'payment-methods': 'Payment Methods',
    mockups: 'Mockups',
    'design-studio': 'Design Studio',
    catalog: 'Catalog',
    'favorite-products': 'Favorite Products',
    'favorite-suppliers': 'Favorite Suppliers',
    'approved-vendors': 'My Vendors',
    'bulk-calculator': 'Bulk Calculator',
    'spend-forecasting': 'Spend Forecasting',
    verification: 'Verification',
    earnings: 'Earnings',
    'sample-requests': 'Sample Requests',
    compliance: 'Compliance',
    'auto-quote-rules': 'Auto Quote Rules',
    users: 'Users',
    'email-management': 'Email Management',
    'verification-queue': 'Verification Queue',
    'data-management': 'Data Management',
    'data-audit': 'Data Audit',
    seed: 'Seed Data',
    'seed-comprehensive': 'Comprehensive Seed',
    'cleanup-seed-data': 'Cleanup Seed Data',
    'error-logs': 'Error Logs',
    security: 'Security',
    testing: 'Testing',
    'trending-management': 'Trending Management',
    'model-library': 'Model Library',
    'cron-monitoring': 'Cron Monitoring',
    'system-status': 'System Status',
    'populate-images': 'Populate Images',
    search: 'Search',
  };

  let href = '';
  segments.forEach((segment, index) => {
    href += `/${segment}`;
    
    // Skip adding numeric IDs as breadcrumbs (they'll show as detail pages)
    if (/^[0-9a-f-]{36}$/.test(segment) || /^\d+$/.test(segment)) {
      if (index > 0) {
        breadcrumbs[breadcrumbs.length - 1].label += ' Details';
      }
      return;
    }

    const label = labelMap[segment] || formatLabel(segment);
    
    // Don't link the last item
    breadcrumbs.push({
      label,
      href: index < segments.length - 1 ? href : undefined
    });
  });

  return breadcrumbs;
}

/**
 * Format segment into readable label
 */
function formatLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
