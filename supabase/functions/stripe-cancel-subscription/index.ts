/**
 * Stripe Cancel Subscription
 *
 * Supabase Edge Function to cancel a user's subscription.
 * Supports both immediate cancellation and cancel at period end.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { immediately = false, reason } = await req.json();

    // Get user's subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('user_subscriptions')
      .select('stripe_subscription_id, tier_id')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription?.stripe_subscription_id) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cancel the subscription in Stripe
    let canceledSubscription;
    if (immediately) {
      // Cancel immediately
      canceledSubscription = await stripe.subscriptions.cancel(
        subscription.stripe_subscription_id
      );
    } else {
      // Cancel at period end
      canceledSubscription = await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        {
          cancel_at_period_end: true,
        }
      );
    }

    // Update local database
    await supabaseClient
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: canceledSubscription.cancel_at_period_end,
        canceled_at: canceledSubscription.canceled_at
          ? new Date(canceledSubscription.canceled_at * 1000).toISOString()
          : null,
        status: canceledSubscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    // Log cancellation event
    await supabaseClient.from('subscription_events').insert({
      user_id: user.id,
      event_type: 'canceled',
      previous_tier_id: subscription.tier_id,
      stripe_event_id: canceledSubscription.id,
      metadata: {
        reason: reason || null,
        immediately,
        canceled_at: canceledSubscription.canceled_at,
        cancel_at_period_end: canceledSubscription.cancel_at_period_end,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        cancel_at_period_end: canceledSubscription.cancel_at_period_end,
        current_period_end: canceledSubscription.current_period_end,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
