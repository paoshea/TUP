import {
  generateAnimals,
  generateRegions,
  generateChecklists,
  generateStatistics,
  generateCurrentUser,
  generateShows,
  generateEvaluations,
} from './generators';
import type { Animal, Region, ChecklistItem, Statistics, User, Show, Evaluation } from '../types/mock';

class MockStore {
  private animals: Animal[];
  private regions: Region[];
  private checklists: ChecklistItem[];
  private statistics: Statistics;
  private currentUser: User;
  private shows: Show[];
  private evaluations: Evaluation[];

  constructor() {
    // Initialize with mock data
    this.animals = generateAnimals();
    this.regions = generateRegions();
    this.checklists = generateChecklists();
    this.statistics = generateStatistics();
    this.currentUser = generateCurrentUser();
    this.shows = generateShows();
    this.evaluations = generateEvaluations(this.animals);
  }

  // Demo data loading methods
  async loadDemoAnimals(): Promise<void> {
    this.animals = generateAnimals().slice(0, 5); // Load subset for demo
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
  }

  async loadDemoEvaluations(): Promise<void> {
    this.evaluations = generateEvaluations(this.animals).slice(0, 3);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async loadDemoShows(): Promise<void> {
    this.shows = generateShows().slice(0, 2);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async loadDemoAnalytics(): Promise<void> {
    this.statistics = generateStatistics();
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async loadDemoData(): Promise<void> {
    await Promise.all([
      this.loadDemoAnimals(),
      this.loadDemoEvaluations(),
      this.loadDemoShows(),
      this.loadDemoAnalytics()
    ]);
  }

  // Animal methods
  getAnimals(): Animal[] {
    return this.animals;
  }

  getAnimal(id: string): Animal | undefined {
    return this.animals.find(animal => animal.id === id);
  }

  addAnimal(animal: Omit<Animal, 'id'>): Animal {
    const newAnimal = {
      id: `animal-${this.animals.length + 1}`,
      ...animal
    };
    this.animals.push(newAnimal);
    return newAnimal;
  }

  updateAnimal(id: string, data: Partial<Animal>): void {
    this.animals = this.animals.map(animal =>
      animal.id === id ? { ...animal, ...data } : animal
    );
  }

  deleteAnimal(id: string): void {
    this.animals = this.animals.filter(animal => animal.id !== id);
    this.evaluations = this.evaluations.filter(evaluation => evaluation.animalId !== id);
  }

  // Show methods
  getShows(): Show[] {
    return this.shows;
  }

  getShow(id: string): Show | undefined {
    return this.shows.find(show => show.id === id);
  }

  addShow(show: Omit<Show, 'id'>): Show {
    const newShow = {
      id: `show-${this.shows.length + 1}`,
      ...show
    };
    this.shows.push(newShow);
    return newShow;
  }

  updateShow(id: string, data: Partial<Show>): void {
    this.shows = this.shows.map(show =>
      show.id === id ? { ...show, ...data } : show
    );
  }

  deleteShow(id: string): void {
    this.shows = this.shows.filter(show => show.id !== id);
  }

  getUpcomingShows(): Show[] {
    return this.shows.filter(show => show.status === 'upcoming');
  }

  // Evaluation methods
  getEvaluations(): Evaluation[] {
    return this.evaluations;
  }

  getAnimalEvaluations(animalId: string): Evaluation[] {
    return this.evaluations.filter(evaluation => evaluation.animalId === animalId);
  }

  getEvaluation(id: string): Evaluation | undefined {
    return this.evaluations.find(evaluation => evaluation.id === id);
  }

  addEvaluation(evaluation: Omit<Evaluation, 'id'>): Evaluation {
    const newEvaluation = {
      id: `eval-${this.evaluations.length + 1}`,
      ...evaluation
    };
    this.evaluations.push(newEvaluation);
    return newEvaluation;
  }

  updateEvaluation(id: string, data: Partial<Evaluation>): void {
    this.evaluations = this.evaluations.map(evaluation =>
      evaluation.id === id ? { ...evaluation, ...data } : evaluation
    );
  }

  deleteEvaluation(id: string): void {
    this.evaluations = this.evaluations.filter(evaluation => evaluation.id !== id);
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

  addChecklistItem(item: Omit<ChecklistItem, 'id'>): ChecklistItem {
    const newItem = {
      id: `check-${this.checklists.length + 1}`,
      ...item,
    };
    this.checklists.push(newItem);
    return newItem;
  }

  deleteChecklistItem(id: string): void {
    this.checklists = this.checklists.filter(item => item.id !== id);
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