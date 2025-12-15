/**
 * Usage Dashboard Page
 *
 * Shows users their current usage across all metered features.
 * Displays limits, remaining quota, and reset dates.
 */

import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SEO from '@/components/SEO';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UsageProgressBar, UsageCard, UsageAlert } from '@/components/subscription/UsageIndicator';
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { UpgradeButton } from '@/components/subscription/UpgradePrompt';
import type { BuyerFeatureKey, SupplierFeatureKey } from '@/types/subscription';

// Placeholder auth hook
const useAuth = () => {
  return {
    user: {
      id: 'user-id',
      type: 'buyer' as 'buyer' | 'supplier',
    },
  };
};

// Get the first day of next month
function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export default function UsageDashboard() {
  const { user } = useAuth();
  const {
    loading,
    subscription,
    tierLevel,
    transactionFeePercent,
  } = useFeatureGate(user?.id);

  const nextReset = getNextResetDate();
  const isBuyer = user.type === 'buyer';

  // Define feature keys based on user type
  const usageFeatures: BuyerFeatureKey[] | SupplierFeatureKey[] = isBuyer
    ? ['rfq_limit_monthly', 'saved_suppliers_limit', 'inventory_sku_limit', 'team_seats']
    : ['rfq_responses_monthly', 'team_seats'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Usage Dashboard | HoleScale"
        description="View your current usage and limits"
        noindex
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Usage Dashboard</h1>
            <p className="text-muted-foreground">
              Track your usage across all features
            </p>
          </div>

          {/* Trial Banner */}
          <TrialBanner userId={user?.id} dismissible />

          {/* Usage Alerts */}
          <div className="space-y-3 mb-6">
            {usageFeatures.map((feature) => (
              <UsageAlert
                key={feature}
                userId={user?.id}
                featureKey={feature}
                warnAt={80}
              />
            ))}
          </div>

          {/* Current Plan Summary */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Current Plan</h2>
                <p className="text-muted-foreground text-sm">
                  {subscription?.tier.display_name}
                </p>
              </div>
              <UpgradeButton userId={user?.id} variant="outline" size="sm">
                Upgrade Plan
              </UpgradeButton>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Tier Level</div>
                <div className="text-2xl font-bold">{tierLevel}</div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Transaction Fee</div>
                <div className="text-2xl font-bold">{transactionFeePercent}%</div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Resets On</div>
                <div className="text-2xl font-bold">
                  {nextReset.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Usage Overview</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Resets {nextReset.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isBuyer ? (
                <>
                  <UsageCard
                    userId={user?.id}
                    featureKey="rfq_limit_monthly"
                    label="RFQs This Month"
                  />
                  <UsageCard
                    userId={user?.id}
                    featureKey="saved_suppliers_limit"
                    label="Saved Suppliers"
                  />
                  <UsageCard
                    userId={user?.id}
                    featureKey="inventory_sku_limit"
                    label="Inventory SKUs"
                  />
                  <UsageCard
                    userId={user?.id}
                    featureKey="team_seats"
                    label="Team Members"
                  />
                </>
              ) : (
                <>
                  <UsageCard
                    userId={user?.id}
                    featureKey="rfq_responses_monthly"
                    label="RFQ Responses"
                  />
                  <UsageCard
                    userId={user?.id}
                    featureKey="team_seats"
                    label="Team Members"
                  />
                </>
              )}
            </div>
          </div>

          {/* Detailed Usage */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Detailed Usage</h2>
            </div>

            <div className="space-y-6">
              {usageFeatures.map((feature) => {
                const label = feature
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <UsageProgressBar
                    key={feature}
                    userId={user?.id}
                    featureKey={feature}
                    label={label}
                    showDetails
                    warnAt={80}
                  />
                );
              })}
            </div>
          </Card>

          {/* Upgrade CTA */}
          {subscription?.tier.is_free && (
            <Alert className="mt-6 border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-primary">
                  Unlock unlimited usage with a paid plan
                </span>
                <UpgradeButton userId={user?.id} variant="default" size="sm">
                  View Plans
                </UpgradeButton>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
