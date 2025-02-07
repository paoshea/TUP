import { Schema, model, Document, Types } from 'mongoose';
import { ISyncQueue } from './SyncQueue';

type Resolution = 'client_wins' | 'server_wins' | 'manual';

export interface ISyncConflict extends Document {
  queue_item: Types.ObjectId | ISyncQueue;
  table_name: string;
  record_id: Types.ObjectId;
  client_data: Record<string, any>;
  server_data: Record<string, any>;
  resolution?: Resolution;
  created_at: Date;
  resolved_at?: Date;
}

const syncConflictSchema = new Schema<ISyncConflict>({
  queue_item: {
    type: Schema.Types.ObjectId,
    ref: 'SyncQueue',
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
  client_data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  server_data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  resolution: {
    type: String,
    enum: ['client_wins', 'server_wins', 'manual'],
  },
  resolved_at: {
    type: Date,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
});

// Indexes
syncConflictSchema.index({ queue_item: 1 });
syncConflictSchema.index({ table_name: 1, record_id: 1 });
syncConflictSchema.index({ created_at: 1 });
syncConflictSchema.index({ resolved_at: 1 });

// Methods
syncConflictSchema.methods.resolve = async function(resolution: Resolution) {
  this.resolution = resolution;
  this.resolved_at = new Date();
  await this.save();

  // Update the related sync queue item
  const SyncQueue = model('SyncQueue');
  const queueItem = await SyncQueue.findById(this.queue_item);
  
  if (queueItem) {
    if (resolution === 'client_wins') {
      queueItem.status = 'pending';
    } else {
      queueItem.status = 'completed';
      queueItem.processed_at = new Date();
    }
    await queueItem.save();
  }
};

syncConflictSchema.methods.getDiff = function(): Record<string, { client: any; server: any }> {
  const diff: Record<string, { client: any; server: any }> = {};
  
  // Compare client and server data
  const allKeys = new Set([
    ...Object.keys(this.client_data),
    ...Object.keys(this.server_data),
  ]);

  allKeys.forEach(key => {
    const clientValue = this.client_data[key];
    const serverValue = this.server_data[key];
    
    if (JSON.stringify(clientValue) !== JSON.stringify(serverValue)) {
      diff[key] = {
        client: clientValue,
        server: serverValue,
      };
    }
  });

  return diff;
};

export const SyncConflict = model<ISyncConflict>('SyncConflict', syncConflictSchema);