import { Prisma } from '@prisma/client';
import { ProfilePublic } from './prisma';

// Make ShowCategory compatible with Prisma.JsonValue
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

// Raw database types
export type RawShow = Prisma.ShowGetPayload<{
  include: { organizer: true };
}>;

export type RawShowEntry = Prisma.ShowEntryGetPayload<{
  include: {
    animal: true;
    showResults: true;
  };
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

// JSON helpers
export const serializeCategories = (categories: ShowCategory[]): Prisma.InputJsonValue => {
  // Convert to plain objects that satisfy Prisma.JsonValue
  const jsonCategories = categories.map(({ name, classes, ...rest }) => ({
    name,
    classes,
    ...rest
  }));
  return JSON.stringify(jsonCategories);
};

export const parseCategories = (categoriesJson: string | Prisma.JsonValue): ShowCategory[] => {
  const parsed = typeof categoriesJson === 'string' 
    ? JSON.parse(categoriesJson) 
    : JSON.parse(JSON.stringify(categoriesJson));
  
  return parsed.map((cat: any) => ({
    name: cat.name,
    classes: cat.classes,
    ...cat
  }));
};