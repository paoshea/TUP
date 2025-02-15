import { Response } from 'express';
import { animalService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { RequestWithUser } from '../types';
import { CreateAnimalInput, UpdateAnimalInput } from '../services/AnimalService';

export const createAnimal = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const ownerId = req.user!.id;
  const animal = await animalService.createAnimal(req.body as CreateAnimalInput, ownerId);
  res.status(201).json({ success: true, data: animal });
});

export const getAnimals = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const animals = await animalService.getUserAnimals(userId);
  res.json({ success: true, data: animals });
});

export const getAnimal = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { animalId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const animal = await animalService.getAnimalById(animalId, userId, isAdmin);
  res.json({ success: true, data: animal });
});

export const updateAnimal = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { animalId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const animal = await animalService.updateAnimal(
    animalId,
    userId,
    req.body as UpdateAnimalInput,
    isAdmin
  );
  res.json({ success: true, data: animal });
});

export const deleteAnimal = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { animalId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  await animalService.deleteAnimal(animalId, userId, isAdmin);
  res.json({ success: true, message: 'Animal deleted successfully' });
});

export const searchAnimals = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { breed, category, region } = req.query as {
    breed?: string;
    category?: string;
    region?: string;
  };

  const animals = await animalService.searchAnimals({ breed, category, region });
  res.json({ success: true, data: animals });
});

export const getStats = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const stats = await animalService.getAnimalStats(userId);
  res.json({ success: true, data: stats });
});