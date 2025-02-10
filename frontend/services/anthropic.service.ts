export interface AnthropicResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

interface ApiErrorResponse {
  error: string;
}

export class AnthropicService {
  private static instance: AnthropicService;
  private readonly apiEndpoint = '/api/ai/chat';
  private readonly timeout = 30000; // 30 seconds

  private constructor() {
    console.log('[AnthropicService] Initialized');
    console.log('[AnthropicService] API endpoint:', this.apiEndpoint);
  }

  static getInstance(): AnthropicService {
    if (!this.instance) {
      this.instance = new AnthropicService();
    }
    return this.instance;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    console.log('[AnthropicService] Starting fetch request:', {
      url,
      method: options.method,
      headers: options.headers,
      bodyLength: options.body ? (options.body as string).length : 0
    });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-store', // Disable caching
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(id);

      console.log('[AnthropicService] Fetch response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      return response;
    } catch (error) {
      clearTimeout(id);
      console.error('[AnthropicService] Fetch error:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
      }
      throw error;
    }
  }

  async processMessage(message: string): Promise<AnthropicResponse> {
    try {
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      console.log('[AnthropicService] Processing message:', {
        message,
        timestamp: new Date().toISOString(),
        endpoint: this.apiEndpoint
      });

      const requestBody = { message: message };
      console.log('[AnthropicService] Request body:', requestBody);

      const response = await this.fetchWithTimeout(
        this.apiEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AnthropicService] Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });

        let errorMessage = 'Failed to process message';
        
        try {
          const errorData = JSON.parse(errorText) as ApiErrorResponse;
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('[AnthropicService] Error parsing error response:', e);
        }
        
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('[AnthropicService] Invalid content type:', contentType);
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();
      console.log('[AnthropicService] Response data:', data);
      
      if (!data.content) {
        console.error('[AnthropicService] Missing content in response:', data);
        throw new Error('Invalid response format: missing content');
      }

      return {
        content: data.content,
        confidence: data.confidence ?? 0.95,
        suggestions: data.suggestions ?? [],
        relatedTopics: data.relatedTopics ?? []
      };
    } catch (error) {
      console.error('[AnthropicService] Error in processMessage:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}

export const anthropicService = AnthropicService.getInstance();