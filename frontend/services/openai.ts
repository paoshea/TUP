export interface AIResponse {
  evaluation?: {
    insights: string[];
    recommendations: string[];
    predictions: {
      showPerformance: number;
      confidenceLevel: number;
      factors: string[];
    };
    training: {
      exercises: string[];
      focus: string[];
      timeline: string;
    };
  };
  photo?: {
    conformation: {
      score: number;
      structure: string[];
      proportions: string[];
      issues: string[];
    };
    muscleDevelopment: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    breedCharacteristics: {
      score: number;
      matching: string[];
      deviations: string[];
    };
  };
  show?: {
    readiness: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    preparation: {
      checklist: string[];
      timeline: string;
      priorities: string[];
    };
    strategy: {
      recommendations: string[];
      challenges: string[];
      solutions: string[];
    };
  };
}

interface ApiErrorResponse {
  error: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private readonly apiEndpoint = '/api/ai/analyze';
  private readonly timeout = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
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

  async analyze(type: 'evaluation' | 'photo' | 'show', data: unknown): Promise<AIResponse> {
    try {
      const response = await this.fetchWithTimeout(
        this.apiEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            type,
            data
          })
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

      const result = await response.json();
      return this.validateResponse(result);
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return this.getFallbackResponse(type);
    }
  }

  private validateResponse(response: unknown): AIResponse {
    // Basic validation - ensure it has at least one of the expected top-level keys
    if (typeof response !== 'object' || response === null) {
      throw new Error('Invalid response format: not an object');
    }

    const validResponse = response as AIResponse;
    if (!validResponse.evaluation && !validResponse.photo && !validResponse.show) {
      throw new Error('Invalid response format: missing required data');
    }

    return validResponse;
  }

  private getFallbackResponse(type: 'evaluation' | 'photo' | 'show'): AIResponse {
    // Provide basic fallback responses when AI analysis fails
    const fallbacks: Record<typeof type, AIResponse> = {
      evaluation: {
        evaluation: {
          insights: ['Unable to perform AI analysis'],
          recommendations: ['Please try again later'],
          predictions: {
            showPerformance: 0,
            confidenceLevel: 0,
            factors: ['AI analysis unavailable']
          },
          training: {
            exercises: ['Basic training recommended'],
            focus: ['Maintain current routine'],
            timeline: 'Continue regular training schedule'
          }
        }
      },
      photo: {
        photo: {
          conformation: {
            score: 0,
            structure: ['Analysis unavailable'],
            proportions: ['Unable to assess'],
            issues: ['AI processing failed']
          },
          muscleDevelopment: {
            score: 0,
            strengths: ['Unable to analyze'],
            improvements: ['Try again later']
          },
          breedCharacteristics: {
            score: 0,
            matching: ['Analysis unavailable'],
            deviations: ['Unable to assess']
          }
        }
      },
      show: {
        show: {
          readiness: {
            score: 0,
            strengths: ['Unable to analyze'],
            gaps: ['AI assessment unavailable']
          },
          preparation: {
            checklist: ['Follow standard preparation routine'],
            timeline: 'Maintain regular schedule',
            priorities: ['Focus on basic preparation']
          },
          strategy: {
            recommendations: ['Continue standard practices'],
            challenges: ['Unable to assess specific challenges'],
            solutions: ['Follow general guidelines']
          }
        }
      }
    };

    return fallbacks[type];
  }
}

export const openai = OpenAIService.getInstance();