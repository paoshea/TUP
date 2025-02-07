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
  notes?: string;
  images?: string[];
}

export interface HistoricalFlock {
  id: string;
  name: string;
  breed: string;
  established: number;
  achievements: string[];
  notable_traits?: string;
  show_performance?: number;
  regions: string[];
  key_metrics: {
    movement?: number;
    conformationScore?: number;
    muscleDevelopment?: number;
    breedCharacteristics?: number;
    breedingSuccess?: number;
    woolQuality?: number;
  };
  created_at: Date;
}

export interface EvaluationCriteria {
  id: string;
  breed: string;
  category: string;
  criteria: {
    physical: {
      frame: {
        heightAtWithers: { maxScore: number; weightage: number };
        bodyLength: { maxScore: number; weightage: number };
        chestWidth: { maxScore: number; weightage: number };
        boneStructure: { maxScore: number; weightage: number };
      };
      breedCharacter: {
        headProfile: { maxScore: number; weightage: number };
        earSet: { maxScore: number; weightage: number };
        faceMarkings: { maxScore: number; weightage: number };
      };
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface Show {
  id: string;
  name: string;
  date: Date;
  location: string;
  categories: {
    name: string;
    classes: string[];
  }[];
  created_at: Date;
  updated_at: Date;
}

export interface ShowEntry {
  id: string;
  show_id: string;
  animal_id: string;
  category: string;
  entry_number?: number;
  owner_id: string;
  created_at: Date;
}

export interface ShowResult {
  id: string;
  show_id: string;
  entry_id: string;
  placement?: number;
  points?: number;
  notes?: string;
  created_at: Date;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  created_at: Date;
  updated_at: Date;
}