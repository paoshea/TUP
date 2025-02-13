import { PrismaService } from './PrismaService';
import { ApiError } from '../utils/apiResponse';
import { PrismaClient } from '@prisma/client';
import { Scores } from '../types/prisma';

interface BaseAnimal {
  name: string;
  category: string;
  breed: string;
  region: string;
  notes?: string | null;
  images: string[];
  scores: Scores;
}

interface AnimalWithOwner extends BaseAnimal {
  id: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

type CreateAnimalData = BaseAnimal;

export class AnimalService extends PrismaService {
  /**
   * Create a new animal
   */
  async createAnimal(
    data: CreateAnimalData,
    userId: string
  ): Promise<AnimalWithOwner> {
    try {
      return await this.prisma.animal.create({
        data: {
          ...data,
          owner: {
            connect: { id: userId }
          },
          scores: data.scores || {
            movement: 0,
            conformation: 0,
            muscleDevelopment: 0,
            breedCharacteristics: 0
          }
        },
        include: { owner: true }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get animals owned by a user
   */
  async getUserAnimals(
    userId: string,
    query: Partial<CreateAnimalData> = {}
  ): Promise<AnimalWithOwner[]> {
    try {
      return await this.prisma.animal.findMany({
        where: {
          ownerId: userId,
          ...this.buildWhereClause(query)
        },
        include: { owner: true }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get an animal by ID and verify ownership
   */
  async getAnimalById(animalId: string, userId: string): Promise<AnimalWithOwner> {
    try {
      const animal = await this.prisma.animal.findUnique({
        where: { id: animalId },
        include: { owner: true }
      });

      if (!animal) {
        throw new ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
      }

      if (animal.ownerId !== userId) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this animal');
      }

      return animal as AnimalWithOwner;
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
    data: Partial<CreateAnimalData>
  ): Promise<AnimalWithOwner> {
    await this.getAnimalById(animalId, userId);

    try {
      return await this.prisma.animal.update({
        where: { id: animalId },
        data,
        include: { owner: true }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete an animal
   */
  async deleteAnimal(animalId: string, userId: string): Promise<void> {
    await this.getAnimalById(animalId, userId);

    try {
      await this.prisma.animal.delete({
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
    minScore?: number;
    maxScore?: number;
    owner?: string;
  }): Promise<AnimalWithOwner[]> {
    try {
      const where = this.buildWhereClause(criteria);

      return await this.prisma.animal.findMany({
        where,
        include: { owner: true }
      });
    } catch (error) {
      this.handleError(error);
    }
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
    try {
      const animals = await this.prisma.animal.findMany({
        where: { ownerId: userId },
        include: { owner: true }
      });

      const stats = {
        total: animals.length,
        byBreed: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        averageScore: 0,
      };

      let totalScore = 0;
      let scoreCount = 0;

      animals.forEach((animal: AnimalWithOwner) => {
        // Count by breed
        stats.byBreed[animal.breed] = (stats.byBreed[animal.breed] || 0) + 1;

        // Count by category
        stats.byCategory[animal.category] = (stats.byCategory[animal.category] || 0) + 1;

        // Calculate average score
        const scores = animal.scores as Scores;
        if (scores) {
          const scoreValues = Object.values(scores);
          totalScore += scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
          scoreCount++;
        }
      });

      stats.averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

      return stats;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Build where clause for Prisma queries
   */
  private buildWhereClause(criteria: Record<string, any>) {
    const where: Record<string, any> = {};

    if (criteria.breed) {
      where.breed = criteria.breed;
    }

    if (criteria.category) {
      where.category = criteria.category;
    }

    if (criteria.region) {
      where.region = criteria.region;
    }

    if (criteria.owner) {
      where.ownerId = criteria.owner;
    }

    return where;
  }
}

// Export singleton instance
export const animalService = new AnimalService();