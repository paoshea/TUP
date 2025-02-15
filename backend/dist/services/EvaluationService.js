"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluationService = exports.EvaluationService = void 0;
const PrismaService_1 = require("./PrismaService");
const apiResponse_1 = require("../utils/apiResponse");
const evaluation_1 = require("../types/evaluation");
class EvaluationService extends PrismaService_1.PrismaService {
    /**
     * Transform raw evaluation data to typed evaluation
     */
    transformEvaluation(evaluation) {
        const scores = typeof evaluation.scores === 'string'
            ? JSON.parse(evaluation.scores)
            : evaluation.scores;
        if (!scores || !(0, evaluation_1.isEvaluationScores)(scores)) {
            throw new apiResponse_1.ApiError(500, 'INVALID_DATA', 'Invalid evaluation scores format');
        }
        const metadata = evaluation.metadata
            ? (typeof evaluation.metadata === 'string'
                ? JSON.parse(evaluation.metadata)
                : evaluation.metadata)
            : undefined;
        if (metadata && !(0, evaluation_1.isEvaluationMetadata)(metadata)) {
            throw new apiResponse_1.ApiError(500, 'INVALID_DATA', 'Invalid evaluation metadata format');
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
    async createEvaluation(data, evaluatorId) {
        var _a, _b;
        try {
            // Validate scores
            this.validateScores(data.scores);
            const createData = {
                scores: data.scores,
                notes: (_a = data.notes) !== null && _a !== void 0 ? _a : null,
                metadata: (_b = data.metadata) !== null && _b !== void 0 ? _b : null,
                animal: {
                    connect: { id: data.animalId }
                },
                evaluator: {
                    connect: { id: evaluatorId }
                }
            };
            const result = await this.evaluation.create({
                data: createData,
                include: evaluation_1.evaluationInclude
            });
            return this.transformEvaluation(result);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get evaluation by ID
     */
    async getEvaluationById(evaluationId, userId, isAdmin = false) {
        try {
            const evaluation = await this.evaluation.findUnique({
                where: { id: evaluationId },
                include: evaluation_1.evaluationInclude
            });
            if (!evaluation) {
                throw new apiResponse_1.ApiError(404, 'EVALUATION_NOT_FOUND', 'Evaluation not found');
            }
            // Check access - allow if user is admin or evaluator
            if (!isAdmin && evaluation.evaluatorId !== userId) {
                throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'You do not have access to this evaluation');
            }
            return this.transformEvaluation(evaluation);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get evaluations for an animal
     */
    async getAnimalEvaluations(animalId) {
        try {
            const evaluations = await this.evaluation.findMany({
                where: { animalId },
                include: evaluation_1.evaluationInclude,
                orderBy: { createdAt: 'desc' }
            });
            return evaluations.map((evaluation) => this.transformEvaluation(evaluation));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get evaluations by evaluator
     */
    async getEvaluatorEvaluations(evaluatorId) {
        try {
            const evaluations = await this.evaluation.findMany({
                where: { evaluatorId },
                include: evaluation_1.evaluationInclude,
                orderBy: { createdAt: 'desc' }
            });
            return evaluations.map((evaluation) => this.transformEvaluation(evaluation));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Update an evaluation
     */
    async updateEvaluation(evaluationId, data, evaluatorId) {
        var _a, _b;
        try {
            // Verify evaluation exists and belongs to evaluator
            const existing = await this.getEvaluationById(evaluationId, evaluatorId);
            // Validate scores if provided
            if (data.scores) {
                this.validateScores(data.scores);
            }
            const updateData = {
                scores: (_a = data.scores) !== null && _a !== void 0 ? _a : undefined,
                notes: data.notes,
                metadata: (_b = data.metadata) !== null && _b !== void 0 ? _b : undefined
            };
            const result = await this.evaluation.update({
                where: { id: evaluationId },
                data: updateData,
                include: evaluation_1.evaluationInclude
            });
            return this.transformEvaluation(result);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Delete an evaluation
     */
    async deleteEvaluation(evaluationId, evaluatorId) {
        try {
            // Verify evaluation exists and belongs to evaluator
            await this.getEvaluationById(evaluationId, evaluatorId);
            await this.evaluation.delete({
                where: { id: evaluationId }
            });
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get evaluation statistics
     */
    async getEvaluationStats(animalId) {
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
                .filter((s) => s !== undefined && (0, evaluation_1.isEvaluationScores)(s));
            const totalEvaluations = scores.length;
            const averageScores = Object.keys(evaluation_1.EVALUATION_CRITERIA).reduce((acc, category) => {
                const total = scores.reduce((sum, score) => sum + score[category], 0);
                acc[category] = Math.round((total / totalEvaluations) * 10) / 10;
                return acc;
            }, {});
            return {
                totalEvaluations,
                averageScores
            };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Validate evaluation scores
     */
    validateScores(scores) {
        for (const [category, score] of Object.entries(scores)) {
            const criteria = evaluation_1.EVALUATION_CRITERIA[category];
            if (!criteria) {
                throw new apiResponse_1.ApiError(400, 'INVALID_CATEGORY', `Invalid evaluation category: ${category}`);
            }
            if (typeof score !== 'number' || score < 0 || score > criteria.maxScore) {
                throw new apiResponse_1.ApiError(400, 'INVALID_SCORE', `Invalid score for ${category}. Must be between 0 and ${criteria.maxScore}`);
            }
        }
    }
}
exports.EvaluationService = EvaluationService;
// Export singleton instance
exports.evaluationService = new EvaluationService();
