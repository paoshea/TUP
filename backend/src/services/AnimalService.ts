import { Types } from 'mongoose';
import { Animal } from '../models';
import { BaseService } from './BaseService';
import { ApiError } from '../utils/apiResponse';
import type { IAnimal } from '../models/Animal';

export class AnimalService extends BaseService<IAnimal> {
  constructor() {
    super(Animal);
  }

  /**
   * Create a new animal
   */
  async createAnimal(data: Partial<IAnimal>, userId: string): Promise<IAnimal> {
    const animal = await this.create({
      ...data,
      owner: new Types.ObjectId(userId),
    });
    return animal;
  }

  /**
   * Get animals owned by a user
   */
  async getUserAnimals(userId: string, query: any = {}): Promise<IAnimal[]> {
    return this.find({
      owner: new Types.ObjectId(userId),
      ...query,
    });
  }

  /**
   * Get an animal by ID and verify ownership
   */
  async getAnimalById(animalId: string, userId: string): Promise<IAnimal> {
    const animal = await this.findById(animalId);
    if (!animal) {
      throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
    }

    if (animal.owner.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this animal');
    }

    return animal;
  }

  /**
   * Update an animal
   */
  async updateAnimal(animalId: string, userId: string, data: Partial<IAnimal>): Promise<IAnimal> {
    const animal = await this.getAnimalById(animalId, userId);

    // Remove owner from update data for security
    const { owner, ...updateData } = data;

    const updatedAnimal = await this.update(animalId, updateData);
    if (!updatedAnimal) {
      throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
    }

    return updatedAnimal;
  }

  /**
   * Delete an animal
   */
  async deleteAnimal(animalId: string, userId: string): Promise<void> {
    const animal = await this.getAnimalById(animalId, userId);
    
    const deletedAnimal = await this.delete(animalId);
    if (!deletedAnimal) {
      throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
    }
  }

  /**
   * Search animals by criteria
   */
  async searchAnimals(criteria: {
    breed?: string;
    category?: string;
    region?: string;
    minScore?: number;
    maxScore?: number;
    owner?: string;
  }): Promise<IAnimal[]> {
    const query: any = {};

    if (criteria.breed) {
      query.breed = criteria.breed;
    }

    if (criteria.category) {
      query.category = criteria.category;
    }

    if (criteria.region) {
      query.region = criteria.region;
    }

    if (criteria.owner) {
      query.owner = new Types.ObjectId(criteria.owner);
    }

    if (criteria.minScore || criteria.maxScore) {
      query['scores.average'] = {};
      if (criteria.minScore) {
        query['scores.average'].$gte = criteria.minScore;
      }
      if (criteria.maxScore) {
        query['scores.average'].$lte = criteria.maxScore;
      }
    }

    return this.find(query);
  }

  /**
   * Get animal statistics
   */
  async getAnimalStats(userId: string): Promise<{
    total: number;
    byBreed: Record<string, number>;
    byCategory: Record<string, number>;
    averageScore: number;
  }> {
    const animals = await this.getUserAnimals(userId);

    const stats = {
      total: animals.length,
      byBreed: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      averageScore: 0,
    };

    let totalScore = 0;
    let scoreCount = 0;

    animals.forEach(animal => {
      // Count by breed
      stats.byBreed[animal.breed] = (stats.byBreed[animal.breed] || 0) + 1;

      // Count by category
      stats.byCategory[animal.category] = (stats.byCategory[animal.category] || 0) + 1;

      // Calculate average score
      const scores = Object.values(animal.scores);
      if (scores.length > 0) {
        totalScore += scores.reduce((a, b) => a + b, 0) / scores.length;
        scoreCount++;
      }
    });

    stats.averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

    return stats;
  }
}

// Export singleton instance
export const animalService = new AnimalService();