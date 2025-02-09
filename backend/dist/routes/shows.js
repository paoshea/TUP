"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required'),
    description: zod_1.z.string().optional(),
    criteria: zod_1.z.array(zod_1.z.string()).optional(),
});
const createShowSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Show name is required'),
        date: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }),
        location: zod_1.z.string().min(1, 'Location is required'),
        description: zod_1.z.string().optional(),
        categories: zod_1.z.array(categorySchema).min(1, 'At least one category is required'),
        registrationDeadline: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration deadline format',
        }),
    }),
});
const updateShowSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        date: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }).optional(),
        location: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        categories: zod_1.z.array(categorySchema).optional(),
        registrationDeadline: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration deadline format',
        }).optional(),
    }),
    params: zod_1.z.object({
        showId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
    }),
});
const createEntrySchema = zod_1.z.object({
    body: zod_1.z.object({
        animalId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
        category: zod_1.z.string().min(1, 'Category is required'),
    }),
    params: zod_1.z.object({
        showId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
    }),
});
const recordResultSchema = zod_1.z.object({
    body: zod_1.z.object({
        placement: zod_1.z.number().int().min(1, 'Placement must be at least 1'),
        points: zod_1.z.number().min(0, 'Points cannot be negative'),
        notes: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        entryId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid entry ID'),
    }),
});
const idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        showId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
    }),
});
// All routes require authentication
router.use(middleware_1.authenticate);
// Show management routes
router.post('/', (0, validation_1.validateRequest)(createShowSchema), controllers_1.showController.createShow);
router.get('/organized', controllers_1.showController.getOrganizedShows);
router.get('/upcoming', controllers_1.showController.getUpcomingShows);
router.get('/:showId', (0, validation_1.validateRequest)(idParamSchema), controllers_1.showController.getShow);
router.patch('/:showId', (0, validation_1.validateRequest)(updateShowSchema), controllers_1.showController.updateShow);
router.delete('/:showId', (0, validation_1.validateRequest)(idParamSchema), controllers_1.showController.deleteShow);
// Show entry routes
router.post('/:showId/entries', (0, validation_1.validateRequest)(createEntrySchema), controllers_1.showController.createShowEntry);
router.get('/:showId/entries', (0, validation_1.validateRequest)(idParamSchema), controllers_1.showController.getShowEntries);
// Show results routes
router.post('/entries/:entryId/results', (0, validation_1.validateRequest)(recordResultSchema), controllers_1.showController.recordShowResult);
router.get('/:showId/stats', (0, validation_1.validateRequest)(idParamSchema), controllers_1.showController.getShowStats);
exports.default = router;
