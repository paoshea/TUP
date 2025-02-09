import { DeepseekService } from '@/services/deepseek.service';
import { AdvancedCache } from '@/services/cache';
import { openai } from '@/services/openai';

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

interface AnalysisCache {
  analysis: PerformanceAnalysis;
  timestamp: number;
}

export class LivestockAI {
  private static instance: LivestockAI;
  private deepseek: DeepseekService;
  private cache: AdvancedCache;
  private readonly CACHE_MAX_AGE = 3600000; // 1 hour
  private readonly CACHE_MAX_ITEMS = 100;

  private constructor() {
    this.deepseek = DeepseekService.getInstance();
    this.cache = new AdvancedCache({
      maxAge: this.CACHE_MAX_AGE,
      maxItems: this.CACHE_MAX_ITEMS
    });
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
    // Check cache first
    const cacheKey = `performance_${animalId}_${JSON.stringify(currentMetrics)}`;
    const cached = this.cache.get<AnalysisCache>(cacheKey);
    if (cached) {
      return cached.analysis;
    }

    try {
      // Try OpenAI analysis first
      const openAIResponse = await openai.analyze('evaluation', {
        currentMetrics,
        historicalData
      });

      if (openAIResponse.evaluation) {
        const analysis: PerformanceAnalysis = {
          currentScore: currentMetrics,
          historicalTrend: {
            improvement: this.calculateTrends(currentMetrics, historicalData),
            recommendations: openAIResponse.evaluation.recommendations
          },
          breedCompliance: {
            overallScore: openAIResponse.evaluation.predictions.showPerformance,
            strengthAreas: openAIResponse.evaluation.training.focus,
            improvementAreas: openAIResponse.evaluation.insights.filter(i => i.includes('improve'))
          },
          predictions: {
            expectedScores: this.calculateExpectedScores(currentMetrics, openAIResponse),
            confidenceLevel: openAIResponse.evaluation.predictions.confidenceLevel,
            factors: openAIResponse.evaluation.predictions.factors
          }
        };

        // Cache the result
        this.cache.set(cacheKey, {
          analysis,
          timestamp: Date.now()
        });

        return analysis;
      }

      // Fallback to Deepseek if OpenAI response is invalid
      return this.fallbackToDeepseek(currentMetrics, historicalData);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.performLocalAnalysis(currentMetrics, historicalData);
    }
  }

  private async fallbackToDeepseek(
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): Promise<PerformanceAnalysis> {
    try {
      const prompt = this.prepareAnalysisPrompt(currentMetrics, historicalData);
      const response = await this.deepseek.query(prompt);
      return this.processAIResponse(response, currentMetrics, historicalData);
    } catch (error) {
      console.error('Deepseek analysis failed:', error);
      return this.performLocalAnalysis(currentMetrics, historicalData);
    }
  }

  private calculateExpectedScores(
    currentMetrics: PerformanceMetrics,
    aiResponse: { evaluation?: { predictions: { showPerformance: number } } }
  ): PerformanceMetrics {
    const improvementFactor = (aiResponse.evaluation?.predictions.showPerformance || 0) / 10;
    return Object.entries(currentMetrics).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: Math.min(10, value * (1 + improvementFactor))
    }), {} as PerformanceMetrics);
  }

  private prepareAnalysisPrompt(
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
    response: string,
    currentMetrics: PerformanceMetrics,
    historicalData: PerformanceMetrics[]
  ): PerformanceAnalysis {
    try {
      const parsedResponse = JSON.parse(response);
      return this.validateAndStructureResponse(parsedResponse);
    } catch (error) {
      console.error('Error processing AI response:', error);
      return this.performLocalAnalysis(currentMetrics, historicalData);
    }
  }

  private validateAndStructureResponse(response: unknown): PerformanceAnalysis {
    // Implement validation logic here
    return response as PerformanceAnalysis;
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