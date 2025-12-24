-- Find all triggers on blog_posts table
SELECT
  t.tgname AS trigger_name,
  c.relname AS table_name,
  p.proname AS function_name,
  t.tgenabled AS is_enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relname = 'blog_posts'
  AND NOT t.tgisinternal
ORDER BY t.tgname;

-- Also check the blog_summary_logs constraint
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'blog_summary_logs'::regclass
  AND contype = 'c'
ORDER BY conname;
