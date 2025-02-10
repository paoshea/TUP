import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Use server-side environment variable
const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';

const anthropic = new Anthropic({
  apiKey,
  dangerouslyAllowBrowser: true // Only needed if we're using it client-side
});

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await request.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: message
      }],
      system: `You are WizardPhil, an expert AI assistant specializing in North Country Cheviot sheep analysis. 
              You have deep knowledge of breed standards, show preparation, performance evaluation, and breeding programs.
              Focus on providing specific, actionable insights related to:
              - Physical characteristics assessment
              - Show preparation guidance
              - Performance metrics analysis
              - Breeding program recommendations
              Always maintain a professional yet approachable tone.`
    });

    // Handle different types of content blocks
    const content = response.content.reduce((acc, block) => {
      if ('text' in block) {
        return acc + block.text;
      }
      return acc;
    }, '');

    // Extract suggestions and topics based on the content
    const suggestions = [
      'Review breed standards',
      'Check show preparation guidelines',
      'Analyze recent performance data'
    ];

    const topics = [
      'Breed Standards',
      'Show Preparation',
      'Performance Analysis'
    ];

    return NextResponse.json({
      content,
      confidence: 0.95,
      suggestions,
      relatedTopics: topics
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}