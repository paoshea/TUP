interface DeepseekResponse {
  content: string;
  suggestions?: string[];
}

interface ApiErrorResponse {
  error: string;
}

export class DeepseekService {
  private static instance: DeepseekService;
  private readonly apiEndpoint = '/api/ai/code';
  private readonly timeout = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): DeepseekService {
    if (!this.instance) {
      this.instance = new DeepseekService();
    }
    return this.instance;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  async query(prompt: string): Promise<string> {
    try {
      const response = await this.fetchWithTimeout(
        this.apiEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ prompt })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to process request';
        
        try {
          const errorData = JSON.parse(errorText) as ApiErrorResponse;
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const result = await response.json() as DeepseekResponse;
      
      if (!result.content) {
        throw new Error('Invalid response format: missing content');
      }

      return result.content;
    } catch (error) {
      console.error('Deepseek query failed:', error);
      throw error;
    }
  }
}