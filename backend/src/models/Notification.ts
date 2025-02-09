import { Schema, model, Document, Types, Model } from 'mongoose';
import { IProfile } from './Profile';

type NotificationType = 'evaluation' | 'show' | 'sync' | 'system';
type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface INotification extends Document {
  user: Types.ObjectId | IProfile;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  status: NotificationStatus;
  created_at: Date;
  sent_at?: Date;
  // Instance methods
  markAsSent(): Promise<void>;
  markAsFailed(): Promise<void>;
}

// Static methods interface
interface INotificationModel extends Model<INotification> {
  createEvaluationNotification(
    userId: Types.ObjectId,
    evaluationId: Types.ObjectId,
    animalName: string
  ): Promise<INotification>;
  createShowNotification(
    userId: Types.ObjectId,
    showId: Types.ObjectId,
    showName: string,
    message: string
  ): Promise<INotification>;
  createSyncNotification(
    userId: Types.ObjectId,
    conflictId: Types.ObjectId
  ): Promise<INotification>;
  createSystemNotification(
    userId: Types.ObjectId,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<INotification>;
}

const notificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  type: {
    type: String,
    enum: ['evaluation', 'show', 'sync', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
    required: true,
  },
  sent_at: {
    type: Date,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ created_at: 1 });
notificationSchema.index({ sent_at: 1 });

// Methods
notificationSchema.methods.markAsSent = async function() {
  this.status = 'sent';
  this.sent_at = new Date();
  await this.save();
};

notificationSchema.methods.markAsFailed = async function() {
  this.status = 'failed';
  await this.save();
};

// Static methods
notificationSchema.statics.createEvaluationNotification = async function(
  userId: Types.ObjectId,
  evaluationId: Types.ObjectId,
  animalName: string
) {
  return this.create({
    user: userId,
    type: 'evaluation',
    title: 'New Evaluation',
    body: `A new evaluation has been added for ${animalName}`,
    data: { evaluationId },
  });
};

notificationSchema.statics.createShowNotification = async function(
  userId: Types.ObjectId,
  showId: Types.ObjectId,
  showName: string,
  message: string
) {
  return this.create({
    user: userId,
    type: 'show',
    title: showName,
    body: message,
    data: { showId },
  });
};

notificationSchema.statics.createSyncNotification = async function(
  userId: Types.ObjectId,
  conflictId: Types.ObjectId
) {
  return this.create({
    user: userId,
    type: 'sync',
    title: 'Sync Conflict',
    body: 'There was a conflict during synchronization that needs your attention',
    data: { conflictId },
  });
};

notificationSchema.statics.createSystemNotification = async function(
  userId: Types.ObjectId,
  title: string,
  message: string,
  data?: Record<string, any>
) {
  return this.create({
    user: userId,
    type: 'system',
    title,
    body: message,
    data,
  });
};

export const Notification = model<INotification, INotificationModel>('Notification', notificationSchema);