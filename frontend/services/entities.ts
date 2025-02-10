import { BaseService } from './base';
import type { Animal, Show, Evaluation } from '@/lib/types/mock';
import { APIError } from './api';

export class AnimalService extends BaseService<Animal> {
  constructor() {
    super('/animals');
  }

  // Add animal-specific methods here
  async getByBreed(breed: string): Promise<Animal[]> {
    try {
      const animals = await this.getAll();
      return animals.filter(animal => animal.breed === breed);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWithEvaluations(id: string): Promise<Animal & { evaluations: Evaluation[] }> {
    try {
      const [animal, evaluations] = await Promise.all([
        this.getById(id),
        evaluationService.getByAnimalId(id),
      ]);
      return { ...animal, evaluations };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export class ShowService extends BaseService<Show> {
  constructor() {
    super('/shows');
  }

  // Add show-specific methods here
  async getUpcoming(): Promise<Show[]> {
    try {
      const shows = await this.getAll();
      return shows.filter(show => show.status === 'upcoming');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(showId: string, animalIds: string[]): Promise<void> {
    try {
      await this.update(showId, {
        entryCount: (await this.getById(showId)).entryCount + animalIds.length,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export class EvaluationService extends BaseService<Evaluation> {
  constructor() {
    super('/evaluations');
  }

  // Add evaluation-specific methods here
  async getByAnimalId(animalId: string): Promise<Evaluation[]> {
    try {
      const evaluations = await this.getAll();
      return evaluations.filter(evaluation => evaluation.animalId === animalId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLatest(animalId: string): Promise<Evaluation> {
    try {
      const evaluations = await this.getByAnimalId(animalId);
      const latest = evaluations.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      if (!latest) {
        throw new APIError(`No evaluations found for animal ${animalId}`, 404);
      }

      return latest;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateOverallScore(evaluation: Evaluation): Promise<number> {
    const { movement, conformation, muscleDevelopment, breedCharacteristics } = evaluation.scores;
    return (movement + conformation + muscleDevelopment + breedCharacteristics) / 4;
  }
}

// Export service instances
export const animalService = new AnimalService();
export const showService = new ShowService();
export const evaluationService = new EvaluationService();