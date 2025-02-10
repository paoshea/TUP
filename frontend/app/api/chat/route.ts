import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client with proper configuration
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  baseURL: 'https://api.anthropic.com/v1'  // explicitly set base URL
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // Add environment debugging
    console.log('Environment check:', {
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyLength: process.env.ANTHROPIC_API_KEY?.length,
      nodeEnv: process.env.NODE_ENV,
      baseUrl: 'https://api.anthropic.com/v1'
    });
    
    // Add request logging
    console.log('[ChatAPI] Processing request at:', new Date().toISOString());
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[ChatAPI] Missing Anthropic API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    console.log('[ChatAPI] Request body:', body);
    
    const { prompt } = body;

    if (!prompt) {
      console.error('[ChatAPI] Missing prompt in request body');
      return NextResponse.json(
        { error: 'Missing prompt in request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('[ChatAPI] Creating Anthropic message with prompt:', prompt);

    // Create message with explicit error handling
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
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
      });

      console.log('[ChatAPI] Received response from Anthropic');

      // Process response content
      const content = response.content.reduce((acc, block) => {
        if ('text' in block) {
          return acc + block.text;
        }
        return acc;
      }, '');

      // Parse suggestions and topics with improved error handling
      const suggestionsRegex = /\[SUGGESTIONS\][^\[]*\[([\s\S]*?)\]/;
      const topicsRegex = /\[TOPICS\][^\[]*\[([\s\S]*?)\]/;

      const suggestionsMatch = content.match(suggestionsRegex);
      const topicsMatch = content.match(topicsRegex);

      let suggestions = [];
      let topics = [];

      try {
        if (suggestionsMatch?.[1]) {
          const suggestionsStr = suggestionsMatch[1].trim();
          suggestions = JSON.parse(`[${suggestionsStr}]`);
        }
        if (topicsMatch?.[1]) {
          const topicsStr = topicsMatch[1].trim();
          topics = JSON.parse(`[${topicsStr}]`);
        }
      } catch (e) {
        console.error('[ChatAPI] Error parsing suggestions/topics:', e);
        suggestions = ['Review breed standards', 'Check show preparation', 'Analyze performance'];
        topics = ['Breed Standards', 'Show Preparation', 'Performance'];
      }

      // Clean content with ES5 compatible regex
      const cleanContent = content
        .replace(/\[SUGGESTIONS\][\s\S]*?\](\r?\n|\r)?/g, '')
        .replace(/\[TOPICS\][\s\S]*?\](\r?\n|\r)?/g, '')
        .trim();

      const responseData = {
        content: cleanContent,
        confidence: 0.95,
        suggestions,
        relatedTopics: topics
      };

      console.log('[ChatAPI] Sending response data');
      return NextResponse.json(responseData, { headers: corsHeaders });

    } catch (anthropicError) {
      console.error('[ChatAPI] Anthropic API error:', anthropicError);
      throw anthropicError; // Re-throw to be caught by outer try-catch
    }

  } catch (error) {
    console.error('[ChatAPI] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
    console.error('[ChatAPI] Error message:', errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}