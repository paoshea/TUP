interface AnthropicResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

export class AnthropicService {
  private static instance: AnthropicService;

  private constructor() {}

  static getInstance(): AnthropicService {
    if (!this.instance) {
      this.instance = new AnthropicService();
    }
    return this.instance;
  }

  async query(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error querying AI:', error);
      throw error;
    }
  }

  async processMessage(message: string): Promise<AnthropicResponse> {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const data = await response.json();
      return {
        content: data.content,
        confidence: data.confidence,
        suggestions: data.suggestions,
        relatedTopics: data.relatedTopics,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

export const anthropicService = AnthropicService.getInstance();