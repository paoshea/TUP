"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const scoreSchema = zod_1.z.number()
    .min(0, 'Score must be at least 0')
    .max(10, 'Score cannot exceed 10');
const createEvaluationSchema = zod_1.z.object({
    body: zod_1.z.object({
        scores: zod_1.z.object({
            movement: scoreSchema,
            conformation: scoreSchema,
            muscleDevelopment: scoreSchema,
            breedCharacteristics: scoreSchema,
        }),
        notes: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        animalId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
});
const updateEvaluationSchema = zod_1.z.object({
    body: zod_1.z.object({
        scores: zod_1.z.object({
            movement: scoreSchema,
            conformation: scoreSchema,
            muscleDevelopment: scoreSchema,
            breedCharacteristics: scoreSchema,
        }).optional(),
        notes: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        evaluationId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid evaluation ID'),
    }),
});
const idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        evaluationId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid evaluation ID'),
    }),
});
const animalIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        animalId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
});
// All routes require authentication
router.use(middleware_1.authenticate);
// Routes
router.post('/:animalId', (0, validation_1.validateRequest)(createEvaluationSchema), controllers_1.evaluationController.createEvaluation);
router.get('/animal/:animalId', (0, validation_1.validateRequest)(animalIdParamSchema), controllers_1.evaluationController.getAnimalEvaluations);
router.get('/evaluator', controllers_1.evaluationController.getEvaluatorEvaluations);
router.get('/:evaluationId', (0, validation_1.validateRequest)(idParamSchema), controllers_1.evaluationController.getEvaluation);
router.patch('/:evaluationId', (0, validation_1.validateRequest)(updateEvaluationSchema), controllers_1.evaluationController.updateEvaluation);
router.delete('/:evaluationId', (0, validation_1.validateRequest)(idParamSchema), controllers_1.evaluationController.deleteEvaluation);
router.get('/stats/:animalId', (0, validation_1.validateRequest)(animalIdParamSchema), controllers_1.evaluationController.getEvaluationStats);
exports.default = router;
