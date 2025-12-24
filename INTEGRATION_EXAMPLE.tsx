/**
 * Complete Integration Example
 *
 * This file shows how to integrate all subscription components
 * into a real application. Copy and adapt as needed.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Your auth hook
import { useFeatureGate } from '@/hooks/useFeatureGate';

// Subscription components
import { FeatureGate, RequiresFeature, RequiresUsage } from '@/components/subscription/FeatureGate';
import { TrialBanner, TrialBadge } from '@/components/subscription/TrialBanner';
import { UsageProgressBar, UsageAlert } from '@/components/subscription/UsageIndicator';
import { UpgradeButton, UpgradeModal } from '@/components/subscription/UpgradePrompt';

// Subscription pages
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import BillingSettings from '@/pages/BillingSettings';
import UsageDashboard from '@/pages/UsageDashboard';

// Your app pages
import Dashboard from '@/pages/Dashboard';
import RFQList from '@/pages/RFQList';
import CreateRFQ from '@/pages/CreateRFQ';
import Inventory from '@/pages/Inventory';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

// ============================================================================
// EXAMPLE 1: App Shell with Trial Banner
// ============================================================================

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation with trial badge */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <NavLinks />
          </div>

          <div className="flex items-center gap-4">
            <TrialBadge userId={user?.id} />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Trial banner below nav */}
      <TrialBanner userId={user?.id} dismissible />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Dashboard with Usage Indicators
// ============================================================================

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Usage alerts at top */}
      <div className="space-y-3">
        <UsageAlert userId={user?.id} featureKey="rfq_limit_monthly" warnAt={80} />
        <UsageAlert userId={user?.id} featureKey="saved_suppliers_limit" warnAt={80} />
      </div>

      {/* Usage overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <UsageProgressBar
          userId={user?.id}
          featureKey="rfq_limit_monthly"
          label="RFQs This Month"
        />
        <UsageProgressBar
          userId={user?.id}
          featureKey="saved_suppliers_limit"
          label="Saved Suppliers"
        />
        <UsageProgressBar
          userId={user?.id}
          featureKey="inventory_sku_limit"
          label="Inventory SKUs"
        />
      </div>

      {/* Rest of dashboard */}
      <DashboardStats />
      <RecentActivity />
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Create RFQ with Usage Limit
// ============================================================================

