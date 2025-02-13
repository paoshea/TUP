export interface Animal {
  id: string;
  name: string;
  breed: string;
  age?: number;
  status: string;
  registrationNumber?: string;
  birthDate?: string;
  images: string[];
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes?: string;
  lastEvaluation?: string;
  category?: string;
  region?: string;
}

export interface Evaluation {
  id: string;
  animalId: string;
  animalName: string;
  date: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes?: string;
  images: string[];
  evaluator: string;
  overallScore: number;
}

export interface Show {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
  entryCount: number;
  categories: string[];
  description: string;
  entryFee: number;
  maxEntries: number;
  registrationDeadline: string;
  judgingCriteria: string[];
}

export interface Region {
  name: string;
  areas: string[];
  characteristics: string[];
  historicalData: string;
  showStats: {
    participationRate: number;
    averageScore: number;
    topBreeds: string[];
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate: string;
  assignedTo: string;
}

export interface Statistics {
  totalAnimals: number;
  upcomingShows: number;
  completedEvaluations: number;
  activeUsers: number;
  averageScores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  showParticipation: {
    registered: number;
    upcoming: number;
    completed: number;
  };
  evaluationTrends: {
    lastMonth: number;
    lastQuarter: number;
    lastYear: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  farm: string;
  location: string;
  memberSince: string;
}