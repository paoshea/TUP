import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
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

    const content = message.content.reduce((acc, block) => {
      if ('text' in block) {
        return acc + block.text;
      }
      return acc;
    }, '');

    return NextResponse.json({
      content,
      confidence: 0.95,
      suggestions: [
        'Review breed standards',
        'Check show preparation guidelines',
        'Analyze recent performance data'
      ],
      relatedTopics: [
        'Breed Standards',
        'Show Preparation',
        'Performance Analysis'
      ]
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}