/**
 * Checkout Success Page
 *
 * Shown after successful subscription signup.
 * Confirms subscription and guides user to next steps.
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { trackSubscription } from '@/lib/analytics';

// This would come from your auth context in the real app
const useAuth = () => {
  // Placeholder - replace with actual auth hook
  return { user: { id: 'user-id' } };
};

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { loading, subscription, trialDaysRemaining, isTrialing } = useFeatureGate(user?.id);

  const [confetti, setConfetti] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setConfetti(true);
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Track subscription conversion
  useEffect(() => {
    if (subscription && !hasTracked && !loading) {
      const price = subscription.tier.price_monthly / 100;
      trackSubscription(
        subscription.tier.tier_key || subscription.tier.name,
        price,
        'USD',
        isTrialing
      );
      setHasTracked(true);
    }
  }, [subscription, isTrialing, loading, hasTracked]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Subscription Confirmed | HoleScale"
        description="Your HoleScale subscription is confirmed. Start using your new features now."
        noindex
      />

      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center relative overflow-hidden">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 ring-8 ring-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to {subscription?.tier.display_name}!
          </h1>

          {/* Trial Info */}
          {isTrialing && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                Your {trialDaysRemaining}-day free trial has started
              </span>
            </div>
          )}

          <p className="text-lg text-muted-foreground mb-8">
            Your subscription is now active. All features are unlocked and ready to use.
          </p>

          {/* Details */}
          {subscription && (
            <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{subscription.tier.display_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    ${(subscription.tier.price_monthly / 100).toFixed(2)}/month
                  </span>
                </div>
                {isTrialing && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trial ends:</span>
                    <span className="font-medium">
                      {new Date(subscription.trial_end!).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction fee:</span>
                  <span className="font-medium">
                    {subscription.tier.transaction_fee_percent}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="font-semibold mb-4 text-left">What's next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Explore your new features</p>
                  <p className="text-sm text-muted-foreground">
                    Check out everything your plan includes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Set up your profile</p>
                  <p className="text-sm text-muted-foreground">
                    Complete your company information
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Start using HoleScale</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first RFQ or browse suppliers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/settings/billing">
                View Billing Settings
              </Link>
            </Button>
          </div>

          {isTrialing && (
            <p className="text-sm text-muted-foreground mt-6">
              You won't be charged until your trial ends. Cancel anytime before then at no cost.
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
