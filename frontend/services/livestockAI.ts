// frontend/services/livestockAI.ts

import { DeepseekService } from '@/services/deepseek.service';

interface PerformanceMetrics {
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

interface PerformanceAnalysis {
  currentScore: PerformanceMetrics;
  historicalTrend: {
    improvement: Record<keyof PerformanceMetrics, number>;
    recommendations: string[];
  };
  breedCompliance: {
    overallScore: number;
    strengthAreas: string[];
    improvementAreas: string[];
  };
  predictions: {
    expectedScores: PerformanceMetrics;
    confidenceLevel: number;
    factors: string[];
  };
}

interface AIResponseData {
  currentScore: PerformanceMetrics;
  historicalTrend: {
    improvement: Record<keyof PerformanceMetrics, number>;
    recommendations: string[];
  };
  breedCompliance: {
    overallScore: number;
    strengthAreas: string[];
    improvementAreas: string[];
  };
  predictions: {
    expectedScores: PerformanceMetrics;
    confidenceLevel: number;
    factors: string[];
  };
}

export class LivestockAI {
  private deepseek: DeepseekService;
  private static instance: LivestockAI;

  private constructor() {
    this.deepseek = DeepseekService.getInstance();
  }

  static getInstance(): LivestockAI {
    if (!this.instance) {
      this.instance = new LivestockAI();
    }
    return this.instance;
  }

  async analyzePerformance(
    animalId: string,
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): Promise<PerformanceAnalysis> {
    try {
      // Prepare context for AI analysis
      const context = this.prepareAnalysisContext(currentMetrics, historicalData);
      
      // Get AI insights
      const aiAnalysis = await this.deepseek.query(context);
      
      // Process and structure the AI response
      return this.processAIResponse(aiAnalysis, currentMetrics, historicalData);
    } catch (error) {
      console.error('Error analyzing performance:', error);
      // Fallback to local analysis if AI fails
      return this.performLocalAnalysis(currentMetrics, historicalData);
    }
  }

  private prepareAnalysisContext(
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): string {
    return `
      Analyze livestock performance with the following data:
      
      Current Metrics:
      ${JSON.stringify(currentMetrics, null, 2)}
      
      Historical Data (${historicalData.length} entries):
      ${JSON.stringify(historicalData, null, 2)}
      
      Provide analysis including:
      1. Historical performance comparison
      2. Trend analysis
      3. Breed standard compliance
      4. Recommendations for improvement
      5. Performance predictions
    `;
  }

  private processAIResponse(
    aiResponse: string,
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): PerformanceAnalysis {
    try {
      // Attempt to parse AI response
      const parsedResponse = JSON.parse(aiResponse) as AIResponseData;
      return this.validateAndStructureResponse(parsedResponse);
    } catch (error) {
      console.error('Error processing AI response:', error);
      // Fallback to local analysis
      return this.performLocalAnalysis(currentMetrics, historicalData);
    }
  }

  private validateAndStructureResponse(response: AIResponseData): PerformanceAnalysis {
    return {
      currentScore: response.currentScore || {},
      historicalTrend: response.historicalTrend || {
        improvement: {},
        recommendations: []
      },
      breedCompliance: response.breedCompliance || {
        overallScore: 0,
        strengthAreas: [],
        improvementAreas: []
      },
      predictions: response.predictions || {
        expectedScores: {} as PerformanceMetrics,
        confidenceLevel: 0,
        factors: []
      }
    };
  }

  private performLocalAnalysis(
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): PerformanceAnalysis {
    // Calculate trends
    const trends = this.calculateTrends(currentMetrics, historicalData);
    
    // Generate local recommendations
    const recommendations = this.generateRecommendations(trends);
    
    // Calculate breed compliance
    const compliance = this.calculateBreedCompliance(currentMetrics);
    
    // Predict future performance
    const predictions = this.predictPerformance(trends);

    return {
      currentScore: currentMetrics,
      historicalTrend: {
        improvement: trends,
        recommendations
      },
      breedCompliance: compliance,
      predictions
    };
  }

  private calculateTrends(
    current: PerformanceMetrics,
    historical: PerformanceMetrics[]
  ): Record<keyof PerformanceMetrics, number> {
    const trends: Partial<Record<keyof PerformanceMetrics, number>> = {};
    
    Object.keys(current).forEach((metric) => {
      const key = metric as keyof PerformanceMetrics;
      const historicalValues = historical.map(h => h[key]);
      const average = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
      trends[key] = ((current[key] - average) / average) * 100;
    });

    return trends as Record<keyof PerformanceMetrics, number>;
  }

  private generateRecommendations(
    trends: Record<keyof PerformanceMetrics, number>
  ): string[] {
    const recommendations: string[] = [];
    
    Object.entries(trends).forEach(([metric, trend]) => {
      if (trend < 0) {
        recommendations.push(`Focus on improving ${metric} with targeted exercises`);
      } else if (trend < 5) {
        recommendations.push(`Maintain current ${metric} training routine`);
      } else {
        recommendations.push(`Excellent progress in ${metric}, consider advanced techniques`);
      }
    });

    return recommendations;
  }

  private calculateBreedCompliance(
    metrics: PerformanceMetrics
  ): PerformanceAnalysis['breedCompliance'] {
    // Implement breed-specific compliance checks
    const strengthAreas = Object.entries(metrics)
      .filter(([, value]) => value >= 8)
      .map(([key]) => key);

    const improvementAreas = Object.entries(metrics)
      .filter(([, value]) => value < 8)
      .map(([key]) => key);

    const overallScore = Object.values(metrics).reduce((a, b) => a + b, 0) / 4;

    return {
      overallScore,
      strengthAreas,
      improvementAreas
    };
  }

  private predictPerformance(
    trends: Record<keyof PerformanceMetrics, number>
  ): PerformanceAnalysis['predictions'] {
    const expectedScores: Partial<PerformanceMetrics> = {};
    const factors: string[] = [];
    let confidenceLevel = 0.8; // Base confidence

    Object.entries(trends).forEach(([metric, trend]) => {
      const key = metric as keyof PerformanceMetrics;
      expectedScores[key] = Math.min(10, Math.max(0, trend > 0 ? trend + 0.5 : trend - 0.5));
      
      if (trend > 0) {
        factors.push(`Positive trend in ${metric}`);
      } else {
        factors.push(`Area for improvement: ${metric}`);
        confidenceLevel -= 0.1;
      }
    });

    return {
      expectedScores: expectedScores as PerformanceMetrics,
      confidenceLevel,
      factors
    };
  }
}

export const livestockAI = LivestockAI.getInstance();