import { Router } from 'express';
import { animalController } from '../controllers';
import { authenticate } from '../middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new animal
router.post('/', animalController.createAnimal);

// Get all animals for the authenticated user
router.get('/', animalController.getAnimals);

// Get a specific animal
router.get('/:animalId', animalController.getAnimal);

// Update an animal
router.put('/:animalId', animalController.updateAnimal);

// Delete an animal
router.delete('/:animalId', animalController.deleteAnimal);

// Search animals
router.get('/search', animalController.searchAnimals);

// Get animal statistics
router.get('/stats', animalController.getStats);

export default router;