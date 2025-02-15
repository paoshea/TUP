import { Response } from 'express';
import { evaluationService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { RequestWithUser } from '../types';

export const createEvaluation = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const evaluatorId = req.user!.id;
  const evaluation = await evaluationService.createEvaluation(req.body, evaluatorId);
  res.status(201).json({ success: true, data: evaluation });
});

export const getAnimalEvaluations = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { animalId } = req.params;
  const evaluations = await evaluationService.getAnimalEvaluations(animalId);
  res.json({ success: true, data: evaluations });
});

export const getEvaluatorEvaluations = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const evaluatorId = req.user!.id;
  const evaluations = await evaluationService.getEvaluatorEvaluations(evaluatorId);
  res.json({ success: true, data: evaluations });
});

export const getEvaluation = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { evaluationId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const evaluation = await evaluationService.getEvaluationById(evaluationId, userId, isAdmin);
  res.json({ success: true, data: evaluation });
});

export const updateEvaluation = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { evaluationId } = req.params;

  const evaluation = await evaluationService.updateEvaluation(evaluationId, req.body, userId);
  res.json({ success: true, data: evaluation });
});

export const deleteEvaluation = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { evaluationId } = req.params;

  await evaluationService.deleteEvaluation(evaluationId, userId);
  res.json({ success: true, message: 'Evaluation deleted successfully' });
});

export const getEvaluationStats = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { animalId } = req.params;
  const stats = await evaluationService.getEvaluationStats(animalId);
  res.json({ success: true, data: stats });
});
