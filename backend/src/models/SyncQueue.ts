import { Schema, model, Document, Types } from 'mongoose';
import { IProfile } from './Profile';

type Operation = 'insert' | 'update' | 'delete';
type Status = 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';

export interface ISyncQueue extends Document {
  user: Types.ObjectId | IProfile;
  table_name: string;
  record_id: Types.ObjectId;
  operation: Operation;
  data?: Record<string, any>;
  status: Status;
  version: number;
  created_at: Date;
  processed_at?: Date;
}

const syncQueueSchema = new Schema<ISyncQueue>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  table_name: {
    type: String,
    required: true,
  },
  record_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  operation: {
    type: String,
    enum: ['insert', 'update', 'delete'],
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'conflict'],
    default: 'pending',
    required: true,
  },
  version: {
    type: Number,
    default: 1,
    required: true,
  },
  processed_at: {
    type: Date,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
syncQueueSchema.index({ user: 1, status: 1 });
syncQueueSchema.index({ table_name: 1, record_id: 1 });
syncQueueSchema.index({ status: 1, created_at: 1 });

// Methods
syncQueueSchema.methods.markAsProcessing = async function() {
  this.status = 'processing';
  await this.save();
};

syncQueueSchema.methods.markAsCompleted = async function() {
  this.status = 'completed';
  this.processed_at = new Date();
  await this.save();
};

syncQueueSchema.methods.markAsFailed = async function(error?: Error) {
  this.status = 'failed';
  if (error) {
    this.data = { ...this.data, error: error.message };
  }
  await this.save();
};

syncQueueSchema.methods.markAsConflict = async function() {
  this.status = 'conflict';
  await this.save();
};

export const SyncQueue = model<ISyncQueue>('SyncQueue', syncQueueSchema);