export interface Animal {
  id: string;
  name: string;
  category: string;
  breed: string;
  region: string;
  notes?: string;
  images?: string[];
  scores: Record<string, number>;
}

export interface Region {
  name: string;
  description: string;
  characteristics: string[];
  notableFlocks: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

export interface Statistics {
  totalAnimals: number;
  totalEvaluations: number;
  averageScores: Record<string, number>;
  regionalBreakdown: Record<string, number>;
  breedDistribution: Record<string, number>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Show {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  categories: string[];
  entries?: ShowEntry[];
}

export interface ShowEntry {
  id: string;
  showId: string;
  animalId: string;
  category: string;
  placement?: number;
  score?: number;
}

export interface EvaluationMetadata {
  location?: string;
  weather?: string;
  surfaceType?: string;
  evaluatorNotes?: string;
}

export interface Evaluation {
  id: string;
  animalId: string;
  evaluatorId: string;
  scores: Record<string, number>;
  notes?: string;
  metadata?: EvaluationMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DemoData {
  animals: Animal[];
  evaluations: Evaluation[];
  shows: Show[];
  statistics: Statistics;
}