export function CreateRFQPage() {
  const { user } = useAuth();
  const { canUse, getRemaining, incrementUsage } = useFeatureGate(user?.id);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: RFQData) => {
    // Check usage limit
    if (!canUse('rfq_limit_monthly')) {
      toast.error('You\'ve reached your RFQ limit');
      return;
    }

    try {
      setLoading(true);

      // Create the RFQ
      await createRFQ(data);

      // Increment usage
      await incrementUsage('rfq_limit_monthly');

      toast.success('RFQ created successfully!');
      navigate('/rfqs');
    } catch (error) {
      toast.error('Failed to create RFQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequiresUsage userId={user?.id} usageKey="rfq_limit_monthly">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create RFQ</h1>
          <div className="text-sm text-muted-foreground">
            {getRemaining('rfq_limit_monthly')} RFQs remaining this month
          </div>
        </div>

        <RFQForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </RequiresUsage>
  );
}

// ============================================================================
// EXAMPLE 4: Feature-Gated Inventory Page
// ============================================================================

export function InventoryPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <UsageProgressBar
          userId={user?.id}
          featureKey="inventory_sku_limit"
          label="SKUs"
          showDetails={false}
        />
      </div>

      <RequiresFeature
        userId={user?.id}
        featureKey="inventory_tracking"
      >
        <div className="space-y-4">
          <InventoryFilters />
          <InventoryTable />
          <AddInventoryButton />
        </div>
      </RequiresFeature>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Analytics with Tier Gate
// ============================================================================

export function AnalyticsPage() {
  const { user } = useAuth();
  const { hasFeature, tierLevel } = useFeatureGate(user?.id);

  const analyticsLevel = hasFeature('analytics_dashboard')
    ? tierLevel >= 3 ? 'advanced' : 'basic'
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <FeatureGate
        userId={user?.id}
        feature="analytics_dashboard"
        upgradeMessage="Upgrade to access analytics and insights"
      >
        {/* Basic analytics for Growth tier */}
        <BasicAnalytics />

        {/* Advanced analytics only for Pro+ */}
        <FeatureGate userId={user?.id} minTier={3} showUpgrade={false}>
          <AdvancedAnalytics />
        </FeatureGate>
      </FeatureGate>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Settings Page with Billing
// ============================================================================

export function SettingsPage() {
  const { user } = useAuth();
  const { subscription, isTrialing, trialDaysRemaining } = useFeatureGate(user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>

        <TabsContent value="usage">
          <UsageDashboard />
        </TabsContent>

        <TabsContent value="team">
          <RequiresFeature userId={user?.id} featureKey="team_seats">
            <TeamSettings />
          </RequiresFeature>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Navigation with Upgrade Button
// ============================================================================

function Navigation() {
  const { user } = useAuth();
  const { subscription } = useFeatureGate(user?.id);
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false);

  return (
    <>
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <NavLinks />

            <div className="flex items-center gap-4">
              <TrialBadge userId={user?.id} />

              {subscription?.tier.is_free && (
                <UpgradeButton
                  userId={user?.id}
                  variant="default"
                  size="sm"
                >
                  Upgrade
                </UpgradeButton>
              )}

              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        userId={user?.id}
      />
    </>
  );
}

// ============================================================================
// EXAMPLE 8: Complete App Routes
// ============================================================================

export function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Subscription routes */}
      <Route path="/checkout/success" element={<CheckoutSuccess />} />

      {/* Protected app routes */}
      <Route path="/app" element={<AppShell><Outlet /></AppShell>}>
        <Route index element={<DashboardPage />} />
        <Route path="rfqs" element={<RFQList />} />
        <Route path="rfqs/create" element={<CreateRFQPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />

        {/* Settings routes */}
        <Route path="settings" element={<SettingsPage />}>
          <Route path="billing" element={<BillingSettings />} />
          <Route path="usage" element={<UsageDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

// ============================================================================
// EXAMPLE 9: Conditional Feature Display
// ============================================================================

export function FeatureList() {
  const { user } = useAuth();
  const { hasFeature } = useFeatureGate(user?.id);

  return (
    <nav>
      <NavItem to="/app">Dashboard</NavItem>
      <NavItem to="/app/rfqs">RFQs</NavItem>

      {hasFeature('inventory_tracking') && (
        <NavItem to="/app/inventory">Inventory</NavItem>
      )}

      {hasFeature('analytics_dashboard') && (
        <NavItem to="/app/analytics">Analytics</NavItem>
      )}

      {hasFeature('api_access') && (
        <NavItem to="/app/api">API</NavItem>
      )}

      <NavItem to="/app/settings">Settings</NavItem>
    </nav>
  );
}

// ============================================================================
// EXAMPLE 10: Action Button with Usage Check
// ============================================================================

export function ActionButton() {
  const { user } = useAuth();
  const { canUse, getRemaining } = useFeatureGate(user?.id);

  const canCreate = canUse('rfq_limit_monthly');
  const remaining = getRemaining('rfq_limit_monthly');

  return (
    <div className="space-y-2">
      <Button
        disabled={!canCreate}
        onClick={handleCreate}
        className="w-full"
      >
        Create RFQ
      </Button>

      {!canCreate ? (
        <p className="text-sm text-destructive text-center">
          Limit reached. <UpgradeButton variant="link" className="p-0 h-auto">Upgrade</UpgradeButton> to continue
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          {remaining === 'unlimited' ? 'Unlimited' : `${remaining} remaining`} this month
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Helper Components (implement these in your app)
// ============================================================================

function Logo() { return <div>HoleScale</div>; }
function NavLinks() { return <div>Links</div>; }
function UserMenu() { return <div>User</div>; }
function DashboardStats() { return <div>Stats</div>; }
function RecentActivity() { return <div>Activity</div>; }
function RFQForm({ onSubmit, loading }: any) { return <div>Form</div>; }
function InventoryFilters() { return <div>Filters</div>; }
function InventoryTable() { return <div>Table</div>; }
function AddInventoryButton() { return <button>Add</button>; }
function BasicAnalytics() { return <div>Basic</div>; }
function AdvancedAnalytics() { return <div>Advanced</div>; }
function GeneralSettings() { return <div>General</div>; }
function TeamSettings() { return <div>Team</div>; }
function NavItem({ to, children }: any) { return <a href={to}>{children}</a>; }

type RFQData = any;
async function createRFQ(data: RFQData) {}
function toast(opts: any) {}
function navigate(path: string) {}
