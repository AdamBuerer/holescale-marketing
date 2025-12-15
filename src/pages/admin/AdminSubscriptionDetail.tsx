/**
 * Admin Subscription Detail
 *
 * Detailed view of a single subscription with admin actions.
 * Allows extending trial, changing tier, applying credits, etc.
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  TrendingUp,
  Clock,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { UserSubscription, SubscriptionEvent } from '@/types/subscription';

interface SubscriptionDetails extends UserSubscription {
  tier: {
    id: string;
    display_name: string;
    price_monthly: number;
    transaction_fee_percent: number;
  };
}

// Fetch subscription details
async function fetchSubscriptionDetail(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      tier:subscription_tiers(
        id,
        display_name,
        price_monthly,
        transaction_fee_percent
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SubscriptionDetails;
}

// Fetch subscription events
async function fetchSubscriptionEvents(subscriptionId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('subscription_events')
    .select('*')
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as SubscriptionEvent[];
}

// Fetch usage for subscription
async function fetchUsage(userId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .gte('period_start', periodStart.toISOString().split('T')[0]);

  if (error) throw error;
  return data;
}

export default function AdminSubscriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [extendTrialDays, setExtendTrialDays] = useState(7);
  const [extendTrialDialogOpen, setExtendTrialDialogOpen] = useState(false);
  const [changeTierDialogOpen, setChangeTierDialogOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('');

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['admin-subscription-detail', id],
    queryFn: () => fetchSubscriptionDetail(id!),
    enabled: !!id,
  });

  const { data: events } = useQuery({
    queryKey: ['admin-subscription-events', id],
    queryFn: () => fetchSubscriptionEvents(id!),
    enabled: !!id,
  });

  const { data: usage } = useQuery({
    queryKey: ['admin-subscription-usage', subscription?.user_id],
    queryFn: () => fetchUsage(subscription!.user_id),
    enabled: !!subscription?.user_id,
  });

  // Extend trial mutation
  const extendTrialMutation = useMutation({
    mutationFn: async (days: number) => {
      if (!subscription || !supabase) return;

      const currentEnd = new Date(subscription.trial_end || Date.now());
      const newEnd = new Date(currentEnd);
      newEnd.setDate(newEnd.getDate() + days);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ trial_end: newEnd.toISOString() })
        .eq('id', subscription.id);

      if (error) throw error;

      // Log event
      await supabase.from('subscription_events').insert({
        user_id: subscription.user_id,
        subscription_id: subscription.id,
        event_type: 'trial_extended',
        metadata: { days_extended: days, new_end: newEnd.toISOString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-detail'] });
      toast.success('Trial extended successfully');
      setExtendTrialDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to extend trial');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Subscription not found</p>
        </div>
      </div>
    );
  }

  const isTrialing = subscription.status === 'trialing';
  const trialDaysRemaining = isTrialing && subscription.trial_end
    ? Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      <SEO
        title={`Subscription ${id} | Admin`}
        description="View subscription details"
        noindex
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/admin/subscriptions">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subscriptions
              </Link>
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Subscription Details</h1>
                <p className="text-muted-foreground">
                  ID: {subscription.id.slice(0, 8)}...
                </p>
              </div>

              <Badge
                className={
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : subscription.status === 'trialing'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }
              >
                {subscription.status}
              </Badge>
            </div>
          </div>

          {/* Warning for canceled */}
          {subscription.cancel_at_period_end && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This subscription will be canceled on{' '}
                {subscription.current_period_end &&
                  new Date(subscription.current_period_end).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Tier</div>
                    <div className="font-semibold text-lg">{subscription.tier.display_name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Monthly Price</div>
                    <div className="font-semibold text-lg">
                      ${(subscription.tier.price_monthly / 100).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Transaction Fee</div>
                    <div className="font-semibold text-lg">
                      {subscription.tier.transaction_fee_percent}%
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Billing Cycle</div>
                    <div className="font-semibold text-lg capitalize">
                      {subscription.billing_cycle}
                    </div>
                  </div>

                  {subscription.current_period_start && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Period Start</div>
                      <div className="font-medium">
                        {new Date(subscription.current_period_start).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {subscription.current_period_end && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Period End</div>
                      <div className="font-medium">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {isTrialing && subscription.trial_end && (
                    <div className="sm:col-span-2">
                      <div className="text-sm text-muted-foreground mb-1">Trial Ends</div>
                      <div className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {new Date(subscription.trial_end).toLocaleDateString()}
                        <Badge className="bg-blue-100 text-blue-700">
                          {trialDaysRemaining} days remaining
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* User Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </h2>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">User ID</div>
                    <div className="font-mono text-sm">{subscription.user_id}</div>
                  </div>

                  {subscription.stripe_customer_id && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Stripe Customer ID</div>
                      <div className="font-mono text-sm">{subscription.stripe_customer_id}</div>
                    </div>
                  )}

                  {subscription.stripe_subscription_id && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Stripe Subscription ID
                      </div>
                      <div className="font-mono text-sm">{subscription.stripe_subscription_id}</div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Usage Stats */}
              {usage && usage.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Current Usage
                  </h2>

                  <div className="space-y-3">
                    {usage.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="font-medium">
                          {item.feature_key.replace(/_/g, ' ')}
                        </span>
                        <Badge variant="outline">{item.usage_count}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Event Timeline */}
              {events && events.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Timeline
                  </h2>

                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 border-l-2 border-primary/20 pl-4"
                      >
                        <div className="flex-1">
                          <div className="font-medium capitalize">
                            {event.event_type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                          {event.metadata && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(event.metadata)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar - Admin Actions */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Actions
                </h2>

                <div className="space-y-3">
                  {isTrialing && (
                    <Button
                      onClick={() => setExtendTrialDialogOpen(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Extend Trial
                    </Button>
                  )}

                  <Button
                    onClick={() => setChangeTierDialogOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Change Tier
                  </Button>

                  <Button variant="outline" className="w-full" disabled>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Apply Credit
                  </Button>

                  {!subscription.cancel_at_period_end && (
                    <Button variant="destructive" className="w-full" disabled>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(subscription.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Extend Trial Dialog */}
      <Dialog open={extendTrialDialogOpen} onOpenChange={setExtendTrialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Trial Period</DialogTitle>
            <DialogDescription>
              Add more days to the customer's trial period
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                value={extendTrialDays}
                onChange={(e) => setExtendTrialDays(parseInt(e.target.value) || 0)}
                min={1}
                max={90}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Current trial ends: {subscription.trial_end && new Date(subscription.trial_end).toLocaleDateString()}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtendTrialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => extendTrialMutation.mutate(extendTrialDays)}
              disabled={extendTrialMutation.isPending}
            >
              {extendTrialMutation.isPending ? 'Extending...' : 'Extend Trial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Tier Dialog */}
      <Dialog open={changeTierDialogOpen} onOpenChange={setChangeTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Subscription Tier</DialogTitle>
            <DialogDescription>
              Change the customer's subscription to a different tier
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tier">New Tier</Label>
              <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1">Growth</SelectItem>
                  <SelectItem value="tier2">Professional</SelectItem>
                  <SelectItem value="tier3">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will prorate the charge for the remaining billing period
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeTierDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled>Change Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
