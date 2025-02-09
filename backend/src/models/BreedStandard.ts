import { Schema, model, Document } from 'mongoose';

interface FrameCriteria {
  heightAtWithers: { maxScore: number; weightage: number };
  bodyLength: { maxScore: number; weightage: number };
  chestWidth: { maxScore: number; weightage: number };
  boneStructure: { maxScore: number; weightage: number };
}

interface BreedCharacterCriteria {
  headProfile: { maxScore: number; weightage: number };
  earSet: { maxScore: number; weightage: number };
  faceMarkings: { maxScore: number; weightage: number };
}

interface PhysicalCriteria {
  frame: FrameCriteria;
  breedCharacter: BreedCharacterCriteria;
}

interface CriteriaItem {
  maxScore: number;
  weightage: number;
}

export interface IBreedStandard extends Document {
  breed: string;
  category: string;
  criteria: {
    physical: PhysicalCriteria;
  };
  created_at: Date;
  updated_at: Date;
}

const breedStandardSchema = new Schema<IBreedStandard>({
  breed: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  criteria: {
    physical: {
      frame: {
        heightAtWithers: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
        bodyLength: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
        chestWidth: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
        boneStructure: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
      },
      breedCharacter: {
        headProfile: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
        earSet: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
        faceMarkings: {
          maxScore: { type: Number, required: true },
          weightage: { type: Number, required: true },
        },
      },
    },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
breedStandardSchema.index({ breed: 1, category: 1 }, { unique: true });

// Methods
breedStandardSchema.methods.calculateScore = function(
  this: IBreedStandard,
  measurements: Record<string, number>,
): Record<string, number> {
  const scores: Record<string, number> = {};
  
  // Calculate frame scores
  (Object.entries(this.criteria.physical.frame) as [string, CriteriaItem][]).forEach(
    ([key, criteria]) => {
      const measurement = measurements[key];
      if (typeof measurement === 'number') {
        const score = Math.min((measurement / criteria.maxScore) * 10, 10);
        scores[key] = score * criteria.weightage;
      }
    }
  );

  // Calculate breed character scores
  (Object.entries(this.criteria.physical.breedCharacter) as [string, CriteriaItem][]).forEach(
    ([key, criteria]) => {
      const measurement = measurements[key];
      if (typeof measurement === 'number') {
        const score = Math.min((measurement / criteria.maxScore) * 10, 10);
        scores[key] = score * criteria.weightage;
      }
    }
  );

  return scores;
};

export const BreedStandard = model<IBreedStandard>('BreedStandard', breedStandardSchema);