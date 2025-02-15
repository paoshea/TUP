import type { Prisma } from '@prisma/client';
import { ProfilePublic } from './prisma';

// Make ShowCategory compatible with Record<string, unknown>
export type ShowCategory = {
  [key: string]: string | string[];
} & {
  name: string;
  classes: string[];
};

export interface ShowResult {
  placement: number;
  points: number;
}

export interface ShowEntry {
  id: string;
  entryNumber: number;
  category: string;
  animal: {
    id: string;
    name: string;
  };
  results: ShowResult[];
}

// Prisma include types
export const showIncludes = {
  organizer: true
} as const;

export const showEntryIncludes = {
  animal: true,
  showResults: true
} as const;

// Type utilities
export type ShowInclude = typeof showIncludes;
export type ShowEntryInclude = typeof showEntryIncludes;

// Raw database types with includes
export type RawShow = Prisma.ShowGetPayload<{
  include: ShowInclude;
}>;

export type RawShowEntry = Prisma.ShowEntryGetPayload<{
  include: ShowEntryInclude;
}>;

// Extended types with parsed JSON
export interface ShowWithOrganizer extends Omit<RawShow, 'categories' | 'organizer'> {
  categories: ShowCategory[];
  organizer: ProfilePublic;
}

export interface ShowStats {
  totalEntries: number;
  entriesByCategory: Record<string, number>;
  results: Array<{
    category: string;
    entries: number;
    topPlacements: Array<{
      entry_number: number;
      animal_name: string;
      placement: number;
      points: number;
    }>;
  }>;
}

export type CreateShowInput = {
  name: string;
  date: Date;
  location: string;
  categories: ShowCategory[];
};

export type UpdateShowInput = Partial<CreateShowInput>;

export type CreateShowEntryInput = {
  animalId: string;
  category: string;
};

// Database query result types
export type ShowQueryResult = {
  categories: string;
  entries: Array<{
    id: string;
    entryNumber: number;
    category: string;
    animal: {
      id: string;
      name: string;
    };
    results: ShowResult[];
  }>;
};

// JSON helpers
export const serializeCategories = (categories: ShowCategory[]): Record<string, unknown> => {
  // Convert to plain objects
  const jsonCategories = categories.map(({ name, classes, ...rest }) => ({
    name,
    classes,
    ...rest
  }));
  return JSON.parse(JSON.stringify(jsonCategories));
};

export const parseCategories = (categoriesJson: string | Record<string, unknown>): ShowCategory[] => {
  const parsed = typeof categoriesJson === 'string' 
    ? JSON.parse(categoriesJson) 
    : JSON.parse(JSON.stringify(categoriesJson));
  
  return parsed.map((cat: any) => ({
    name: cat.name,
    classes: cat.classes,
    ...cat
  }));
};