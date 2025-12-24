/**
 * Stripe Webhook Handler
 *
 * Supabase Edge Function to handle Stripe webhook events.
 * This processes subscription lifecycle events and updates the database.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object, supabaseAdmin);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, supabaseAdmin);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabaseAdmin);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabaseAdmin);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object, supabaseAdmin);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, supabaseAdmin);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, supabaseAdmin);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function handleCheckoutComplete(session: any, supabase: any) {
  const userId = session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;

  if (!userId || !tierId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Update subscription with Stripe subscription ID
  const { error } = await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    tier_id: tierId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: session.subscription,
    status: 'active',
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to update subscription:', error);
  }

  // Log event
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: 'created',
    new_tier_id: tierId,
    stripe_event_id: session.id,
    metadata: { session_id: session.id },
  });
}

async function handleSubscriptionCreated(subscription: any, supabase: any) {
  const userId = subscription.metadata?.user_id;
  const tierId = subscription.metadata?.tier_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const status = subscription.status;
  const trialStart = subscription.trial_start
    ? new Date(subscription.trial_start * 1000).toISOString()
    : null;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
  const currentPeriodStart = new Date(
    subscription.current_period_start * 1000
  ).toISOString();
  const currentPeriodEnd = new Date(
    subscription.current_period_end * 1000
  ).toISOString();

  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    tier_id: tierId,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    status: status,
    trial_start: trialStart,
    trial_end: trialEnd,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    updated_at: new Date().toISOString(),
  });

  // Log event
  const eventType = trialStart ? 'trial_started' : 'created';
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: eventType,
    new_tier_id: tierId,
    stripe_event_id: subscription.id,
  });
}

async function handleSubscriptionUpdated(subscription: any, supabase: any) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  // Get current subscription to detect changes
  const { data: currentSub } = await supabase
    .from('user_subscriptions')
    .select('tier_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  const status = subscription.status;
  const currentPeriodStart = new Date(
    subscription.current_period_start * 1000
  ).toISOString();
  const currentPeriodEnd = new Date(
    subscription.current_period_end * 1000
  ).toISOString();
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000).toISOString()
    : null;

  await supabase
    .from('user_subscriptions')
    .update({
      status: status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      canceled_at: canceledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  // Detect if tier changed (upgrade/downgrade)
  const newTierId = subscription.metadata?.tier_id;
  if (currentSub && newTierId && currentSub.tier_id !== newTierId) {
    const eventType =
      newTierId > currentSub.tier_id ? 'upgraded' : 'downgraded';
    await supabase.from('subscription_events').insert({
      user_id: userId,
      event_type: eventType,
      previous_tier_id: currentSub.tier_id,
      new_tier_id: newTierId,
      stripe_event_id: subscription.id,
    });
  }

  // Detect if trial ended
  if (status === 'active' && subscription.trial_end) {
    const trialEndDate = new Date(subscription.trial_end * 1000);
    const now = new Date();
    if (trialEndDate <= now) {
      await supabase.from('subscription_events').insert({
        user_id: userId,
        event_type: 'trial_ended',
        stripe_event_id: subscription.id,
      });
    }
  }
}

async function handleSubscriptionDeleted(subscription: any, supabase: any) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: 'canceled',
    stripe_event_id: subscription.id,
  });
}

async function handleTrialWillEnd(subscription: any, supabase: any) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  // TODO: Send email notification that trial is ending soon
  console.log(`Trial will end soon for user ${userId}`);

  // Log event for tracking
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: 'trial_ending_soon',
    stripe_event_id: subscription.id,
    metadata: { trial_end: subscription.trial_end },
  });
}

async function handlePaymentFailed(invoice: any, supabase: any) {
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) {
    return;
  }

  // Get user ID from subscription
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!sub) {
    return;
  }

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  await supabase.from('subscription_events').insert({
    user_id: sub.user_id,
    event_type: 'payment_failed',
    stripe_event_id: invoice.id,
    metadata: { invoice_id: invoice.id, amount: invoice.amount_due },
  });

  // TODO: Send payment failed email
  console.log(`Payment failed for user ${sub.user_id}`);
}

async function handlePaymentSucceeded(invoice: any, supabase: any) {
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) {
    return;
  }

  // Get user ID from subscription
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!sub) {
    return;
  }

  await supabase.from('subscription_events').insert({
    user_id: sub.user_id,
    event_type: 'payment_succeeded',
    stripe_event_id: invoice.id,
    metadata: { invoice_id: invoice.id, amount: invoice.amount_paid },
  });

  // TODO: Send payment receipt email
  console.log(`Payment succeeded for user ${sub.user_id}`);
}
