import { Router } from 'express';
import { animalController } from '../controllers';
import { authenticate } from '../middleware';
import { validateRequest } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createAnimalSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    breed: z.string().min(1, 'Breed is required'),
    category: z.string().min(1, 'Category is required'),
    region: z.string().min(1, 'Region is required'),
    notes: z.string().optional(),
  }),
});

const updateAnimalSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    breed: z.string().optional(),
    category: z.string().optional(),
    region: z.string().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
  }),
});

const searchSchema = z.object({
  query: z.object({
    breed: z.string().optional(),
    category: z.string().optional(),
    region: z.string().optional(),
    minScore: z.string()
      .optional()
      .transform(val => val ? Number(val) : undefined)
      .refine(val => val === undefined || (val >= 0 && val <= 10), {
        message: 'Min score must be between 0 and 10',
      }),
    maxScore: z.string()
      .optional()
      .transform(val => val ? Number(val) : undefined)
      .refine(val => val === undefined || (val >= 0 && val <= 10), {
        message: 'Max score must be between 0 and 10',
      }),
  }),
});

// All routes require authentication
router.use(authenticate);

// Routes
router.post('/', validateRequest(createAnimalSchema), animalController.createAnimal);

router.get('/', animalController.getAnimals);

router.get('/search', validateRequest(searchSchema), animalController.searchAnimals);

router.get('/stats', animalController.getAnimalStats);

router.get(
  '/:id',
  validateRequest(z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
  })),
  animalController.getAnimal
);

router.patch(
  '/:id',
  validateRequest(updateAnimalSchema),
  animalController.updateAnimal
);

router.delete(
  '/:id',
  validateRequest(z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid animal ID'),
    }),
  })),
  animalController.deleteAnimal
);

export default router;