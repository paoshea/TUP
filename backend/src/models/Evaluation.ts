import { Schema, model, Document, Types } from 'mongoose';
import { IAnimal } from './Animal';
import { IProfile } from './Profile';

interface EvaluationScores {
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

export interface IEvaluation extends Document {
  animal: Types.ObjectId | IAnimal;
  evaluator: Types.ObjectId | IProfile;
  scores: EvaluationScores;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>({
  animal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  evaluator: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  scores: {
    movement: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    conformation: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    muscleDevelopment: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    breedCharacteristics: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes
evaluationSchema.index({ animal: 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ createdAt: -1 });

// Virtual for average score
evaluationSchema.virtual('averageScore').get(function(this: IEvaluation) {
  const scores = Object.values(this.scores);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
});

// Helper function to calculate average scores
async function updateAnimalScores(animalId: Types.ObjectId): Promise<void> {
  const Animal = model('Animal');
  const Evaluation = model('Evaluation');

  // Get all evaluations for this animal
  const result = await Evaluation
    .find({ animal: animalId })
    .select('scores')
    .lean();

  // Type assertion for the query result
  const evaluations = result as unknown as Array<{ scores: EvaluationScores }>;

  if (evaluations.length === 0) return;

  // Calculate average scores
  const totalScores = evaluations.reduce((acc: Partial<EvaluationScores>, curr) => {
    (Object.entries(curr.scores) as Array<[keyof EvaluationScores, number]>).forEach(([key, value]) => {
      acc[key] = (acc[key] || 0) + value;
    });
    return acc;
  }, {});

  const averageScores = (Object.entries(totalScores) as Array<[keyof EvaluationScores, number]>).reduce((acc: EvaluationScores, [key, value]) => {
    acc[key] = value / evaluations.length;
    return acc;
  }, {
    movement: 0,
    conformation: 0,
    muscleDevelopment: 0,
    breedCharacteristics: 0,
  });

  // Update animal scores
  await Animal.findByIdAndUpdate(animalId, {
    scores: averageScores,
  });
}

// Middleware to update animal scores after evaluation
evaluationSchema.post('save', async function(doc: IEvaluation) {
  await updateAnimalScores(doc.animal instanceof Types.ObjectId ? doc.animal : doc.animal._id);
});

export const Evaluation = model<IEvaluation>('Evaluation', evaluationSchema);