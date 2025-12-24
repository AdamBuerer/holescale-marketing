# Troubleshooting Blog Issues

## ✅ Fixed: increment_blog_post_views
The function is now working correctly! It successfully increments the `views` column.

## ❌ Issue: summarize-blog Edge Function

The edge function is returning a 500 error: "Failed to generate summary from AI"

### Possible Causes:

1. **Missing OpenAI API Key**
   - The edge function needs `OPENAI_API_KEY` set as a secret
   - Check: Supabase Dashboard → Edge Functions → Secrets

2. **Invalid OpenAI API Key**
   - Verify the key is valid and has credits
   - Check OpenAI dashboard for API status

3. **OpenAI API Error**
   - Check Supabase Edge Function logs for detailed error
   - May be rate limiting or quota exceeded

### How to Fix:

1. **Set OpenAI API Key in Supabase:**
   ```bash
   # Using Supabase CLI
   supabase secrets set OPENAI_API_KEY=sk-your-key-here
   ```
   
   Or in Supabase Dashboard:
   - Go to Settings → Edge Functions → Secrets
   - Add `OPENAI_API_KEY` with your OpenAI API key

2. **Check Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → summarize-blog → Logs
   - Look for detailed error messages

3. **Verify Edge Function is Deployed:**
   ```bash
   supabase functions list
   ```
   
   Should show `summarize-blog` in the list

### Testing:

Run the test script to verify:
```bash
node test-blog-fixes.mjs
```

This will test both functions and show what's working/failing.

