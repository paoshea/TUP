import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  email: string;
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String 
  },
}, {
  timestamps: true,
});

// Indexes
profileSchema.index({ email: 1 });

export const Profile = model<IProfile>('Profile', profileSchema);