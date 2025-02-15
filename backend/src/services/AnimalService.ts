import { PrismaService } from './PrismaService';
import { ApiError } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';

export interface CreateAnimalInput {
  name: string;
  category: string;
  breed: string;
  region: string;
  notes?: string;
  images?: string[];
  scores?: Record<string, number>;
}

export interface UpdateAnimalInput extends Partial<CreateAnimalInput> {}

export interface AnimalStats {
  byBreed: Record<string, number>;
  byCategory: Record<string, number>;
  byRegion: Record<string, number>;
}

export class AnimalService extends PrismaService {
  /**
   * Create a new animal
   */
  async createAnimal(
    data: CreateAnimalInput,
    ownerId: string
  ) {
    try {
      return await this.animal.create({
        data: {
          ...data,
          scores: data.scores ? JSON.stringify(data.scores) : '{}',
          images: data.images || [],
          owner: {
            connect: { id: ownerId }
          }
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get all animals for a user
   */
  async getUserAnimals(ownerId: string) {
    try {
      return await this.animal.findMany({
        where: { ownerId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get an animal by ID and verify access
   */
  async getAnimalById(
    animalId: string,
    userId: string,
    isAdmin: boolean = false
  ) {
    try {
      const animal = await this.animal.findUnique({
        where: { id: animalId }
      });

      if (!animal) {
        throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
      }

      // Check access - allow if user is admin or owner
      if (!isAdmin && animal.ownerId !== userId) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this animal');
      }

      return animal;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update an animal
   */
  async updateAnimal(
    animalId: string,
    userId: string,
    data: UpdateAnimalInput,
    isAdmin: boolean = false
  ) {
    try {
      // Verify animal exists and user has access
      await this.getAnimalById(animalId, userId, isAdmin);

      return await this.animal.update({
        where: { id: animalId },
        data: {
          ...data,
          scores: data.scores ? JSON.stringify(data.scores) : undefined
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete an animal
   */
  async deleteAnimal(animalId: string, userId: string, isAdmin: boolean = false) {
    try {
      // Verify animal exists and user has access
      await this.getAnimalById(animalId, userId, isAdmin);

      await this.animal.delete({
        where: { id: animalId }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Search animals by criteria
   */
  async searchAnimals(criteria: {
    breed?: string;
    category?: string;
    region?: string;
  }) {
    try {
      return await this.animal.findMany({
        where: {
          AND: [
            criteria.breed ? { breed: criteria.breed } : {},
            criteria.category ? { category: criteria.category } : {},
            criteria.region ? { region: criteria.region } : {}
          ]
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get animal statistics
   */
  async getAnimalStats(userId: string): Promise<AnimalStats> {
    try {
      const animals = await this.animal.findMany({
        where: { ownerId: userId },
        select: {
          breed: true,
          category: true,
          region: true
        }
      });

      const stats = animals.reduce((acc, animal) => {
        // Count by breed
        acc.byBreed[animal.breed] = (acc.byBreed[animal.breed] || 0) + 1;

        // Count by category
        acc.byCategory[animal.category] = (acc.byCategory[animal.category] || 0) + 1;

        // Count by region
        acc.byRegion[animal.region] = (acc.byRegion[animal.region] || 0) + 1;

        return acc;
      }, {
        byBreed: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        byRegion: {} as Record<string, number>
      });

      return stats;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Export singleton instance
export const animalService = new AnimalService();