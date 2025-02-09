"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluationService = exports.EvaluationService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const BaseService_1 = require("./BaseService");
const apiResponse_1 = require("../utils/apiResponse");
const AnimalService_1 = require("./AnimalService");
class EvaluationService extends BaseService_1.BaseService {
    constructor() {
        super(models_1.Evaluation);
    }
    /**
     * Create a new evaluation
     */
    async createEvaluation(animalId, evaluatorId, data) {
        // Verify animal exists
        const animal = await AnimalService_1.animalService.findById(animalId);
        if (!animal) {
            throw new apiResponse_1.ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
        }
        // Create evaluation
        const evaluation = await this.create({
            ...data,
            animal: new mongoose_1.Types.ObjectId(animalId),
            evaluator: new mongoose_1.Types.ObjectId(evaluatorId),
        });
        return evaluation;
    }
    /**
     * Get evaluations for an animal
     */
    async getAnimalEvaluations(animalId) {
        return this.find({
            animal: new mongoose_1.Types.ObjectId(animalId),
        });
    }
    /**
     * Get evaluations by an evaluator
     */
    async getEvaluatorEvaluations(evaluatorId) {
        return this.find({
            evaluator: new mongoose_1.Types.ObjectId(evaluatorId),
        });
    }
    /**
     * Get an evaluation by ID and verify access
     */
    async getEvaluationById(evaluationId, userId, isAdmin = false) {
        const evaluation = await this.findById(evaluationId);
        if (!evaluation) {
            throw new apiResponse_1.ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
        }
        // Check access - allow if user is admin, evaluator, or animal owner
        const animal = await AnimalService_1.animalService.findById(evaluation.animal.toString());
        if (!animal) {
            throw new apiResponse_1.ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
        }
        const hasAccess = isAdmin ||
            evaluation.evaluator.toString() === userId ||
            animal.owner.toString() === userId;
        if (!hasAccess) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'You do not have access to this evaluation');
        }
        return evaluation;
    }
    /**
     * Update an evaluation
     */
    async updateEvaluation(evaluationId, userId, data, isAdmin = false) {
        const evaluation = await this.getEvaluationById(evaluationId, userId, isAdmin);
        // Only allow evaluator or admin to update
        if (!isAdmin && evaluation.evaluator.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'Only the evaluator can update this evaluation');
        }
        // Remove protected fields from update data
        const { animal, evaluator, ...updateData } = data;
        const updatedEvaluation = await this.update(evaluationId, updateData);
        if (!updatedEvaluation) {
            throw new apiResponse_1.ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
        }
        return updatedEvaluation;
    }
    /**
     * Delete an evaluation
     */
    async deleteEvaluation(evaluationId, userId, isAdmin = false) {
        const evaluation = await this.getEvaluationById(evaluationId, userId, isAdmin);
        // Only allow evaluator or admin to delete
        if (!isAdmin && evaluation.evaluator.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'Only the evaluator can delete this evaluation');
        }
        const deletedEvaluation = await this.delete(evaluationId);
        if (!deletedEvaluation) {
            throw new apiResponse_1.ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
        }
    }
    /**
     * Get evaluation statistics
     */
    async getEvaluationStats(animalId) {
        const evaluations = await this.getAnimalEvaluations(animalId);
        const stats = {
            total: evaluations.length,
            averageScores: {},
            scoreDistribution: {},
            evaluatorCount: new Set(evaluations.map(e => e.evaluator.toString())).size,
        };
        // Initialize score tracking
        const scoreTypes = ['movement', 'conformation', 'muscleDevelopment', 'breedCharacteristics'];
        const scoreArrays = {};
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
exports.EvaluationService = EvaluationService;
// Export singleton instance
exports.evaluationService = new EvaluationService();
