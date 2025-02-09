export interface AnthropicResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

export const anthropicService = {
  processMessage: async (message: string): Promise<AnthropicResponse> => {
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

      return await response.json();
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
};