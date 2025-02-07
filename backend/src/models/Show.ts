import { Schema, model, Document, Types } from 'mongoose';
import { IProfile } from './Profile';

interface ShowCategory {
  name: string;
  classes: string[];
}

export interface IShow extends Document {
  name: string;
  date: Date;
  location: string;
  categories: ShowCategory[];
  organizer: Types.ObjectId | IProfile;
  created_at: Date;
  updated_at: Date;
}

const showSchema = new Schema<IShow>({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  categories: [{
    name: {
      type: String,
      required: true,
    },
    classes: [{
      type: String,
      required: true,
    }],
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
showSchema.index({ date: 1 });
showSchema.index({ location: 1 });
showSchema.index({ organizer: 1 });
showSchema.index({ 'categories.name': 1 });

// Methods
showSchema.methods.hasClass = function(categoryName: string, className: string): boolean {
  const category = this.categories.find((c: ShowCategory) => c.name === categoryName);
  return category ? category.classes.includes(className) : false;
};

showSchema.methods.addCategory = function(category: ShowCategory): void {
  if (!this.categories.some((c: ShowCategory) => c.name === category.name)) {
    this.categories.push(category);
  }
};

showSchema.methods.removeClass = function(categoryName: string, className: string): void {
  const category = this.categories.find((c: ShowCategory) => c.name === categoryName);
  if (category) {
    category.classes = category.classes.filter((c: string) => c !== className);
    if (category.classes.length === 0) {
      this.categories = this.categories.filter((c: ShowCategory) => c.name !== categoryName);
    }
  }
};

export const Show = model<IShow>('Show', showSchema);