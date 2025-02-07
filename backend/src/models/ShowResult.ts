import { Schema, model, Document, Types } from 'mongoose';
import { IShowEntry } from './ShowEntry';

export interface IShowResult extends Document {
  entry: Types.ObjectId | IShowEntry;
  placement?: number;
  points?: number;
  notes?: string;
  created_at: Date;
}

const showResultSchema = new Schema<IShowResult>({
  entry: {
    type: Schema.Types.ObjectId,
    ref: 'ShowEntry',
    required: true,
  },
  placement: {
    type: Number,
    min: 1,
  },
  points: {
    type: Number,
    min: 0,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
showResultSchema.index({ entry: 1 });
showResultSchema.index({ placement: 1 });
showResultSchema.index({ points: -1 });

// Middleware to ensure only one result per entry
showResultSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingResult = await model('ShowResult').findOne({ entry: this.entry });
    if (existingResult) {
      next(new Error('Entry already has a result'));
      return;
    }
  }
  next();
});

// Methods
showResultSchema.methods.getEntry = async function() {
  return model('ShowEntry').findById(this.entry).populate(['animal', 'owner']);
};

export const ShowResult = model<IShowResult>('ShowResult', showResultSchema);