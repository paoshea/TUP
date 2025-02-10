export interface AnthropicResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

export const anthropicService = {
  async processMessage(message: string): Promise<AnthropicResponse> {
    // Mock response for demo
    return {
      content: "I understand you're asking about livestock management. While I'm currently in demo mode, I'd be happy to provide general guidance based on best practices.",
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
    };
  }
};