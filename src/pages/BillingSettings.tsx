/**
 * Billing Settings Page
 *
 * Allows users to manage their subscription, view billing history,
 * and access the Stripe Customer Portal.
 */

import { useState } from 'react';
import { CreditCard, Download, ExternalLink, AlertCircle } from 'lucide-react';
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
import SEO from '@/components/SEO';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { TrialStatusCard } from '@/components/subscription/TrialBanner';
import { UpgradeButton } from '@/components/subscription/UpgradePrompt';
import { redirectToPortal, cancelSubscription } from '@/lib/stripe/client';
import { toast } from 'sonner';

// Placeholder auth hook
const useAuth = () => {
  return { user: { id: 'user-id', email: 'user@example.com' } };
};

export default function BillingSettings() {
  const { user } = useAuth();
  const {
    loading,
    subscription,
    isTrialing,
    willCancelAtPeriodEnd,
    nextBillingDate,
    transactionFeePercent,
  } = useFeatureGate(user?.id);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleManageBilling = async () => {
    try {
      await redirectToPortal();
    } catch (error) {
      toast.error('Failed to open billing portal');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCanceling(true);
      await cancelSubscription(false); // Cancel at period end
      toast.success('Subscription will be canceled at the end of the billing period');
      setCancelDialogOpen(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isFree = subscription?.tier.is_free;

  return (
    <>
      <SEO
        title="Billing Settings | HoleScale"
        description="Manage your HoleScale subscription and billing"
        noindex
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing Settings</h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>

          {/* Trial Banner */}
          {isTrialing && (
            <TrialStatusCard userId={user?.id} />
          )}

          {/* Cancellation Warning */}
          {willCancelAtPeriodEnd && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be canceled on{' '}
                {nextBillingDate?.toLocaleDateString()}. You'll retain access until then.
              </AlertDescription>
            </Alert>
          )}

          {/* Current Plan */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Current Plan</h2>
                <p className="text-muted-foreground text-sm">
                  Your subscription details and features
                </p>
              </div>
              {!isFree && (
                <Badge className="text-sm">
                  {isTrialing ? 'Free Trial' : 'Active'}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-semibold text-lg">
                    {subscription?.tier.display_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isFree ? 'Free forever' : `$${(subscription!.tier.price_monthly / 100).toFixed(2)}/month`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Transaction Fee</div>
                  <div className="font-semibold">{transactionFeePercent}%</div>
                </div>
              </div>

              {!isFree && nextBillingDate && !isTrialing && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next billing date:</span>
                  <span className="font-medium">
                    {nextBillingDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {isFree ? (
                  <UpgradeButton userId={user?.id} size="default">
                    Upgrade Plan
                  </UpgradeButton>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleManageBilling}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    {!willCancelAtPeriodEnd && (
                      <Button
                        variant="ghost"
                        onClick={() => setCancelDialogOpen(true)}
                      >
                        Cancel Plan
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          {!isFree && (
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage your payment information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Visa ending in ****</div>
                  <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageBilling}>
                  Update
                </Button>
              </div>
            </Card>
          )}

          {/* Billing History */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Billing History</h2>
                <p className="text-muted-foreground text-sm">
                  View and download your invoices
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleManageBilling}>
                View All
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {isFree ? (
              <div className="text-center py-8 text-muted-foreground">
                No billing history available for free plans
              </div>
            ) : (
              <div className="space-y-2">
                {/* Placeholder invoices */}
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">December 2025</div>
                    <div className="text-sm text-muted-foreground">
                      Paid on Dec 1, 2025
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">$49.00</span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">November 2025</div>
                    <div className="text-sm text-muted-foreground">
                      Paid on Nov 1, 2025
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">$49.00</span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription?</DialogTitle>
            <DialogDescription>
              Your subscription will remain active until the end of your current
              billing period on {nextBillingDate?.toLocaleDateString()}.
              After that, you'll be downgraded to the free plan.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">You'll lose access to:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Unlimited RFQs</li>
              <li>• Advanced analytics</li>
              <li>• Priority support</li>
              <li>• All {subscription?.tier.display_name} features</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={canceling}
            >
              Keep Plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={canceling}
            >
              {canceling ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
