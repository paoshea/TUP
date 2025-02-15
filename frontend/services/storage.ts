// Local Storage Keys
const STORAGE_KEYS = {
  USER: 'tup_user',
  ANIMALS: 'tup_animals',
  SHOWS: 'tup_shows',
  EVALUATIONS: 'tup_evaluations',
  ANALYTICS: 'tup_analytics',
} as const;

// Public interfaces
interface StoredData<T> {
  version: number;
  timestamp: number;
  data: T;
}

export interface Analytics {
  signupDate: string;
  lastActive: string;
  actions: Array<{ type: string; timestamp: string; details?: any }>;
  stats: {
    totalAnimals: number;
    upcomingShows: number;
    completedEvaluations: number;
    averageScores: any;
    showParticipation: any;
  };
  version?: number;
}

export interface AnalyticsAction {
  type: 'login' | 'logout' | 'signup' | 'evaluation' | 'show' | 'animal';
  timestamp: string;
  details?: {
    [key: string]: any;
  };
}

export interface StorageService {
  getUser(): any;
  setUser(user: any): void;
  setAnimals(animals: any[]): void;
  setShows(shows: any[]): void;
  setEvaluations(evaluations: any[]): void;
  getAnalytics(): Analytics;
  updateAnalytics(data: Partial<Analytics>): void;
  clearAll(): void;
}

class LocalStorageService {
  private getItem<T>(key: string): StoredData<T> | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  private setItem<T>(key: string, data: T) {
    try {
      const storedData: StoredData<T> = {
        version: 1, // Increment when data structure changes
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(key, JSON.stringify(storedData));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  // User Methods
  getUser() {
    const stored = this.getItem<any>(STORAGE_KEYS.USER);
    return stored?.data || null;
  }

  setUser(user: any) {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  // Animals Methods
  getAnimals() {
    const stored = this.getItem<any[]>(STORAGE_KEYS.ANIMALS);
    return stored?.data || [];
  }

  setAnimals(animals: any[]) {
    this.setItem(STORAGE_KEYS.ANIMALS, animals);
  }

  addAnimal(animal: any) {
    const animals = this.getAnimals();
    const newAnimal = {
      id: `animal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...animal,
    };
    animals.push(newAnimal);
    this.setAnimals(animals);
    return newAnimal;
  }

  updateAnimal(id: string, data: any) {
    const animals = this.getAnimals();
    const index = animals.findIndex(a => a.id === id);
    if (index !== -1) {
      animals[index] = {
        ...animals[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.setAnimals(animals);
      return animals[index];
    }
    return null;
  }

  deleteAnimal(id: string) {
    const animals = this.getAnimals();
    const filtered = animals.filter(a => a.id !== id);
    this.setAnimals(filtered);
  }

  // Shows Methods
  getShows() {
    const stored = this.getItem<any[]>(STORAGE_KEYS.SHOWS);
    return stored?.data || [];
  }

  setShows(shows: any[]) {
    this.setItem(STORAGE_KEYS.SHOWS, shows);
  }

  addShow(show: any) {
    const shows = this.getShows();
    const newShow = {
      id: `show-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...show,
    };
    shows.push(newShow);
    this.setShows(shows);
    return newShow;
  }

  updateShow(id: string, data: any) {
    const shows = this.getShows();
    const index = shows.findIndex(s => s.id === id);
    if (index !== -1) {
      shows[index] = {
        ...shows[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.setShows(shows);
      return shows[index];
    }
    return null;
  }

  deleteShow(id: string) {
    const shows = this.getShows();
    const filtered = shows.filter(s => s.id !== id);
    this.setShows(filtered);
  }

  // Evaluations Methods
  getEvaluations() {
    const stored = this.getItem<any[]>(STORAGE_KEYS.EVALUATIONS);
    return stored?.data || [];
  }

  setEvaluations(evaluations: any[]) {
    this.setItem(STORAGE_KEYS.EVALUATIONS, evaluations);
  }

  addEvaluation(evaluation: any) {
    const evaluations = this.getEvaluations();
    const newEvaluation = {
      id: `eval-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...evaluation,
    };
    evaluations.push(newEvaluation);
    this.setEvaluations(evaluations);
    return newEvaluation;
  }

  updateEvaluation(id: string, data: any) {
    const evaluations = this.getEvaluations();
    const index = evaluations.findIndex(evaluation => evaluation.id === id);
    if (index !== -1) {
      evaluations[index] = {
        ...evaluations[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.setEvaluations(evaluations);
      return evaluations[index];
    }
    return null;
  }

  deleteEvaluation(id: string) {
    const evaluations = this.getEvaluations();
    const filtered = evaluations.filter(evaluation => evaluation.id !== id);
    this.setEvaluations(filtered);
  }

  // Analytics Methods - Combined functionality
  public getAnalytics(): Analytics {
    const stored = this.getItem<Analytics>(STORAGE_KEYS.ANALYTICS);
    // Get current data
    const animals = this.getAnimals();
    const shows = this.getShows();
    const evaluations = this.getEvaluations();

    // Create or update analytics
    const currentStats = {
      stats: {
        totalAnimals: animals.length,
        upcomingShows: shows.filter(s => s.status === 'upcoming').length,
        completedEvaluations: evaluations.length,
        averageScores: this.calculateAverageScores(evaluations),
        showParticipation: {
          registered: shows.length,
          upcoming: shows.filter(s => s.status === 'upcoming').length,
          completed: shows.filter(s => s.status === 'completed').length,
        },
        evaluationTrends: this.calculateEvaluationTrends(evaluations),
      },
      lastActive: new Date().toISOString(),
    };

    const analytics = stored?.data || {
      signupDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      actions: [],
      stats: currentStats.stats,
      version: 1
    };

    return analytics;
  }

  public updateAnalytics(data: Partial<Analytics>) {
    const current = this.getAnalytics();
    this.setItem(STORAGE_KEYS.ANALYTICS, {
      ...current,
      ...data,
      lastActive: new Date().toISOString()
    });
  }

  private calculateAverageScores(evaluations: any[]) {
    if (evaluations.length === 0) return { movement: 0, conformation: 0, muscleDevelopment: 0, breedCharacteristics: 0 };

    const totals = evaluations.reduce((acc, evaluation) => ({
      movement: acc.movement + evaluation.scores.movement,
      conformation: acc.conformation + evaluation.scores.conformation,
      muscleDevelopment: acc.muscleDevelopment + evaluation.scores.muscleDevelopment,
      breedCharacteristics: acc.breedCharacteristics + evaluation.scores.breedCharacteristics,
    }), {
      movement: 0,
      conformation: 0,
      muscleDevelopment: 0,
      breedCharacteristics: 0,
    });

    return {
      movement: totals.movement / evaluations.length,
      conformation: totals.conformation / evaluations.length,
      muscleDevelopment: totals.muscleDevelopment / evaluations.length,
      breedCharacteristics: totals.breedCharacteristics / evaluations.length,
    };
  }

  private calculateEvaluationTrends(evaluations: any[]) {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return {
      lastMonth: evaluations.filter(e => new Date(e.createdAt) >= monthAgo).length,
      lastQuarter: evaluations.filter(e => new Date(e.createdAt) >= quarterAgo).length,
      lastYear: evaluations.filter(e => new Date(e.createdAt) >= yearAgo).length,
    };
  }

  // Clear all data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage: StorageService = new LocalStorageService();