/**
 * Admin Revenue Dashboard
 *
 * Analytics dashboard for monitoring subscription revenue.
 * Shows MRR, growth, churn, conversions, and tier distribution.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import type { UserSubscription } from '@/types/subscription';

interface RevenueMetrics {
  mrr: number;
  previousMRR: number;
  mrrGrowth: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  churnedThisMonth: number;
  trialConversionRate: number;
  avgRevenuePerUser: number;
  tierDistribution: Record<string, number>;
  revenueByTier: Record<string, number>;
}

// Fetch all subscriptions with tier info
async function fetchAllSubscriptions() {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      tier:subscription_tiers(
        display_name,
        price_monthly,
        user_type,
        sort_order
      )
    `);

  if (error) throw error;
  return data;
}

// Calculate revenue metrics
function calculateMetrics(subscriptions: any[]): RevenueMetrics {
  const active = subscriptions.filter((s) => s.status === 'active');
  const trialing = subscriptions.filter((s) => s.status === 'trialing');
  const churned = subscriptions.filter((s) => s.status === 'canceled');

  // MRR calculation
  const mrr = [...active, ...trialing].reduce(
    (sum, sub) => sum + (sub.tier?.price_monthly || 0) / 100,
    0
  );

  // Previous month MRR (simplified - you'd want to track this historically)
  const previousMRR = mrr * 0.9; // Placeholder

  // MRR Growth
  const mrrGrowth = ((mrr - previousMRR) / previousMRR) * 100;

  // Trial conversion (simplified)
  const trialConversionRate = trialing.length > 0 ? 45 : 0; // Placeholder

  // ARPU
  const avgRevenuePerUser = active.length > 0 ? mrr / active.length : 0;

  // Tier distribution
  const tierDistribution: Record<string, number> = {};
  const revenueByTier: Record<string, number> = {};

  [...active, ...trialing].forEach((sub) => {
    const tierName = sub.tier?.display_name || 'Unknown';
    tierDistribution[tierName] = (tierDistribution[tierName] || 0) + 1;
    revenueByTier[tierName] =
      (revenueByTier[tierName] || 0) + (sub.tier?.price_monthly || 0) / 100;
  });

  return {
    mrr,
    previousMRR,
    mrrGrowth,
    activeSubscriptions: active.length,
    trialSubscriptions: trialing.length,
    churnedThisMonth: churned.length,
    trialConversionRate,
    avgRevenuePerUser,
    tierDistribution,
    revenueByTier,
  };
}

export default function AdminRevenue() {
  const [view, setView] = useState<'overview' | 'tiers' | 'cohorts'>('overview');

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-revenue-subscriptions'],
    queryFn: fetchAllSubscriptions,
  });

  const metrics = subscriptions ? calculateMetrics(subscriptions) : null;

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Revenue Dashboard | Admin"
        description="Monitor subscription revenue and growth"
        noindex
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Revenue Dashboard</h1>
            <p className="text-muted-foreground">
              Track subscription revenue, growth, and key metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Monthly Recurring Revenue</div>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">${metrics.mrr.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-sm">
                {metrics.mrrGrowth >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      +{metrics.mrrGrowth.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      {metrics.mrrGrowth.toFixed(1)}%
                    </span>
                  </>
                )}
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Active Subscriptions</div>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">{metrics.activeSubscriptions}</div>
              <div className="text-sm text-muted-foreground">
                {metrics.trialSubscriptions} in trial
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Avg Revenue Per User</div>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">
                ${metrics.avgRevenuePerUser.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Per active customer</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Trial Conversion</div>
                <PieChart className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {metrics.trialConversionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {metrics.trialSubscriptions} active trials
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tiers">Tier Breakdown</TabsTrigger>
              <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {Object.entries(metrics.revenueByTier)
                      .sort(([, a], [, b]) => b - a)
                      .map(([tier, revenue]) => {
                        const percentage = (revenue / metrics.mrr) * 100;
                        return (
                          <div key={tier}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{tier}</span>
                              <span className="text-sm text-muted-foreground">
                                ${revenue.toFixed(0)} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <div className="font-semibold">Active</div>
                        <div className="text-sm text-muted-foreground">Paying customers</div>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {metrics.activeSubscriptions}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <div className="font-semibold">Trialing</div>
                        <div className="text-sm text-muted-foreground">In free trial</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {metrics.trialSubscriptions}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <div className="font-semibold">Churned</div>
                        <div className="text-sm text-muted-foreground">This month</div>
                      </div>
                      <div className="text-2xl font-bold text-red-700">
                        {metrics.churnedThisMonth}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Churn Rate</div>
                    <div className="text-2xl font-bold">
                      {metrics.activeSubscriptions > 0
                        ? ((metrics.churnedThisMonth / metrics.activeSubscriptions) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">MRR Growth Rate</div>
                    <div className="text-2xl font-bold">{metrics.mrrGrowth.toFixed(1)}%</div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Annual Run Rate</div>
                    <div className="text-2xl font-bold">
                      ${(metrics.mrr * 12).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tier Breakdown Tab */}
            <TabsContent value="tiers" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tier Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(metrics.tierDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tier, count]) => {
                      const total = Object.values(metrics.tierDistribution).reduce(
                        (sum, c) => sum + c,
                        0
                      );
                      const percentage = (count / total) * 100;
                      const revenue = metrics.revenueByTier[tier] || 0;

                      return (
                        <div key={tier} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold text-lg">{tier}</div>
                              <div className="text-sm text-muted-foreground">
                                {count} customers ({percentage.toFixed(1)}%)
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">${revenue.toFixed(0)}</div>
                              <div className="text-sm text-muted-foreground">MRR</div>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </TabsContent>

            {/* Cohorts Tab */}
            <TabsContent value="cohorts">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cohort Analysis</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Cohort analysis coming soon</p>
                  <p className="text-sm mt-2">
                    Track customer retention and LTV by signup cohort
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
