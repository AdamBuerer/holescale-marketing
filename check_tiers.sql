-- Check if subscription_tiers has any data
SELECT
  id,
  user_type,
  display_name,
  price_monthly,
  sort_order
FROM subscription_tiers
ORDER BY user_type, sort_order;

-- Count of tiers
SELECT
  user_type,
  COUNT(*) as tier_count
FROM subscription_tiers
GROUP BY user_type;
