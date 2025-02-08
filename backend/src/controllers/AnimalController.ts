import { Request, Response } from 'express';
import { animalService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiResponse';

export const createAnimal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const animal = await animalService.createAnimal(req.body, userId);
  res.status(201).json({ success: true, data: animal });
});

export const getAnimals = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const animals = await animalService.getUserAnimals(userId, req.query);
  res.json({ success: true, data: animals });
});

export const getAnimal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const animalId = req.params.id;

  const animal = await animalService.getAnimalById(animalId, userId);
  if (!animal) {
    throw new ApiError(404, 'NOT_FOUND', 'Animal not found');
  }

  res.json({ success: true, data: animal });
});

export const updateAnimal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const animalId = req.params.id;

  const animal = await animalService.updateAnimal(animalId, userId, req.body);
  res.json({ success: true, data: animal });
});

export const deleteAnimal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const animalId = req.params.id;

  await animalService.deleteAnimal(animalId, userId);
  res.json({ success: true, message: 'Animal deleted successfully' });
});

export const searchAnimals = asyncHandler(async (req: Request, res: Response) => {
  const animals = await animalService.searchAnimals(req.query);
  res.json({ success: true, data: animals });
});

export const getAnimalStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const stats = await animalService.getAnimalStats(userId);
  res.json({ success: true, data: stats });
});