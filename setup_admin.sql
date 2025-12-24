-- =====================================================
-- Admin Setup for adambuerer531@gmail.com
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Step 3: Add adambuerer531@gmail.com as admin
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'adambuerer531@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Verify admin was added successfully
SELECT
  au.id as admin_id,
  au.user_id,
  u.email,
  au.created_at as admin_since
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'adambuerer531@gmail.com';

-- =====================================================
-- Expected result: You should see one row with:
-- - admin_id: A UUID
-- - user_id: Your user UUID
-- - email: adambuerer531@gmail.com
-- - admin_since: Current timestamp
-- =====================================================
