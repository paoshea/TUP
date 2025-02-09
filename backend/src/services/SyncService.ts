import { SyncQueue, ISyncQueue, SyncConflict, ISyncConflict } from '../models';
import { getConnection } from '../utils/database';
import { config } from '../config';

export class SyncService {
  /**
   * Process pending sync queue items
   */
  public async processSyncQueue(): Promise<void> {
    const session = await getConnection().startSession();

    try {
      await session.withTransaction(async () => {
        const pendingItems = await SyncQueue.find({ status: 'pending' })
          .limit(config.sync.batchSize)
          .sort({ created_at: 1 })
          .session(session);

        for (const item of pendingItems) {
          await this.processSyncItem(item, session);
        }
      });
    } finally {
      await session.endSession();
    }
  }

  /**
   * Process a single sync queue item
   */
  private async processSyncItem(item: ISyncQueue, session: any): Promise<void> {
    try {
      // Update status to processing
      item.status = 'processing';
      await item.save({ session });

      // Check for conflicts
      const hasConflict = await this.checkForConflict(item);
      if (hasConflict) {
        await this.handleConflict(item, session);
        return;
      }

      // Apply changes
      await this.applyChanges(item, session);

      // Mark as completed
      item.status = 'completed';
      item.processed_at = new Date();
      await item.save({ session });
    } catch (error) {
      // Mark as failed
      item.status = 'failed';
      await item.save({ session });
      throw error;
    }
  }

  /**
   * Check for conflicts
   */
  private async checkForConflict(item: ISyncQueue): Promise<boolean> {
    const Model = getConnection().model(item.table_name);
    const current = await Model.findById(item.record_id);

    if (!current) {
      return item.operation !== 'insert';
    }

    return current.version > ((item.data?.version || 0));
  }

  /**
   * Handle sync conflict
   */
  private async handleConflict(item: ISyncQueue, session: any): Promise<void> {
    const Model = getConnection().model(item.table_name);
    const current = await Model.findById(item.record_id).session(session);

    // Create conflict record
    await SyncConflict.create([{
      queue_id: item._id,
      table_name: item.table_name,
      record_id: item.record_id,
      client_data: item.data || {},
      server_data: current?.toObject() || null,
    }], { session });

    // Update sync queue item status
    item.status = 'conflict';
    await item.save({ session });
  }

  /**
   * Apply changes from sync queue item
   */
  private async applyChanges(item: ISyncQueue, session: any): Promise<void> {
    const Model = getConnection().model(item.table_name);

    switch (item.operation) {
      case 'insert':
        if (!item.data) {
          throw new Error('Data is required for insert operation');
        }
        await Model.create([item.data], { session });
        break;

      case 'update':
        if (!item.data) {
          throw new Error('Data is required for update operation');
        }
        await Model.findByIdAndUpdate(
          item.record_id,
          { $set: item.data },
          { session, new: true }
        );
        break;

      case 'delete':
        await Model.findByIdAndDelete(item.record_id, { session });
        break;

      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  }

  /**
   * Add item to sync queue
   */
  public async addToSyncQueue(
    table_name: string,
    operation: 'insert' | 'update' | 'delete',
    record_id: string,
    data?: any
  ): Promise<ISyncQueue> {
    return await SyncQueue.create({
      table_name,
      operation,
      record_id,
      data,
      status: 'pending',
    });
  }

  /**
   * Get sync conflicts
   */
  public async getSyncConflicts(userId: string): Promise<ISyncConflict[]> {
    return await SyncConflict.find({
      'client_data.userId': userId,
      resolution: null,
    }).sort({ created_at: -1 });
  }

  /**
   * Resolve sync conflict
   */
  public async resolveSyncConflict(
    conflictId: string,
    resolution: 'client_wins' | 'server_wins',
    session?: any
  ): Promise<void> {
    const conflict = await SyncConflict.findById(conflictId).session(session);
    if (!conflict) {
      throw new Error('Conflict not found');
    }

    const Model = getConnection().model(conflict.table_name);

    if (resolution === 'client_wins' && conflict.client_data) {
      await Model.findByIdAndUpdate(
        conflict.record_id,
        { $set: conflict.client_data },
        { session }
      );
    }

    conflict.resolution = resolution;
    conflict.resolved_at = new Date();
    await conflict.save({ session });
  }
}