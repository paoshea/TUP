export interface Animal {
  id: string;
  name: string;
  category: string;
  breed: string;
  region: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
}

export interface EvaluationCriteria {
  category: string;
  criteria: {
    name: string;
    description: string;
    maxScore: number;
  }[];
}

export interface Region {
  name: string;
  characteristics: string[];
  historicalData?: string;
}