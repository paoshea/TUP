import { Types } from 'mongoose';
import { Evaluation } from '../models';
import { BaseService } from './BaseService';
import { ApiError } from '../utils/apiResponse';
import { animalService } from './AnimalService';
import type { IEvaluation } from '../models/Evaluation';

export class EvaluationService extends BaseService<IEvaluation> {
  constructor() {
    super(Evaluation);
  }

  /**
   * Create a new evaluation
   */
  async createEvaluation(
    animalId: string,
    evaluatorId: string,
    data: Partial<IEvaluation>
  ): Promise<IEvaluation> {
    // Verify animal exists
    const animal = await animalService.findById(animalId);
    if (!animal) {
      throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
    }

    // Create evaluation
    const evaluation = await this.create({
      ...data,
      animal: new Types.ObjectId(animalId),
      evaluator: new Types.ObjectId(evaluatorId),
    });

    return evaluation;
  }

  /**
   * Get evaluations for an animal
   */
  async getAnimalEvaluations(animalId: string): Promise<IEvaluation[]> {
    return this.find({
      animal: new Types.ObjectId(animalId),
    });
  }

  /**
   * Get evaluations by an evaluator
   */
  async getEvaluatorEvaluations(evaluatorId: string): Promise<IEvaluation[]> {
    return this.find({
      evaluator: new Types.ObjectId(evaluatorId),
    });
  }

  /**
   * Get an evaluation by ID and verify access
   */
  async getEvaluationById(
    evaluationId: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<IEvaluation> {
    const evaluation = await this.findById(evaluationId);
    if (!evaluation) {
      throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
    }

    // Check access - allow if user is admin, evaluator, or animal owner
    const animal = await animalService.findById(evaluation.animal.toString());
    if (!animal) {
      throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
    }

    const hasAccess = isAdmin ||
      evaluation.evaluator.toString() === userId ||
      animal.owner.toString() === userId;

    if (!hasAccess) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this evaluation');
    }

    return evaluation;
  }

  /**
   * Update an evaluation
   */
  async updateEvaluation(
    evaluationId: string,
    userId: string,
    data: Partial<IEvaluation>,
    isAdmin: boolean = false
  ): Promise<IEvaluation> {
    const evaluation = await this.getEvaluationById(evaluationId, userId, isAdmin);

    // Only allow evaluator or admin to update
    if (!isAdmin && evaluation.evaluator.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Only the evaluator can update this evaluation');
    }

    // Remove protected fields from update data
    const { animal, evaluator, ...updateData } = data;

    const updatedEvaluation = await this.update(evaluationId, updateData);
    if (!updatedEvaluation) {
      throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
    }

    return updatedEvaluation;
  }

  /**
   * Delete an evaluation
   */
  async deleteEvaluation(
    evaluationId: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    const evaluation = await this.getEvaluationById(evaluationId, userId, isAdmin);

    // Only allow evaluator or admin to delete
    if (!isAdmin && evaluation.evaluator.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Only the evaluator can delete this evaluation');
    }

    const deletedEvaluation = await this.delete(evaluationId);
    if (!deletedEvaluation) {
      throw new ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
    }
  }

  /**
   * Get evaluation statistics
   */
  async getEvaluationStats(animalId: string): Promise<{
    total: number;
    averageScores: Record<string, number>;
    scoreDistribution: Record<string, number[]>;
    evaluatorCount: number;
  }> {
    const evaluations = await this.getAnimalEvaluations(animalId);

    const stats = {
      total: evaluations.length,
      averageScores: {} as Record<string, number>,
      scoreDistribution: {} as Record<string, number[]>,
      evaluatorCount: new Set(evaluations.map(e => e.evaluator.toString())).size,
    };

    // Initialize score tracking
    const scoreTypes = ['movement', 'conformation', 'muscleDevelopment', 'breedCharacteristics'];
    const scoreArrays: Record<string, number[]> = {};
    scoreTypes.forEach(type => {
      scoreArrays[type] = [];
      stats.scoreDistribution[type] = Array(11).fill(0); // 0-10 scores
    });

    // Calculate statistics
    evaluations.forEach(evaluation => {
      Object.entries(evaluation.scores).forEach(([type, score]) => {
        scoreArrays[type].push(score);
        stats.scoreDistribution[type][score]++;
      });
    });

    // Calculate averages
    Object.entries(scoreArrays).forEach(([type, scores]) => {
      stats.averageScores[type] = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    });

    return stats;
  }
}

// Export singleton instance
export const evaluationService = new EvaluationService();