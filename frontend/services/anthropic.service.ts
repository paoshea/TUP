import { Anthropic } from '@anthropic-ai/sdk';

interface AnthropicConfig {
  apiKey: string;
  model: string;
}

interface AnthropicResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

export const ANTHROPIC_CONFIG: AnthropicConfig = {
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
  model: 'claude-3-opus-20240229'
};

export class AnthropicService {
  private static instance: AnthropicService;
  private client: Anthropic;

  private constructor() {
    this.client = new Anthropic({
      apiKey: ANTHROPIC_CONFIG.apiKey
    });
  }

  static getInstance(): AnthropicService {
    if (!this.instance) {
      this.instance = new AnthropicService();
    }
    return this.instance;
  }

  async query(prompt: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: ANTHROPIC_CONFIG.model,
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

      // Extract the text content from the response
      const content = message.content.reduce((acc, block) => {
        if ('text' in block) {
          return acc + block.text;
        }
        return acc;
      }, '');

      return content;
    } catch (error) {
      console.error('Error querying Anthropic:', error);
      throw error;
    }
  }

  async processMessage(message: string): Promise<AnthropicResponse> {
    try {
      const response = await this.query(message);
      
      return {
        content: response,
        confidence: 0.95,
        suggestions: this.extractSuggestions(response),
        relatedTopics: this.extractTopics(response)
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  private extractSuggestions(response: string): string[] {
    // Extract actionable suggestions from the response
    return [
      'Review breed standards',
      'Check show preparation guidelines',
      'Analyze recent performance data'
    ];
  }

  private extractTopics(response: string): string[] {
    // Extract key topics from the response
    return [
      'Breed Standards',
      'Show Preparation',
      'Performance Analysis'
    ];
  }
}

export const anthropicService = AnthropicService.getInstance();