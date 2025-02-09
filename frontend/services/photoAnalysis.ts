import { DeepseekService } from '@/services/deepseek.service';
import { AdvancedCache } from '@/services/cache';

interface PhotoAnalysis {
  conformation: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  movement: {
    score: number;
    gaitAnalysis: string;
    improvements: string[];
  };
  breedStandards: {
    compliance: number;
    matchingTraits: string[];
    deviations: string[];
  };
}

interface AnalysisCache {
  analysis: PhotoAnalysis;
  timestamp: number;
}

export class PhotoAnalysisService {
  private static instance: PhotoAnalysisService;
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

  static getInstance(): PhotoAnalysisService {
    if (!this.instance) {
      this.instance = new PhotoAnalysisService();
    }
    return this.instance;
  }

  async analyzePhoto(photoUrl: string): Promise<PhotoAnalysis> {
    // Check cache first
    const cached = this.cache.get<AnalysisCache>(photoUrl);
    if (cached) {
      return cached.analysis;
    }

    try {
      // Prepare analysis prompt
      const prompt = this.prepareAnalysisPrompt(photoUrl);
      
      // Get AI analysis
      const aiResponse = await this.deepseek.query(prompt);
      
      // Parse and validate response
      const analysis = this.parseAIResponse(aiResponse);
      
      // Cache the result
      this.cache.set(photoUrl, {
        analysis,
        timestamp: Date.now()
      });

      return analysis;
    } catch (error) {
      console.error('Photo analysis failed:', error);
      throw new Error('Failed to analyze photo');
    }
  }

  private prepareAnalysisPrompt(photoUrl: string): string {
    return `
      Analyze the livestock photo at ${photoUrl} and provide detailed analysis including:

      1. Conformation Analysis:
         - Overall score
         - Structural issues
         - Improvement recommendations

      2. Movement Assessment:
         - Movement score
         - Gait analysis
         - Areas for improvement

      3. Breed Standard Compliance:
         - Compliance score
         - Matching breed traits
         - Deviations from standard

      Provide the analysis in JSON format matching the PhotoAnalysis interface.
    `;
  }

  private parseAIResponse(response: string): PhotoAnalysis {
    try {
      const parsed = JSON.parse(response);
      return this.validateAnalysis(parsed);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid analysis format');
    }
  }

  private validateAnalysis(data: unknown): PhotoAnalysis {
    // Implement validation logic
    if (!this.isValidPhotoAnalysis(data)) {
      throw new Error('Invalid analysis data structure');
    }
    return data;
  }

  private isValidPhotoAnalysis(data: unknown): data is PhotoAnalysis {
    if (!data || typeof data !== 'object') return false;
    
    const analysis = data as Partial<PhotoAnalysis>;
    
    return (
      this.isValidConformation(analysis.conformation) &&
      this.isValidMovement(analysis.movement) &&
      this.isValidBreedStandards(analysis.breedStandards)
    );
  }

  private isValidConformation(data: unknown): data is PhotoAnalysis['conformation'] {
    if (!data || typeof data !== 'object') return false;
    const conf = data as PhotoAnalysis['conformation'];
    return (
      typeof conf.score === 'number' &&
      Array.isArray(conf.issues) &&
      Array.isArray(conf.recommendations)
    );
  }

  private isValidMovement(data: unknown): data is PhotoAnalysis['movement'] {
    if (!data || typeof data !== 'object') return false;
    const mov = data as PhotoAnalysis['movement'];
    return (
      typeof mov.score === 'number' &&
      typeof mov.gaitAnalysis === 'string' &&
      Array.isArray(mov.improvements)
    );
  }

  private isValidBreedStandards(data: unknown): data is PhotoAnalysis['breedStandards'] {
    if (!data || typeof data !== 'object') return false;
    const std = data as PhotoAnalysis['breedStandards'];
    return (
      typeof std.compliance === 'number' &&
      Array.isArray(std.matchingTraits) &&
      Array.isArray(std.deviations)
    );
  }
}

export const photoAnalysis = PhotoAnalysisService.getInstance();