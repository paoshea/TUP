import {
  generateAnimals,
  generateRegions,
  generateChecklists,
  generateStatistics,
  generateCurrentUser,
  generateShows,
} from './generators';
import type { Animal, Region, ChecklistItem, Statistics, User, Show } from '../types/mock';

class MockStore {
  private animals: Animal[];
  private regions: Region[];
  private checklists: ChecklistItem[];
  private statistics: Statistics;
  private currentUser: User;
  private shows: Show[];

  constructor() {
    // Initialize with mock data
    this.animals = generateAnimals();
    this.regions = generateRegions();
    this.checklists = generateChecklists();
    this.statistics = generateStatistics();
    this.currentUser = generateCurrentUser();
    this.shows = generateShows();
  }

  // Animal methods
  getAnimals(): Animal[] {
    return this.animals;
  }

  getAnimal(id: string): Animal | undefined {
    return this.animals.find(animal => animal.id === id);
  }

  updateAnimal(id: string, data: Partial<Animal>): void {
    this.animals = this.animals.map(animal =>
      animal.id === id ? { ...animal, ...data } : animal
    );
  }

  // Show methods
  getShows(): Show[] {
    return this.shows;
  }

  getShow(id: string): Show | undefined {
    return this.shows.find(show => show.id === id);
  }

  getUpcomingShows(): Show[] {
    return this.shows.filter(show => show.status === 'upcoming');
  }

  // Region methods
  getRegions(): Region[] {
    return this.regions;
  }

  getRegion(name: string): Region | undefined {
    return this.regions.find(region => region.name === name);
  }

  // Checklist methods
  getChecklists(): ChecklistItem[] {
    return this.checklists;
  }

  updateChecklist(id: string, data: Partial<ChecklistItem>): void {
    this.checklists = this.checklists.map(item =>
      item.id === id ? { ...item, ...data } : item
    );
  }

  addChecklistItem(item: Omit<ChecklistItem, 'id'>): void {
    const newItem = {
      id: `check-${this.checklists.length + 1}`,
      ...item,
    };
    this.checklists.push(newItem);
  }

  // Statistics methods
  getStatistics(): Statistics {
    return this.statistics;
  }

  // User methods
  getCurrentUser(): User {
    return this.currentUser;
  }

  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

// Export a singleton instance
export const mockStore = new MockStore();