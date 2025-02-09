"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const createAnimalSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        breed: zod_1.z.string().min(1, 'Breed is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        region: zod_1.z.string().min(1, 'Region is required'),
        notes: zod_1.z.string().optional(),
    }),
});
const updateAnimalSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        breed: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        region: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
});
const searchSchema = zod_1.z.object({
    query: zod_1.z.object({
        breed: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        region: zod_1.z.string().optional(),
        minScore: zod_1.z.string()
            .optional()
            .transform(val => val ? Number(val) : undefined)
            .refine(val => val === undefined || (val >= 0 && val <= 10), {
            message: 'Min score must be between 0 and 10',
        }),
        maxScore: zod_1.z.string()
            .optional()
            .transform(val => val ? Number(val) : undefined)
            .refine(val => val === undefined || (val >= 0 && val <= 10), {
            message: 'Max score must be between 0 and 10',
        }),
    }),
});
// All routes require authentication
router.use(middleware_1.authenticate);
// Routes
router.post('/', (0, validation_1.validateRequest)(createAnimalSchema), controllers_1.animalController.createAnimal);
router.get('/', controllers_1.animalController.getAnimals);
router.get('/search', (0, validation_1.validateRequest)(searchSchema), controllers_1.animalController.searchAnimals);
router.get('/stats', controllers_1.animalController.getAnimalStats);
router.get('/:id', (0, validation_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
})), controllers_1.animalController.getAnimal);
router.patch('/:id', (0, validation_1.validateRequest)(updateAnimalSchema), controllers_1.animalController.updateAnimal);
router.delete('/:id', (0, validation_1.validateRequest)(zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
})), controllers_1.animalController.deleteAnimal);
exports.default = router;
