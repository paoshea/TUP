import { Schema, model, Document, Types } from 'mongoose';
import { IProfile } from './Profile';

type Platform = 'ios' | 'android' | 'web';

export interface IPushToken extends Document {
  user: Types.ObjectId | IProfile;
  token: string;
  platform: Platform;
  created_at: Date;
  last_used: Date;
}

const pushTokenSchema = new Schema<IPushToken>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: true,
  },
  last_used: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
pushTokenSchema.index({ user: 1 });
pushTokenSchema.index({ token: 1 }, { unique: true });
pushTokenSchema.index({ platform: 1 });
pushTokenSchema.index({ last_used: 1 });

// Methods
pushTokenSchema.methods.updateLastUsed = async function() {
  this.last_used = new Date();
  await this.save();
};

pushTokenSchema.methods.isExpired = function(expirationDays = 30): boolean {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - expirationDays);
  return this.last_used < expirationDate;
};

// Static methods
pushTokenSchema.statics.cleanupExpiredTokens = async function(expirationDays = 30) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - expirationDays);
  
  return this.deleteMany({
    last_used: { $lt: expirationDate },
  });
};

pushTokenSchema.statics.findValidTokensForUser = async function(userId: Types.ObjectId) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 30);
  
  return this.find({
    user: userId,
    last_used: { $gte: expirationDate },
  }).sort({ last_used: -1 });
};

export const PushToken = model<IPushToken>('PushToken', pushTokenSchema);