import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  email: string;
  password: string;
  fullName?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: { 
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
profileSchema.index({ email: 1 });
profileSchema.index({ isActive: 1 });

// Methods
profileSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const Profile = model<IProfile>('Profile', profileSchema);