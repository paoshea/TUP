import { Router } from 'express';
import { showController } from '../controllers';
import { authenticate } from '../middleware';
import { validateRequest } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  criteria: z.array(z.string()).optional(),
});

const createShowSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Show name is required'),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
    categories: z.array(categorySchema).min(1, 'At least one category is required'),
    registrationDeadline: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid registration deadline format',
    }),
  }),
});

const updateShowSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }).optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    categories: z.array(categorySchema).optional(),
    registrationDeadline: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid registration deadline format',
    }).optional(),
  }),
  params: z.object({
    showId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
  }),
});

const createEntrySchema = z.object({
  body: z.object({
    animalId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    category: z.string().min(1, 'Category is required'),
  }),
  params: z.object({
    showId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
  }),
});

const recordResultSchema = z.object({
  body: z.object({
    placement: z.number().int().min(1, 'Placement must be at least 1'),
    points: z.number().min(0, 'Points cannot be negative'),
    notes: z.string().optional(),
  }),
  params: z.object({
    entryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid entry ID'),
  }),
});

const idParamSchema = z.object({
  params: z.object({
    showId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid show ID'),
  }),
});

// All routes require authentication
router.use(authenticate);

// Show management routes
router.post('/', validateRequest(createShowSchema), showController.createShow);

router.get('/organized', showController.getOrganizedShows);

router.get('/upcoming', showController.getUpcomingShows);

router.get(
  '/:showId',
  validateRequest(idParamSchema),
  showController.getShow
);

router.patch(
  '/:showId',
  validateRequest(updateShowSchema),
  showController.updateShow
);

router.delete(
  '/:showId',
  validateRequest(idParamSchema),
  showController.deleteShow
);

// Show entry routes
router.post(
  '/:showId/entries',
  validateRequest(createEntrySchema),
  showController.createShowEntry
);

router.get(
  '/:showId/entries',
  validateRequest(idParamSchema),
  showController.getShowEntries
);

// Show results routes
router.post(
  '/entries/:entryId/results',
  validateRequest(recordResultSchema),
  showController.recordShowResult
);

router.get(
  '/:showId/stats',
  validateRequest(idParamSchema),
  showController.getShowStats
);

export default router;