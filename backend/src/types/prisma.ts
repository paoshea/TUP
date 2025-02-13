// Basic type definitions for database entities

export type Scores = {
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
};

export type ShowCategory = {
  name: string;
  classes: string[];
};

// Base types without relations or metadata
export interface BaseProfile {
  email: string;
  password: string;
  fullName?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
}

export interface BaseAnimal {
  name: string;
  category: string;
  breed: string;
  region: string;
  notes?: string | null;
  images: string[];
  scores: Scores;
}

export interface BaseShow {
  name: string;
  date: Date;
  location: string;
  categories: ShowCategory[];
}

export interface BaseEvaluation {
  scores: Scores;
  notes?: string | null;
}

// Full types including relations and metadata
export interface Profile extends BaseProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  animals?: Animal[];
  evaluations?: Evaluation[];
  shows?: Show[];
}

export interface Animal extends BaseAnimal {
  id: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: Profile;
  evaluations?: Evaluation[];
}

export interface Show extends BaseShow {
  id: string;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
  organizer?: Profile;
}

export interface Evaluation extends BaseEvaluation {
  id: string;
  animalId: string;
  evaluatorId: string;
  createdAt: Date;
  updatedAt: Date;
  animal?: Animal;
  evaluator?: Profile;
}

// Input types for creating records
export type CreateProfileInput = BaseProfile;
export type CreateAnimalInput = BaseAnimal;
export type CreateShowInput = BaseShow;
export type CreateEvaluationInput = BaseEvaluation;

// Input types for updating records
export type UpdateProfileInput = Partial<BaseProfile>;
export type UpdateAnimalInput = Partial<BaseAnimal>;
export type UpdateShowInput = Partial<BaseShow>;
export type UpdateEvaluationInput = Partial<BaseEvaluation>;

// Where input types for filtering
export type WhereInput = {
  equals?: any;
  not?: any;
  in?: any[];
  notIn?: any[];
  lt?: any;
  lte?: any;
  gt?: any;
  gte?: any;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

export type ProfileWhereInput = {
  [K in keyof BaseProfile]?: WhereInput;
} & {
  id?: WhereInput;
  createdAt?: WhereInput;
  updatedAt?: WhereInput;
};

export type AnimalWhereInput = {
  [K in keyof BaseAnimal]?: WhereInput;
} & {
  id?: WhereInput;
  ownerId?: WhereInput;
  createdAt?: WhereInput;
  updatedAt?: WhereInput;
};

export type ShowWhereInput = {
  [K in keyof BaseShow]?: WhereInput;
} & {
  id?: WhereInput;
  organizerId?: WhereInput;
  createdAt?: WhereInput;
  updatedAt?: WhereInput;
};

export type EvaluationWhereInput = {
  [K in keyof BaseEvaluation]?: WhereInput;
} & {
  id?: WhereInput;
  animalId?: WhereInput;
  evaluatorId?: WhereInput;
  createdAt?: WhereInput;
  updatedAt?: WhereInput;
};