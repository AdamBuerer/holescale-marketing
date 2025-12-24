-- HoleScale Subscription System Schema
-- This migration creates all tables needed for the subscription and pricing system

-- ============================================================================
-- Table: subscription_tiers
-- Reference table for all available subscription tiers
-- ============================================================================
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_key VARCHAR(50) UNIQUE NOT NULL, -- 'buyer_starter', 'buyer_growth', etc.
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('buyer', 'supplier')),
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  price_monthly INTEGER NOT NULL, -- in cents (0 for free)
  price_yearly INTEGER, -- in cents, null if no yearly option
  transaction_fee_percent DECIMAL(4,2) NOT NULL,
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  stripe_product_id VARCHAR(100),
  trial_days INTEGER DEFAULT 14,
  is_free BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for lookups
CREATE INDEX idx_subscription_tiers_key ON subscription_tiers(tier_key);
CREATE INDEX idx_subscription_tiers_user_type ON subscription_tiers(user_type);

-- ============================================================================
-- Table: tier_features
-- Defines what features and limits each tier has
-- ============================================================================
CREATE TABLE tier_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL, -- 'rfq_limit', 'saved_suppliers', etc.
  feature_value VARCHAR(255), -- 'unlimited', '5', 'true', etc.
  feature_type VARCHAR(20) DEFAULT 'limit', -- 'limit', 'boolean', 'tier_unlock'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tier_id, feature_key)
);

CREATE INDEX idx_tier_features_tier ON tier_features(tier_id);
CREATE INDEX idx_tier_features_key ON tier_features(feature_key);

-- ============================================================================
-- Table: user_subscriptions
-- Tracks the current subscription state for each user
-- ============================================================================
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  -- Status: 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused'
  billing_cycle VARCHAR(10) DEFAULT 'monthly', -- 'monthly' or 'yearly'
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One subscription per user
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);

-- ============================================================================
-- Table: usage_tracking
-- Tracks usage for metered features (RFQs, suppliers, etc.)
-- ============================================================================
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_key, period_start)
);

CREATE INDEX idx_usage_tracking_user ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- ============================================================================
-- Table: subscription_events
-- Audit log for all subscription changes
-- ============================================================================
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  -- Events: 'created', 'trial_started', 'trial_ended', 'upgraded',
  -- 'downgraded', 'canceled', 'reactivated', 'payment_failed', 'payment_succeeded'
  previous_tier_id UUID REFERENCES subscription_tiers(id),
  new_tier_id UUID REFERENCES subscription_tiers(id),
  stripe_event_id VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscription_events_user ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_created ON subscription_events(created_at);

-- ============================================================================
-- Seed Data: Buyer Tiers
-- ============================================================================
INSERT INTO subscription_tiers (tier_key, user_type, name, display_name, price_monthly,
  transaction_fee_percent, trial_days, is_free, sort_order) VALUES
('buyer_starter', 'buyer', 'Starter', 'Starter (Free)', 0, 3.00, 0, true, 1),
('buyer_growth', 'buyer', 'Growth', 'Growth', 1900, 3.00, 14, false, 2),
('buyer_professional', 'buyer', 'Professional', 'Professional', 4900, 2.50, 14, false, 3),
('buyer_enterprise', 'buyer', 'Enterprise', 'Enterprise', 14900, 2.00, 14, false, 4);

-- ============================================================================
-- Seed Data: Supplier Tiers
-- ============================================================================
INSERT INTO subscription_tiers (tier_key, user_type, name, display_name, price_monthly,
  transaction_fee_percent, trial_days, is_free, sort_order) VALUES
('supplier_lite', 'supplier', 'Lite', 'Lite (Free)', 0, 4.50, 0, true, 1),
('supplier_growth', 'supplier', 'Growth', 'Growth', 4900, 4.00, 14, false, 2),
('supplier_professional', 'supplier', 'Professional', 'Professional', 9900, 3.50, 14, false, 3),
('supplier_enterprise', 'supplier', 'Enterprise', 'Enterprise', 24900, 2.50, 14, false, 4);

-- ============================================================================
-- Seed Data: Buyer Feature Definitions
-- ============================================================================

-- Buyer Starter Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_limit_monthly', '3', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'saved_suppliers_limit', '5', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_tracking', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_sku_limit', '0', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '1', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_starter';

-- Buyer Growth Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_limit_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'saved_suppliers_limit', '25', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_tracking', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_sku_limit', '50', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '1', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'basic', 'tier_unlock' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_growth';

-- Buyer Professional Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_limit_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'saved_suppliers_limit', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_tracking', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_sku_limit', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '3', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'advanced', 'tier_unlock' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_professional';

-- Buyer Enterprise Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_limit_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'saved_suppliers_limit', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_tracking', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'inventory_sku_limit', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'advanced', 'tier_unlock' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'buyer_enterprise';

-- ============================================================================
-- Seed Data: Supplier Feature Definitions
-- ============================================================================

-- Supplier Lite Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_responses_monthly', '5', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'verified_badge', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'featured_search', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'buyer_insights', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '1', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'dedicated_manager', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'white_label', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_lite';

-- Supplier Growth Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_responses_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'verified_badge', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'featured_search', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'buyer_insights', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '1', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'dedicated_manager', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'white_label', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_growth';

-- Supplier Professional Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_responses_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'verified_badge', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'featured_search', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'buyer_insights', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', '3', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'dedicated_manager', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'white_label', 'false', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_professional';

-- Supplier Enterprise Features
INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'rfq_responses_monthly', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'verified_badge', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'analytics_dashboard', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'featured_search', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'buyer_insights', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'team_seats', 'unlimited', 'limit' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'dedicated_manager', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'erp_integration', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'api_access', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';

INSERT INTO tier_features (tier_id, feature_key, feature_value, feature_type)
SELECT id, 'white_label', 'true', 'boolean' FROM subscription_tiers WHERE tier_key = 'supplier_enterprise';
