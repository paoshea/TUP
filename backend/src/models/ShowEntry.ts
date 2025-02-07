import { Schema, model, Document, Types } from 'mongoose';
import { IShow } from './Show';
import { IAnimal } from './Animal';
import { IProfile } from './Profile';

export interface IShowEntry extends Document {
  show: Types.ObjectId | IShow;
  animal: Types.ObjectId | IAnimal;
  category: string;
  entry_number: number;
  owner: Types.ObjectId | IProfile;
  created_at: Date;
}

const showEntrySchema = new Schema<IShowEntry>({
  show: {
    type: Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  animal: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  entry_number: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
showEntrySchema.index({ show: 1, entry_number: 1 }, { unique: true });
showEntrySchema.index({ show: 1, category: 1 });
showEntrySchema.index({ animal: 1 });
showEntrySchema.index({ owner: 1 });

// Middleware to validate category exists in show
showEntrySchema.pre('save', async function(next) {
  try {
    const Show = model<IShow>('Show');
    const show = await Show.findById(this.show);
    
    if (!show) {
      throw new Error('Show not found');
    }

    const categoryExists = show.categories.some((category) => category.name === this.category);
    if (!categoryExists) {
      throw new Error('Invalid category for this show');
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Validation failed'));
  }
});

// Methods
showEntrySchema.methods.getResults = async function() {
  const ShowResult = model('ShowResult');
  return ShowResult.find({ entry: this._id }).sort({ created_at: -1 });
};

export const ShowEntry = model<IShowEntry>('ShowEntry', showEntrySchema);