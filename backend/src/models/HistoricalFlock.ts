import { Schema, model, Document } from 'mongoose';

interface KeyMetrics {
  movement?: number;
  conformationScore?: number;
  muscleDevelopment?: number;
  breedCharacteristics?: number;
  breedingSuccess?: number;
  woolQuality?: number;
}

export interface IHistoricalFlock extends Document {
  name: string;
  breed: string;
  established: number;
  achievements: string[];
  notable_traits?: string;
  show_performance?: number;
  regions: string[];
  key_metrics: KeyMetrics;
  created_at: Date;
}

const historicalFlockSchema = new Schema<IHistoricalFlock>({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  established: {
    type: Number,
    required: true,
  },
  achievements: [{
    type: String,
  }],
  notable_traits: {
    type: String,
  },
  show_performance: {
    type: Number,
    min: 0,
    max: 100,
  },
  regions: [{
    type: String,
    required: true,
  }],
  key_metrics: {
    movement: {
      type: Number,
      min: 0,
      max: 10,
    },
    conformationScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    muscleDevelopment: {
      type: Number,
      min: 0,
      max: 10,
    },
    breedCharacteristics: {
      type: Number,
      min: 0,
      max: 10,
    },
    breedingSuccess: {
      type: Number,
      min: 0,
      max: 100,
    },
    woolQuality: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
historicalFlockSchema.index({ breed: 1 });
historicalFlockSchema.index({ regions: 1 });
historicalFlockSchema.index({ established: 1 });
historicalFlockSchema.index({ show_performance: -1 });

// Virtual for average score
historicalFlockSchema.virtual('averageScore').get(function(this: IHistoricalFlock) {
  const scores = [
    this.key_metrics.movement,
    this.key_metrics.conformationScore,
    this.key_metrics.muscleDevelopment,
    this.key_metrics.breedCharacteristics,
  ].filter((score): score is number => typeof score === 'number');

  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
});

export const HistoricalFlock = model<IHistoricalFlock>('HistoricalFlock', historicalFlockSchema);