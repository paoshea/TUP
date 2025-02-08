export interface Animal {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  images: string[];
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
}

export interface Show {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  categories: string[];
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
  dueDate?: string;
  assignedTo?: string;
}

export interface Statistics {
  totalAnimals: number;
  upcomingShows: number;
  completedEvaluations: number;
  activeUsers: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}