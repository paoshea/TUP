import {
  generateAnimal,
  generateShow,
  generateRegion,
  generateChecklistItem,
  generateEvaluation,
  generateUser,
} from './generators';
import type {
  Animal,
  Show,
  Region,
  ChecklistItem,
  Evaluation,
  User,
} from '../types/mock';

class MockStore {
  private animals: Animal[] = [];
  private shows: Show[] = [];
  private regions: Region[] = [];
  private checklists: ChecklistItem[] = [];
  private evaluations: Evaluation[] = [];
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Generate animals
    this.animals = Array.from({ length: 20 }, generateAnimal);

    // Generate shows
    this.shows = Array.from({ length: 5 }, generateShow);

    // Generate regions
    this.regions = Array.from({ length: 4 }, generateRegion);

    // Generate checklist items
    this.checklists = Array.from({ length: 10 }, generateChecklistItem);

    // Generate evaluations
    this.evaluations = Array.from({ length: 15 }, generateEvaluation);

    // Generate users
    this.users = Array.from({ length: 10 }, generateUser);

    // Set current user
    this.currentUser = generateUser();
  }

  // Animal methods
  getAnimals(): Animal[] {
    return this.animals;
  }

  getAnimalById(id: string): Animal | undefined {
    return this.animals.find(animal => animal.id === id);
  }

  getAnimalsByOwner(ownerId: string): Animal[] {
    return this.animals.filter(animal => animal.owner.id === ownerId);
  }

  // Show methods
  getShows(): Show[] {
    return this.shows;
  }

  getShowById(id: string): Show | undefined {
    return this.shows.find(show => show.id === id);
  }

  getUpcomingShows(): Show[] {
    return this.shows.filter(show => show.status === 'upcoming');
  }

  // Region methods
  getRegions(): Region[] {
    return this.regions;
  }

  getRegionByName(name: string): Region | undefined {
    return this.regions.find(region => region.name === name);
  }

  // Checklist methods
  getChecklists(): ChecklistItem[] {
    return this.checklists;
  }

  getChecklistsByCategory(category: string): ChecklistItem[] {
    return this.checklists.filter(item => item.category === category);
  }

  updateChecklistItem(id: string, completed: boolean): void {
    const item = this.checklists.find(item => item.id === id);
    if (item) {
      item.completed = completed;
    }
  }

  // Evaluation methods
  getEvaluations(): Evaluation[] {
    return this.evaluations;
  }

  getEvaluationsByAnimal(animalId: string): Evaluation[] {
    return this.evaluations.filter(evaluation => evaluation.animalId === animalId);
  }

  addEvaluation(evaluation: Evaluation): void {
    this.evaluations.push(evaluation);
  }

  // User methods
  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Statistics methods
  getStatistics() {
    return {
      totalAnimals: this.animals.length,
      totalShows: this.shows.length,
      upcomingShows: this.shows.filter(show => show.status === 'upcoming').length,
      completedEvaluations: this.evaluations.length,
      activeUsers: this.users.length,
      completedChecklists: this.checklists.filter(item => item.completed).length,
      averageScores: this.calculateAverageScores(),
    };
  }

  private calculateAverageScores() {
    const scores = this.evaluations.reduce(
      (acc, evaluation) => {
        acc.movement += evaluation.scores.movement;
        acc.conformation += evaluation.scores.conformation;
        acc.muscleDevelopment += evaluation.scores.muscleDevelopment;
        acc.breedCharacteristics += evaluation.scores.breedCharacteristics;
        return acc;
      },
      {
        movement: 0,
        conformation: 0,
        muscleDevelopment: 0,
        breedCharacteristics: 0,
      }
    );

    const count = this.evaluations.length;
    return {
      movement: count ? +(scores.movement / count).toFixed(1) : 0,
      conformation: count ? +(scores.conformation / count).toFixed(1) : 0,
      muscleDevelopment: count ? +(scores.muscleDevelopment / count).toFixed(1) : 0,
      breedCharacteristics: count ? +(scores.breedCharacteristics / count).toFixed(1) : 0,
    };
  }

  // Refresh data
  refreshData() {
    this.initializeData();
  }
}

// Create a singleton instance
export const mockStore = new MockStore();

// Export type for use in components
export type MockStoreType = typeof mockStore;