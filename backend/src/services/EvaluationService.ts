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
  RawEvaluation,
  DbCreateInput,
  DbUpdateInput
} from '../types/evaluation';

export class EvaluationService extends PrismaService {
  /**
   * Transform raw evaluation data to typed evaluation
   */
  private transformEvaluation(evaluation: RawEvaluation): EvaluationWithRelations {
    return {
      ...evaluation,
      scores: evaluation.scores as EvaluationScores,
      metadata: evaluation.metadata as EvaluationMetadata | undefined
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

      // Create evaluation
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
   * Get evaluations for an animal
   */
  async getAnimalEvaluations(animalId: string): Promise<EvaluationWithRelations[]> {
    try {
      const evaluations = await this.evaluation.findMany({
        where: { animalId },
        include: evaluationInclude,
        orderBy: { createdAt: 'desc' }
      });

      return evaluations.map((evaluation) => this.transformEvaluation(evaluation));
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

      return evaluations.map((evaluation) => this.transformEvaluation(evaluation));
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
      const existing = await this.evaluation.findFirst({
        where: {
          id: evaluationId,
          evaluatorId
        }
      });

      if (!existing) {
        throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found or access denied');
      }

      // Validate scores if provided
      if (data.scores) {
        this.validateScores(data.scores);
      }

      const updateData: DbUpdateInput = {
        scores: data.scores ? (data.scores as Prisma.InputJsonValue) : undefined,
        notes: data.notes ?? undefined,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined
      };

      // Update evaluation
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
      const existing = await this.evaluation.findFirst({
        where: {
          id: evaluationId,
          evaluatorId
        }
      });

      if (!existing) {
        throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found or access denied');
      }

      await this.evaluation.delete({
        where: { id: evaluationId }
      });
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