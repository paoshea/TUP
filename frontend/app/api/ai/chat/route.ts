// app/api/ai/chat/route.ts
import { NextResponse } from 'next/server';

console.log('[ChatAPI] Route module initialized');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  console.log('[ChatAPI] Handling OPTIONS request:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries())
  });
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const requestStartTime = Date.now();
  console.log('\n[ChatAPI] ========== Request Start ==========');
  console.log('[ChatAPI] Received POST request:', {
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });

  try {
    // Add environment debugging
    console.log('[ChatAPI] Environment check:', {
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyLength: process.env.ANTHROPIC_API_KEY?.length,
      nodeEnv: process.env.NODE_ENV
    });
    
    // Add request logging
    console.log('[ChatAPI] Request headers:', {
      ...Object.fromEntries(request.headers.entries()),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      host: request.headers.get('host')
    });
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[ChatAPI] Missing Anthropic API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    console.log('[ChatAPI] Request body:', body);
    
    const { message } = body;

    if (!message) {
      console.error('[ChatAPI] Missing message in request body');
      return NextResponse.json(
        { error: 'Missing message in request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof message !== 'string') {
      console.error('[ChatAPI] Invalid message type:', typeof message);
      return NextResponse.json(
        { error: 'Message must be a string' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('[ChatAPI] Creating Anthropic message with message:', message);

    try {
      const requestParams = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        temperature: 0.7,
        messages: [{ role: 'user', content: message }],
        system: `You are WizardPhil, an expert AI assistant specializing in North Country Cheviot sheep analysis.
          You have deep knowledge of breed standards, show preparation, performance evaluation, and breeding programs.
          Focus on providing specific, actionable insights related to:
          - Physical characteristics assessment
          - Show preparation guidance
          - Performance metrics analysis
          - Breeding program recommendations
          Always maintain a professional yet approachable tone.
          After each response, provide:
          1. 3-4 relevant follow-up suggestions based on the context
          2. 2-3 related topics that would be valuable to explore
          Format these as JSON arrays at the end of your response like this:
          [SUGGESTIONS]
          ["suggestion 1", "suggestion 2", "suggestion 3"]
          [TOPICS]
          ["topic 1", "topic 2", "topic 3"]`
      };

      console.log('[ChatAPI] Anthropic request parameters:', requestParams);

      console.time('[ChatAPI] Anthropic API call');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestParams)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error: ${errorText}`);
      }

      const anthropicResponse = await response.json();
      console.timeEnd('[ChatAPI] Anthropic API call');

      console.log('[ChatAPI] Received response from Anthropic:', anthropicResponse);

      // Process response content
      const content = anthropicResponse.content[0].text;

      console.log('[ChatAPI] Processed content:', content);

      // Parse suggestions and topics with improved error handling
      const suggestionsRegex = /\[SUGGESTIONS\][^\[]*\[([\s\S]*?)\]/;
      const topicsRegex = /\[TOPICS\][^\[]*\[([\s\S]*?)\]/;

      const suggestionsMatch = content.match(suggestionsRegex);
      const topicsMatch = content.match(topicsRegex);

      console.log('[ChatAPI] Suggestions match:', suggestionsMatch);
      console.log('[ChatAPI] Topics match:', topicsMatch);

      let suggestions: string[] = [];
      let topics: string[] = [];

      try {
        if (suggestionsMatch?.[1]) {
          const suggestionsStr = suggestionsMatch[1].trim();
          suggestions = JSON.parse(`[${suggestionsStr}]`);
          // Validate suggestions array
          if (!Array.isArray(suggestions) || !suggestions.every(item => typeof item === 'string')) {
            throw new Error('Invalid suggestions format');
          }
        }
        if (topicsMatch?.[1]) {
          const topicsStr = topicsMatch[1].trim();
          topics = JSON.parse(`[${topicsStr}]`);
          // Validate topics array
          if (!Array.isArray(topics) || !topics.every(item => typeof item === 'string')) {
            throw new Error('Invalid topics format');
          }
        }
      } catch (e) {
        console.error('[ChatAPI] Error parsing suggestions/topics:', e);
        suggestions = ['Review breed standards', 'Check show preparation', 'Analyze performance'];
        topics = ['Breed Standards', 'Show Preparation', 'Performance'];
      }

      // Clean content
      const cleanContent = content
        .replace(/\[SUGGESTIONS\][\s\S]*?\](\r?\n|\r)?/g, '')
        .replace(/\[TOPICS\][\s\S]*?\](\r?\n|\r)?/g, '')
        .trim();

      // Validate cleaned content
      if (!cleanContent) {
        throw new Error('Empty response content after cleaning');
      }

      const responseData = {
        content: cleanContent,
        confidence: 0.95,
        suggestions: suggestions.slice(0, 4), // Limit to 4 suggestions
        relatedTopics: topics.slice(0, 3)     // Limit to 3 topics
      };

      console.log('[ChatAPI] Final response data:', responseData);

      const response_time = Date.now() - requestStartTime;
      console.log('[ChatAPI] Request completed in:', response_time, 'ms');
      console.log('[ChatAPI] ========== Request End ==========\n');

      return NextResponse.json(responseData, { 
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
          'X-Response-Time': response_time.toString()
        }
      });

    } catch (error) {
      console.error('[ChatAPI] API error:', error);
      console.error('[ChatAPI] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestTime: Date.now() - requestStartTime
      });
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          return NextResponse.json(
            { error: 'Service is currently busy. Please try again in a moment.' },
            { status: 429, headers: corsHeaders }
          );
        }
        if (error.message.includes('invalid_request_error')) {
          return NextResponse.json(
            { error: 'Invalid request parameters' },
            { status: 400, headers: corsHeaders }
          );
        }
      }
      
      throw error; // Re-throw for general error handling
    }

  } catch (error) {
    const err = error as Error;
    console.error('[ChatAPI] Error:', err);
    console.error('[ChatAPI] Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      requestTime: Date.now() - requestStartTime
    });
    const errorMessage = err instanceof Error ? err.message : 'Failed to process message';
    console.error('[ChatAPI] Error message:', errorMessage);
    console.log('[ChatAPI] ========== Request End (Error) ==========\n');
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}