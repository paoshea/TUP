import { Prisma } from '@prisma/client';

// Basic types for JSON fields
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

// Input types
export type CreateShowInput = {
  name: string;
  date: Date;
  location: string;
  categories: ShowCategory[];
};

export type UpdateShowInput = Partial<CreateShowInput>;

// Stats types
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

// Profile type without sensitive fields
export type ProfilePublic = {
  id: string;
  email: string;
  fullName: string | null;
};

// Extended interfaces with relations
export type ShowWithOrganizer = Prisma.ShowGetPayload<{
  include: { organizer: true }
}>;

export type ShowWithEntries = Prisma.ShowGetPayload<{
  include: { organizer: true }
}>;

// Prisma include types
export const ShowIncludes = Prisma.validator<Prisma.ShowInclude>()({
  organizer: true
});

// Type for public profile data
export const formatProfilePublic = (profile: Prisma.ProfileGetPayload<{}>): ProfilePublic => ({
  id: profile.id,
  email: profile.email,
  fullName: profile.fullName
});