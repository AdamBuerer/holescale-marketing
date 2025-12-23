/**
 * Summarize Blog Post
 *
 * Supabase Edge Function to generate AI summaries of blog posts.
 * Uses OpenAI API to generate summaries and caches them in the database.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SummaryRequest {
  content: string;
  title: string;
  readingTime: number;
  postId: string;
}

interface SummaryResponse {
  tldr: string;
  keyPoints: Array<{
    emoji: string;
    title: string;
    description: string;
  }>;
  targetAudience: string;
  actionItems: string[];
  estimatedTimeSaved: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Parse request body
    const { content, title, readingTime, postId }: SummaryRequest = await req.json();

    if (!content || !title || !postId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if summary already exists in cache
    const { data: cachedSummaries, error: cacheError } = await supabaseClient
      .from('blog_summary_logs')
      .select('summary_data')
      .eq('post_id', postId)
      .eq('action', 'summary_generated')
      .order('created_at', { ascending: false })
      .limit(1);

    // Check if we have a valid cached summary
    if (cachedSummaries && cachedSummaries.length > 0 && cachedSummaries[0]?.summary_data) {
      return new Response(
        JSON.stringify({
          success: true,
          summary: cachedSummaries[0].summary_data,
          cached: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strip HTML tags from content for better AI processing
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Limit content length to avoid token limits (keep first 8000 characters)
    const truncatedContent = textContent.substring(0, 8000);

    // Generate summary using OpenAI
    const prompt = `You are an expert content summarizer. Analyze the following blog post and create a comprehensive summary.

Title: ${title}

Content:
${truncatedContent}

Please provide a JSON response with the following structure:
{
  "tldr": "A concise 2-3 sentence summary of the main points",
  "keyPoints": [
    {
      "emoji": "🎯",
      "title": "Key point title (max 50 chars)",
      "description": "Brief description (max 150 chars)"
    }
  ],
  "targetAudience": "Who this article is best for (e.g., 'Procurement Officers', 'Marketing Managers', 'Small Business Owners')",
  "actionItems": [
    "Actionable item 1",
    "Actionable item 2",
    "Actionable item 3"
  ],
  "estimatedTimeSaved": "X min" (based on reading time of ${readingTime} minutes)
}

Generate 3-5 key points. Make sure the response is valid JSON only, no markdown formatting.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates structured JSON summaries of blog posts. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate summary from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiSummaryText = openaiData.choices[0]?.message?.content;

    if (!aiSummaryText) {
      return new Response(
        JSON.stringify({ success: false, error: 'No summary generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let summary: SummaryResponse;
    try {
      // Remove any markdown code blocks if present
      const cleanedJson = aiSummaryText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      summary = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiSummaryText);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid response format from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate summary structure
    if (!summary.tldr || !summary.keyPoints || !Array.isArray(summary.keyPoints)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid summary structure from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate estimated time saved
    if (!summary.estimatedTimeSaved) {
      const timeSaved = Math.max(1, Math.floor(readingTime * 0.7)); // Estimate 70% time saved
      summary.estimatedTimeSaved = `${timeSaved} min`;
    }

    // Cache the summary in the database
    try {
      await supabaseClient.from('blog_summary_logs').insert({
        post_id: postId,
        action: 'summary_generated',
        summary_data: summary,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      // Log error but don't fail the request
      console.error('Failed to cache summary:', dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        cached: false,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating summary:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

