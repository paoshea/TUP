import axios from 'axios';

interface DeepseekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface DeepseekResponse {
  choices: Array<{
    text: string;
  }>;
}

export const DEEPSEEK_CONFIG: DeepseekConfig = {
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-coder-6.7b'
};

export class DeepseekService {
  private static instance: DeepseekService;
  
  private constructor() {}

  static getInstance(): DeepseekService {
    if (!this.instance) {
      this.instance = new DeepseekService();
    }
    return this.instance;
  }

  async query(prompt: string): Promise<string> {
    try {
      const response = await axios.post<DeepseekResponse>(
        `${DEEPSEEK_CONFIG.baseUrl}/completions`,
        {
          model: DEEPSEEK_CONFIG.model,
          prompt,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication failed. Check your API key.');
      }
      throw error;
    }
  }
}