import { Prisma } from '@prisma/client';

// Basic types for JSON fields
export interface EvaluationScores extends Record<string, number> {
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

export interface EvaluationCriteria {
  category: string;
  maxScore: number;
  description: string;
  guidelines: string[];
}

export interface EvaluationMetadata {
  location?: string;
  weather?: string;
  surfaceType?: string;
  evaluatorNotes?: string;
}

// Input types that match Prisma schema
export type CreateEvaluationInput = {
  animalId: string;
  scores: EvaluationScores;
  notes?: string | null;
  metadata?: EvaluationMetadata | null;
};

export type UpdateEvaluationInput = Partial<CreateEvaluationInput>;

// Prisma include type for evaluations
export const evaluationInclude = {
  animal: true,
  evaluator: true,
} as const;

// Base type for raw database evaluation
type BaseEvaluation = {
  id: string;
  scores: Prisma.JsonValue;
  notes: string | null;
  metadata?: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  animalId: string;
  evaluatorId: string;
};

// Type for raw database evaluation with relations
export type RawEvaluation = BaseEvaluation & {
  animal: {
    id: string;
    name: string;
    category: string;
    breed: string;
    region: string;
    notes: string | null;
    images: string[];
    scores: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
  };
  evaluator: {
    id: string;
    email: string;
    fullName: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

// Type for evaluation with parsed JSON fields
export type EvaluationWithRelations = Omit<RawEvaluation, 'scores' | 'metadata'> & {
  scores: EvaluationScores;
  metadata?: EvaluationMetadata;
};

// Prisma input types with JSON handling
export type DbCreateInput = {
  scores: Prisma.InputJsonValue;
  notes?: string | null;
  metadata?: Prisma.InputJsonValue | null;
  animal: { connect: { id: string } };
  evaluator: { connect: { id: string } };
};

export type DbUpdateInput = {
  scores?: Prisma.InputJsonValue;
  notes?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

// Evaluation criteria for different categories
export const EVALUATION_CRITERIA: Record<string, EvaluationCriteria> = {
  movement: {
    category: 'Movement',
    maxScore: 10,
    description: 'Assessment of animal\'s gait, stride, and overall mobility',
    guidelines: [
      'Observe natural walking gait',
      'Check for any limping or irregularities',
      'Assess stride length and smoothness',
      'Evaluate balance and coordination'
    ]
  },
  conformation: {
    category: 'Conformation',
    maxScore: 10,
    description: 'Evaluation of body structure and proportions',
    guidelines: [
      'Check body proportions and symmetry',
      'Assess skeletal structure',
      'Evaluate muscle definition',
      'Check for any structural defects'
    ]
  },
  muscleDevelopment: {
    category: 'Muscle Development',
    maxScore: 10,
    description: 'Assessment of muscle mass and distribution',
    guidelines: [
      'Evaluate muscle mass in key areas',
      'Check muscle tone and firmness',
      'Assess muscle distribution',
      'Look for balanced development'
    ]
  },
  breedCharacteristics: {
    category: 'Breed Characteristics',
    maxScore: 10,
    description: 'Evaluation of breed-specific traits and features',
    guidelines: [
      'Check breed-specific markings',
      'Assess coat quality and color',
      'Evaluate head characteristics',
      'Check for breed standard conformity'
    ]
  }
};