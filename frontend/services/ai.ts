import { openai, type AIResponse } from './openai';

interface ProcessedResponse {
  content: string;
  suggestions?: string[];
  relatedTopics?: string[];
}

class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!this.instance) {
      this.instance = new AIService();
    }
    return this.instance;
  }

  async processMessage(input: string): Promise<ProcessedResponse> {
    try {
      // Determine message type
      const isAnalysisRequest = input.toLowerCase().includes('analysis') ||
                               input.toLowerCase().includes('evaluate') ||
                               input.toLowerCase().includes('performance');

      const isPhotoRequest = input.toLowerCase().includes('photo') ||
                            input.toLowerCase().includes('picture') ||
                            input.toLowerCase().includes('image');

      const isShowRequest = input.toLowerCase().includes('show') ||
                           input.toLowerCase().includes('competition') ||
                           input.toLowerCase().includes('event');

      // Process with appropriate AI service
      if (isAnalysisRequest) {
        const response = await openai.analyze('evaluation', { query: input });
        return {
          content: this.formatAnalysisResponse(response),
          suggestions: response.evaluation?.recommendations || [],
          relatedTopics: ['Performance Analysis', 'Training Tips', 'Improvement Areas']
        };
      }

      if (isPhotoRequest) {
        const response = await openai.analyze('photo', { query: input });
        return {
          content: this.formatPhotoResponse(response),
          suggestions: response.photo?.conformation.issues || [],
          relatedTopics: ['Photo Analysis', 'Breed Standards', 'Conformation']
        };
      }

      if (isShowRequest) {
        const response = await openai.analyze('show', { query: input });
        return {
          content: this.formatShowResponse(response),
          suggestions: response.show?.preparation.checklist || [],
          relatedTopics: ['Show Preparation', 'Competition Tips', 'Training Schedule']
        };
      }

      // Default response for general queries
      return this.getDefaultResponse();
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        suggestions: ['Try a simpler query', 'Check help documentation', 'Contact support'],
        relatedTopics: ['Troubleshooting', 'Help', 'Support']
      };
    }
  }

  private formatAnalysisResponse(response: AIResponse): string {
    if (!response.evaluation) {
      return 'I apologize, but I could not generate a proper analysis. Please try again.';
    }

    const { insights, recommendations, predictions } = response.evaluation;
    return `
      Based on my analysis:
      
      Key Insights:
      ${insights.map((insight: string) => `- ${insight}`).join('\n')}
      
      Recommendations:
      ${recommendations.map((rec: string) => `- ${rec}`).join('\n')}
      
      Performance Prediction:
      Show Performance Score: ${predictions.showPerformance}/10
      Confidence Level: ${predictions.confidenceLevel * 100}%
      
      Would you like to explore any specific aspect in more detail?
    `;
  }

  private formatPhotoResponse(response: AIResponse): string {
    if (!response.photo) {
      return 'I apologize, but I could not analyze the photo properly. Please try again.';
    }

    const { conformation, muscleDevelopment, breedCharacteristics } = response.photo;
    return `
      Photo Analysis Results:
      
      Conformation (${conformation.score}/10):
      ${conformation.issues.map((issue: string) => `- ${issue}`).join('\n')}
      
      Muscle Development (${muscleDevelopment.score}/10):
      Strengths:
      ${muscleDevelopment.strengths.map((strength: string) => `- ${strength}`).join('\n')}
      
      Breed Characteristics (${breedCharacteristics.score}/10):
      Matching Traits:
      ${breedCharacteristics.matching.map((trait: string) => `- ${trait}`).join('\n')}
      
      Would you like specific recommendations for improvement?
    `;
  }

  private formatShowResponse(response: AIResponse): string {
    if (!response.show) {
      return 'I apologize, but I could not generate show preparation advice. Please try again.';
    }

    const { readiness, preparation, strategy } = response.show;
    return `
      Show Preparation Analysis:
      
      Readiness Level: ${readiness.score}/10
      
      Key Preparation Steps:
      ${preparation.checklist.map((step: string) => `- ${step}`).join('\n')}
      
      Strategy Recommendations:
      ${strategy.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
      
      Would you like to focus on any specific aspect of show preparation?
    `;
  }

  private getDefaultResponse(): ProcessedResponse {
    const responses = [
      "I can help you with performance analysis, photo evaluation, and show preparation. What would you like to explore?",
      "Let me assist you with your livestock management needs. Would you like to analyze performance data or evaluate photos?",
      "I'm here to help with evaluations, show preparation, and training recommendations. What area should we focus on?",
      "How can I assist you today? I can analyze performance, evaluate photos, or help with show preparation."
    ];
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      suggestions: [
        'Analyze performance',
        'Upload a photo',
        'Check show preparation',
        'View training tips'
      ],
      relatedTopics: ['General Help', 'Quick Start', 'Features']
    };
  }
}

export const aiService = AIService.getInstance();