# AI Summarization Setup Guide

## Overview
The AI summarization feature has been implemented for blog posts on holescale.com. This allows users to get AI-generated summaries of blog articles with key points, action items, and time-saving estimates.

## What Was Created

### 1. Supabase Edge Function
**File**: `supabase/functions/summarize-blog/index.ts`

This edge function:
- Generates AI summaries using OpenAI's GPT-4o-mini model
- Caches summaries in the database to avoid redundant API calls
- Returns structured summaries with TLDR, key points, action items, and target audience

### 2. Database Migration
**File**: `supabase/migrations/004_blog_summary_logs.sql`

Creates the `blog_summary_logs` table for:
- Caching generated summaries
- Tracking summary generation history
- Fast lookups by post ID

### 3. Frontend Component Updates
**File**: `src/components/blog/AISummary.tsx`

Improved error handling to:
- Better handle non-JSON responses
- Provide clearer error messages
- Handle edge cases gracefully

## Setup Instructions

### 1. Deploy the Database Migration
Run the migration to create the `blog_summary_logs` table:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in your Supabase dashboard
# File: supabase/migrations/004_blog_summary_logs.sql
```

### 2. Deploy the Edge Function
Deploy the `summarize-blog` edge function:

```bash
# Using Supabase CLI
supabase functions deploy summarize-blog

# Make sure you're in the project root directory
```

### 3. Configure Environment Variables
Set the following environment variable in your Supabase project:

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key for generating summaries

To set this in Supabase:
1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions → Secrets
3. Add `OPENAI_API_KEY` with your OpenAI API key value

Or using Supabase CLI:
```bash
supabase secrets set OPENAI_API_KEY=your-api-key-here
```

### 4. Verify RLS Policies
The migration creates RLS policies that allow:
- Public read access to cached summaries
- Service role full access (for edge function operations)

These should be automatically applied when you run the migration.

## Testing

1. Navigate to any blog post on the website
2. Click the "Use AI to summarize this article" button
3. The summary should appear with:
   - Quick TLDR summary
   - Key takeaways with emojis
   - Action items
   - Target audience
   - Estimated time saved

## Troubleshooting

### Error: "OpenAI API key not configured"
- Make sure `OPENAI_API_KEY` is set in Supabase Edge Functions secrets
- Verify the secret name matches exactly (case-sensitive)

### Error: "Failed to generate summary from AI"
- Check your OpenAI API key is valid
- Verify you have API credits/quota available
- Check Supabase Edge Function logs for detailed error messages

### Error: "Server error: 404"
- Verify the edge function is deployed: `supabase functions list`
- Check the function name matches exactly: `summarize-blog`

### Summaries not caching
- Check that the `blog_summary_logs` table exists
- Verify RLS policies are correctly applied
- Check Edge Function logs for database errors

## Cost Considerations

- Uses OpenAI's GPT-4o-mini model (cost-effective)
- Summaries are cached to minimize API calls
- Each unique blog post only generates a summary once
- Subsequent requests use cached summaries (instant response)

## API Response Format

The edge function returns:

```json
{
  "success": true,
  "summary": {
    "tldr": "Brief summary...",
    "keyPoints": [
      {
        "emoji": "🎯",
        "title": "Key Point",
        "description": "Description"
      }
    ],
    "targetAudience": "Target audience",
    "actionItems": ["Item 1", "Item 2"],
    "estimatedTimeSaved": "5 min"
  },
  "cached": false
}
```

## Next Steps

1. Deploy the migration and edge function
2. Set the OpenAI API key
3. Test on a blog post
4. Monitor usage and costs in OpenAI dashboard

