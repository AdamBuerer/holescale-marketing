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
    // Log request for debugging
    const authHeader = req.headers.get('Authorization');
    const apikey = req.headers.get('apikey');
    console.log('Request received:', {
      method: req.method,
      hasAuth: !!authHeader,
      hasApikey: !!apikey,
      url: req.url,
    });

    // Create Supabase client with service role for database operations
    // This allows the function to read/write to blog_summary_logs table
    // We use service role to bypass RLS for caching operations
    // This function allows anonymous/public access - no user authentication required
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

    // Log cache errors but don't fail - we can still generate a new summary
    if (cacheError) {
      console.warn('Cache lookup error (non-fatal):', cacheError.message);
    }

    // Check if we have a valid cached summary
    if (cachedSummaries && cachedSummaries.length > 0 && cachedSummaries[0]?.summary_data) {
      console.log(`Returning cached summary for post ${postId}`);
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
    // Note: When using response_format: { type: 'json_object' }, the prompt MUST explicitly mention "JSON object"
    const prompt = `Analyze the following blog post and create a comprehensive summary as a JSON object.

Title: ${title}

Content:
${truncatedContent}

You must respond with a JSON object using this exact structure:
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
  "estimatedTimeSaved": "X min"
}

Generate 3-5 key points. The reading time is ${readingTime} minutes, so estimate time saved accordingly. Return only valid JSON, no markdown or code blocks.`;

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
            content: 'You are a helpful assistant that generates structured JSON object summaries of blog posts. You must always respond with a valid JSON object only, no markdown formatting, no code blocks, just pure JSON.',
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
      
      // Try to parse error for more details
      let errorMessage = 'Failed to generate summary from AI';
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.error?.message) {
          errorMessage = `OpenAI API error: ${parsedError.error.message}`;
        } else if (parsedError.error) {
          errorMessage = `OpenAI API error: ${JSON.stringify(parsedError.error)}`;
        }
      } catch {
        // If not JSON, include first 200 chars of error
        errorMessage = `OpenAI API error: ${errorData.substring(0, 200)}`;
      }
      
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiSummaryText = openaiData.choices[0]?.message?.content;

    if (!aiSummaryText) {
      console.error('OpenAI response missing content:', JSON.stringify(openaiData, null, 2));
      return new Response(
        JSON.stringify({ success: false, error: 'No summary generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let summary: SummaryResponse;
    try {
      // Remove any markdown code blocks if present (though json_object mode shouldn't return them)
      let cleanedJson = aiSummaryText.trim();
      // Remove markdown code blocks if they exist
      cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      
      // Try to parse
      summary = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', {
        error: parseError,
        response: aiSummaryText.substring(0, 500), // First 500 chars for debugging
        fullResponse: aiSummaryText,
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid response format from AI. Please try again.',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate summary structure
    if (!summary.tldr || !summary.keyPoints || !Array.isArray(summary.keyPoints)) {
      console.error('Invalid summary structure:', JSON.stringify(summary, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid summary structure from AI',
          received: {
            hasTldr: !!summary.tldr,
            hasKeyPoints: !!summary.keyPoints,
            keyPointsIsArray: Array.isArray(summary.keyPoints),
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Ensure keyPoints has at least one item
    if (summary.keyPoints.length === 0) {
      console.warn('Summary has no key points, adding default');
      summary.keyPoints = [{
        emoji: '📝',
        title: 'Summary',
        description: summary.tldr.substring(0, 150),
      }];
    }
    
    // Ensure actionItems exists and is an array
    if (!summary.actionItems || !Array.isArray(summary.actionItems)) {
      summary.actionItems = [];
    }
    
    // Ensure targetAudience exists
    if (!summary.targetAudience) {
      summary.targetAudience = 'General audience';
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
    const errorDetails = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
    console.error('Error generating summary:', errorDetails);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Internal server error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

