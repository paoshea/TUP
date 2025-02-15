import type { Prisma } from '@prisma/client';

type PrismaEvaluation = Prisma.EvaluationGetPayload<{
  include: { animal: true; evaluator: true }
}>;
type PrismaAnimal = Prisma.AnimalGetPayload<{}>;
type PrismaProfile = Prisma.ProfileGetPayload<{}>;

export interface EvaluationScores {
  [key: string]: number;
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

// Input types
export type CreateEvaluationInput = {
  animalId: string;
  scores: EvaluationScores;
  notes?: string | null;
  metadata?: EvaluationMetadata | null;
};

export type UpdateEvaluationInput = Partial<CreateEvaluationInput>;

// Prisma include type
export const evaluationInclude = {
  animal: true,
  evaluator: true,
} as const;

// Raw database types
export type RawEvaluation = PrismaEvaluation;

// Type for evaluation with parsed JSON fields
export type EvaluationWithRelations = Omit<RawEvaluation, 'scores' | 'metadata'> & {
  scores: EvaluationScores;
  metadata?: EvaluationMetadata;
};

// Database input types
export type DbCreateInput = {
  scores: Record<string, unknown>;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  animal: { connect: { id: string } };
  evaluator: { connect: { id: string } };
};

export type DbUpdateInput = {
  scores?: Record<string, unknown>;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
};

// JSON helpers
export const serializeJson = <T>(data: T | null | undefined): Record<string, unknown> => {
  if (data === null || data === undefined) {
    return {};
  }
  return JSON.parse(JSON.stringify(data));
};

export const serializeNullableJson = <T>(
  data: T | null | undefined
): Record<string, unknown> | null => {
  if (data === null || data === undefined) {
    return null;
  }
  return JSON.parse(JSON.stringify(data));
};

export const parseJson = <T>(data: Record<string, unknown> | null): T | undefined => {
  if (data === null || data === undefined || Object.keys(data).length === 0) {
    return undefined;
  }
  try {
    return data as unknown as T;
  } catch {
    return undefined;
  }
};

// Type guards
export const isEvaluationScores = (obj: unknown): obj is EvaluationScores => {
  if (typeof obj !== 'object' || obj === null) return false;
  const scores = obj as Record<string, unknown>;
  return (
    typeof scores.movement === 'number' &&
    typeof scores.conformation === 'number' &&
    typeof scores.muscleDevelopment === 'number' &&
    typeof scores.breedCharacteristics === 'number'
  );
};

export const isEvaluationMetadata = (obj: unknown): obj is EvaluationMetadata => {
  if (typeof obj !== 'object' || obj === null) return false;
  const metadata = obj as Record<string, unknown>;
  return (
    (metadata.location === undefined || typeof metadata.location === 'string') &&
    (metadata.weather === undefined || typeof metadata.weather === 'string') &&
    (metadata.surfaceType === undefined || typeof metadata.surfaceType === 'string') &&
    (metadata.evaluatorNotes === undefined || typeof metadata.evaluatorNotes === 'string')
  );
};

// Evaluation criteria
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