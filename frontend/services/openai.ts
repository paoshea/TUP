interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
    index: number;
    finish_reason: string;
  }>;
}

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

export class OpenAIService {
  private static instance: OpenAIService;
  private config: OpenAIConfig;

  private readonly PROMPTS = {
    evaluation: `You are an expert livestock evaluator. Analyze the following metrics and provide insights:
      - Compare against breed standards
      - Identify areas of improvement
      - Suggest specific training exercises
      - Predict show performance
      Format response as JSON matching the AIResponse interface with evaluation data.`,
    
    photo: `You are an expert in livestock conformation. Analyze the following photo:
      - Assess body structure and proportions
      - Evaluate muscle development
      - Check breed characteristics
      - Suggest improvements
      Format response as JSON matching the AIResponse interface with photo analysis data.`,
    
    show: `You are a show preparation expert. Review the following information:
      - Assess readiness level
      - Create preparation checklist
      - Identify potential challenges
      - Suggest winning strategies
      Format response as JSON matching the AIResponse interface with show preparation data.`
  };

  private constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.7
    };
  }

  static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
    }
    return this.instance;
  }

  async analyze(type: keyof typeof this.PROMPTS, data: unknown): Promise<AIResponse> {
    try {
      if (!this.config.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = this.PROMPTS[type];
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: JSON.stringify(data) }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.message}`);
      }

      const result = await response.json() as OpenAIResponse;
      return this.validateResponse(result);
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return this.getFallbackResponse(type);
    }
  }

  private validateResponse(response: OpenAIResponse): AIResponse {
    try {
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content) as AIResponse;
      
      // Basic validation - ensure it has at least one of the expected top-level keys
      if (!parsed.evaluation && !parsed.photo && !parsed.show) {
        throw new Error('Invalid response format');
      }

      return parsed;
    } catch (error) {
      console.error('Response validation failed:', error);
      throw error;
    }
  }

  private getFallbackResponse(type: keyof typeof this.PROMPTS): AIResponse {
    // Provide basic fallback responses when AI analysis fails
    const fallbacks: Record<keyof typeof this.PROMPTS, AIResponse> = {
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