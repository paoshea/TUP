"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvaluationStats = exports.deleteEvaluation = exports.updateEvaluation = exports.getEvaluation = exports.getEvaluatorEvaluations = exports.getAnimalEvaluations = exports.createEvaluation = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createEvaluation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const evaluatorId = req.user.id;
    const { animalId } = req.params;
    const evaluation = await services_1.evaluationService.createEvaluation(animalId, evaluatorId, req.body);
    res.status(201).json({ success: true, data: evaluation });
});
exports.getAnimalEvaluations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { animalId } = req.params;
    const evaluations = await services_1.evaluationService.getAnimalEvaluations(animalId);
    res.json({ success: true, data: evaluations });
});
exports.getEvaluatorEvaluations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const evaluatorId = req.user.id;
    const evaluations = await services_1.evaluationService.getEvaluatorEvaluations(evaluatorId);
    res.json({ success: true, data: evaluations });
});
exports.getEvaluation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { evaluationId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const evaluation = await services_1.evaluationService.getEvaluationById(evaluationId, userId, isAdmin);
    res.json({ success: true, data: evaluation });
});
exports.updateEvaluation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { evaluationId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const evaluation = await services_1.evaluationService.updateEvaluation(evaluationId, userId, req.body, isAdmin);
    res.json({ success: true, data: evaluation });
});
exports.deleteEvaluation = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { evaluationId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    await services_1.evaluationService.deleteEvaluation(evaluationId, userId, isAdmin);
    res.json({ success: true, message: 'Evaluation deleted successfully' });
});
exports.getEvaluationStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { animalId } = req.params;
    const stats = await services_1.evaluationService.getEvaluationStats(animalId);
    res.json({ success: true, data: stats });
});
