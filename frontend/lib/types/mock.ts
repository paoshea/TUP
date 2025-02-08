export interface Animal {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  registrationNumber: string;
  images: string[];
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  showHistory: ShowEntry[];
  healthRecords: HealthRecord[];
  owner: Owner;
}

export interface ShowEntry {
  id: string;
  showName: string;
  date: Date;
  location: string;
  placement: number;
  totalParticipants: number;
  category: string;
  judge: string;
  notes: string;
}

export interface HealthRecord {
  id: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup';
  description: string;
  veterinarian: string;
  nextFollowUp?: Date;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  farm: string;
  region: string;
}

export interface Show {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location: string;
  categories: ShowCategory[];
  participants: ShowParticipant[];
  judges: Judge[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ShowCategory {
  id: string;
  name: string;
  breed: string;
  ageGroup: string;
  gender: 'male' | 'female' | 'any';
  participantCount: number;
}

export interface ShowParticipant {
  id: string;
  animalId: string;
  categoryId: string;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'withdrawn';
  placement?: number;
}

export interface Judge {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  certifications: string[];
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
  category: 'preparation' | 'documentation' | 'equipment' | 'health' | 'general';
  dueDate?: Date;
  assignedTo?: string;
}

export interface Evaluation {
  id: string;
  animalId: string;
  date: Date;
  evaluator: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
  recommendations: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'handler' | 'judge' | 'admin';
  organization: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export interface Statistics {
  totalAnimals: number;
  totalShows: number;
  upcomingShows: number;
  completedEvaluations: number;
  activeUsers: number;
  completedChecklists: number;
  averageScores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
}