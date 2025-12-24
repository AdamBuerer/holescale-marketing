-- Verify all active pricing tiers
SELECT
  tier_name,
  user_type,
  monthly_price,
  annual_price,
  service_fee_rate,
  is_active,
  features
FROM subscription_tiers
WHERE is_active = true
ORDER BY user_type, monthly_price;
