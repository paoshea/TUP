import { PrismaService } from './PrismaService';
import { ApiError } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';
import {
  CreateEvaluationInput,
  UpdateEvaluationInput,
  EvaluationWithRelations,
  EvaluationScores,
  EvaluationMetadata,
  EVALUATION_CRITERIA,
  evaluationInclude,
  isEvaluationScores,
  isEvaluationMetadata,
  RawEvaluation
} from '../types/evaluation';

export class EvaluationService extends PrismaService {
  /**
   * Transform raw evaluation data to typed evaluation
   */
  private transformEvaluation(evaluation: RawEvaluation): EvaluationWithRelations {
    const scores = typeof evaluation.scores === 'string' 
      ? JSON.parse(evaluation.scores)
      : evaluation.scores;

    if (!scores || !isEvaluationScores(scores)) {
      throw new ApiError(500, 'INVALID_DATA', 'Invalid evaluation scores format');
    }

    const metadata = evaluation.metadata 
      ? (typeof evaluation.metadata === 'string' 
        ? JSON.parse(evaluation.metadata)
        : evaluation.metadata)
      : undefined;

    if (metadata && !isEvaluationMetadata(metadata)) {
      throw new ApiError(500, 'INVALID_DATA', 'Invalid evaluation metadata format');
    }

    return {
      ...evaluation,
      scores,
      metadata
    };
  }

  /**
   * Create an evaluation
   */
  async createEvaluation(
    data: CreateEvaluationInput,
    evaluatorId: string
  ): Promise<EvaluationWithRelations> {
    try {
      // Validate scores
      this.validateScores(data.scores);

      const createData: Prisma.EvaluationCreateInput = {
        scores: data.scores as Prisma.InputJsonValue,
        notes: data.notes ?? null,
        metadata: data.metadata as Prisma.InputJsonValue ?? null,
        animal: {
          connect: { id: data.animalId }
        },
        evaluator: {
          connect: { id: evaluatorId }
        }
      };

      const result = await this.evaluation.create({
        data: createData,
        include: evaluationInclude
      });

      return this.transformEvaluation(result);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get evaluation by ID
   */
  async getEvaluationById(
    evaluationId: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<EvaluationWithRelations> {
    try {
      const evaluation = await this.evaluation.findUnique({
        where: { id: evaluationId },
        include: evaluationInclude
      });

      if (!evaluation) {
        throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
      }

      // Check access - allow if user is admin or evaluator
      if (!isAdmin && evaluation.evaluatorId !== userId) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this evaluation');
      }

      return this.transformEvaluation(evaluation);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get evaluations for an animal
   */
  async getAnimalEvaluations(animalId: string): Promise<EvaluationWithRelations[]> {
    try {
      const evaluations = await this.evaluation.findMany({
        where: { animalId },
        include: evaluationInclude,
        orderBy: { createdAt: 'desc' }
      });

      return evaluations.map((evaluation: RawEvaluation) => this.transformEvaluation(evaluation));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get evaluations by evaluator
   */
  async getEvaluatorEvaluations(evaluatorId: string): Promise<EvaluationWithRelations[]> {
    try {
      const evaluations = await this.evaluation.findMany({
        where: { evaluatorId },
        include: evaluationInclude,
        orderBy: { createdAt: 'desc' }
      });

      return evaluations.map((evaluation: RawEvaluation) => this.transformEvaluation(evaluation));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update an evaluation
   */
  async updateEvaluation(
    evaluationId: string,
    data: UpdateEvaluationInput,
    evaluatorId: string
  ): Promise<EvaluationWithRelations> {
    try {
      // Verify evaluation exists and belongs to evaluator
      const existing = await this.getEvaluationById(evaluationId, evaluatorId);

      // Validate scores if provided
      if (data.scores) {
        this.validateScores(data.scores);
      }

      const updateData: Prisma.EvaluationUpdateInput = {
        scores: data.scores as Prisma.InputJsonValue ?? undefined,
        notes: data.notes,
        metadata: data.metadata as Prisma.InputJsonValue ?? undefined
      };

      const result = await this.evaluation.update({
        where: { id: evaluationId },
        data: updateData,
        include: evaluationInclude
      });

      return this.transformEvaluation(result);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete an evaluation
   */
  async deleteEvaluation(evaluationId: string, evaluatorId: string): Promise<void> {
    try {
      // Verify evaluation exists and belongs to evaluator
      await this.getEvaluationById(evaluationId, evaluatorId);

      await this.evaluation.delete({
        where: { id: evaluationId }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get evaluation statistics
   */
  async getEvaluationStats(animalId: string): Promise<{
    totalEvaluations: number;
    averageScores: Partial<EvaluationScores>;
  }> {
    try {
      const evaluations = await this.evaluation.findMany({
        where: { animalId },
        select: { scores: true }
      });

      if (!evaluations.length) {
        return {
          totalEvaluations: 0,
          averageScores: {}
        };
      }

      const scores = evaluations
        .map(e => typeof e.scores === 'string' ? JSON.parse(e.scores) : e.scores)
        .filter((s): s is EvaluationScores => s !== undefined && isEvaluationScores(s));

      const totalEvaluations = scores.length;

      const averageScores = Object.keys(EVALUATION_CRITERIA).reduce<Partial<EvaluationScores>>((acc, category) => {
        const total = scores.reduce((sum: number, score: EvaluationScores) => sum + score[category], 0);
        acc[category] = Math.round((total / totalEvaluations) * 10) / 10;
        return acc;
      }, {});

      return {
        totalEvaluations,
        averageScores
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Validate evaluation scores
   */
  private validateScores(scores: EvaluationScores): void {
    for (const [category, score] of Object.entries(scores)) {
      const criteria = EVALUATION_CRITERIA[category];
      if (!criteria) {
        throw new ApiError(400, 'INVALID_CATEGORY', `Invalid evaluation category: ${category}`);
      }

      if (typeof score !== 'number' || score < 0 || score > criteria.maxScore) {
        throw new ApiError(
          400,
          'INVALID_SCORE',
          `Invalid score for ${category}. Must be between 0 and ${criteria.maxScore}`
        );
      }
    }
  }
}

// Export singleton instance
export const evaluationService = new EvaluationService();