import { Router } from 'express';
import { evaluationController } from '../controllers';
import { authenticate } from '../middleware';
import { validateRequest } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Validation schemas
const scoreSchema = z.number()
  .min(0, 'Score must be at least 0')
  .max(10, 'Score cannot exceed 10');

const createEvaluationSchema = z.object({
  body: z.object({
    scores: z.object({
      movement: scoreSchema,
      conformation: scoreSchema,
      muscleDevelopment: scoreSchema,
      breedCharacteristics: scoreSchema,
    }),
    notes: z.string().optional(),
  }),
  params: z.object({
    animalId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
  }),
});

const updateEvaluationSchema = z.object({
  body: z.object({
    scores: z.object({
      movement: scoreSchema,
      conformation: scoreSchema,
      muscleDevelopment: scoreSchema,
      breedCharacteristics: scoreSchema,
    }).optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    evaluationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid evaluation ID'),
  }),
});

const idParamSchema = z.object({
  params: z.object({
    evaluationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid evaluation ID'),
  }),
});

const animalIdParamSchema = z.object({
  params: z.object({
    animalId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
  }),
});

// All routes require authentication
router.use(authenticate);

// Routes
router.post(
  '/:animalId',
  validateRequest(createEvaluationSchema),
  evaluationController.createEvaluation
);

router.get(
  '/animal/:animalId',
  validateRequest(animalIdParamSchema),
  evaluationController.getAnimalEvaluations
);

router.get('/evaluator', evaluationController.getEvaluatorEvaluations);

router.get(
  '/:evaluationId',
  validateRequest(idParamSchema),
  evaluationController.getEvaluation
);

router.patch(
  '/:evaluationId',
  validateRequest(updateEvaluationSchema),
  evaluationController.updateEvaluation
);

router.delete(
  '/:evaluationId',
  validateRequest(idParamSchema),
  evaluationController.deleteEvaluation
);

router.get(
  '/stats/:animalId',
  validateRequest(animalIdParamSchema),
  evaluationController.getEvaluationStats
);

export default router;