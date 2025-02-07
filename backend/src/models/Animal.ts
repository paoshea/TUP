import { Schema, model, Document, Types } from 'mongoose';
import { IProfile } from './Profile';

interface Scores {
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

export interface IAnimal extends Document {
  name: string;
  category: string;
  breed: string;
  region: string;
  owner: Types.ObjectId | IProfile;
  scores: Scores;
  notes?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const animalSchema = new Schema<IAnimal>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  scores: {
    movement: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    conformation: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    muscleDevelopment: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    breedCharacteristics: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  notes: {
    type: String,
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Indexes
animalSchema.index({ owner: 1 });
animalSchema.index({ breed: 1 });
animalSchema.index({ region: 1 });
animalSchema.index({ category: 1 });

// Virtual for average score
animalSchema.virtual('averageScore').get(function(this: IAnimal) {
  const scores = Object.values(this.scores);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
});

// Methods
animalSchema.methods.isOwnedBy = function(userId: Types.ObjectId): boolean {
  return this.owner.toString() === userId.toString();
};

export const Animal = model<IAnimal>('Animal', animalSchema);