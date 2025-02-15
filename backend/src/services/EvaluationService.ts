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
  serializeJson,
  serializeNullableJson,
  parseJson,
  isEvaluationScores,
  isEvaluationMetadata,
  DbCreateInput,
  DbUpdateInput
} from '../types/evaluation';

export class EvaluationService extends PrismaService {
  /**
   * Transform raw evaluation data to typed evaluation
   */
  private transformEvaluation(evaluation: Prisma.EvaluationGetPayload<{
    include: typeof evaluationInclude;
  }>): EvaluationWithRelations {
    const scores = parseJson<EvaluationScores>(evaluation.scores);
    if (!scores || !isEvaluationScores(scores)) {
      throw new ApiError(500, 'INVALID_DATA', 'Invalid evaluation scores format');
    }

    const metadata = parseJson<EvaluationMetadata>(evaluation.metadata);
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

      const createData: DbCreateInput = {
        scores: serializeJson(data.scores),
        notes: data.notes ?? null,
        metadata: serializeNullableJson(data.metadata),
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

      return evaluations.map(evaluation => this.transformEvaluation(evaluation));
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

      return evaluations.map(evaluation => this.transformEvaluation(evaluation));
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

      const updateData: DbUpdateInput = {
        scores: data.scores ? serializeJson(data.scores) : undefined,
        notes: data.notes,
        metadata: data.metadata !== undefined ? serializeNullableJson(data.metadata) : undefined
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

      const scores = evaluations.map(e => parseJson<EvaluationScores>(e.scores))
        .filter((s): s is EvaluationScores => s !== undefined && isEvaluationScores(s));

      const totalEvaluations = scores.length;

      const averageScores = Object.keys(EVALUATION_CRITERIA).reduce((acc, category) => {
        const total = scores.reduce((sum, score) => sum + score[category], 0);
        acc[category] = Math.round((total / totalEvaluations) * 10) / 10;
        return acc;
      }, {} as Partial<EvaluationScores>);

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