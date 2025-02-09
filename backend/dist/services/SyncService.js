"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const models_1 = require("../models");
const database_1 = require("../utils/database");
const config_1 = require("../config");
class SyncService {
    /**
     * Process pending sync queue items
     */
    async processSyncQueue() {
        const session = await (0, database_1.getConnection)().startSession();
        try {
            await session.withTransaction(async () => {
                const pendingItems = await models_1.SyncQueue.find({ status: 'pending' })
                    .limit(config_1.config.sync.batchSize)
                    .sort({ created_at: 1 })
                    .session(session);
                for (const item of pendingItems) {
                    await this.processSyncItem(item, session);
                }
            });
        }
        finally {
            await session.endSession();
        }
    }
    /**
     * Process a single sync queue item
     */
    async processSyncItem(item, session) {
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
        }
        catch (error) {
            // Mark as failed
            item.status = 'failed';
            await item.save({ session });
            throw error;
        }
    }
    /**
     * Check for conflicts
     */
    async checkForConflict(item) {
        var _a;
        const Model = (0, database_1.getConnection)().model(item.table_name);
        const current = await Model.findById(item.record_id);
        if (!current) {
            return item.operation !== 'insert';
        }
        return current.version > ((((_a = item.data) === null || _a === void 0 ? void 0 : _a.version) || 0));
    }
    /**
     * Handle sync conflict
     */
    async handleConflict(item, session) {
        const Model = (0, database_1.getConnection)().model(item.table_name);
        const current = await Model.findById(item.record_id).session(session);
        // Create conflict record
        await models_1.SyncConflict.create([{
                queue_id: item._id,
                table_name: item.table_name,
                record_id: item.record_id,
                client_data: item.data || {},
                server_data: (current === null || current === void 0 ? void 0 : current.toObject()) || null,
            }], { session });
        // Update sync queue item status
        item.status = 'conflict';
        await item.save({ session });
    }
    /**
     * Apply changes from sync queue item
     */
    async applyChanges(item, session) {
        const Model = (0, database_1.getConnection)().model(item.table_name);
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
                await Model.findByIdAndUpdate(item.record_id, { $set: item.data }, { session, new: true });
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
    async addToSyncQueue(table_name, operation, record_id, data) {
        return await models_1.SyncQueue.create({
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
    async getSyncConflicts(userId) {
        return await models_1.SyncConflict.find({
            'client_data.userId': userId,
            resolution: null,
        }).sort({ created_at: -1 });
    }
    /**
     * Resolve sync conflict
     */
    async resolveSyncConflict(conflictId, resolution, session) {
        const conflict = await models_1.SyncConflict.findById(conflictId).session(session);
        if (!conflict) {
            throw new Error('Conflict not found');
        }
        const Model = (0, database_1.getConnection)().model(conflict.table_name);
        if (resolution === 'client_wins' && conflict.client_data) {
            await Model.findByIdAndUpdate(conflict.record_id, { $set: conflict.client_data }, { session });
        }
        conflict.resolution = resolution;
        conflict.resolved_at = new Date();
        await conflict.save({ session });
    }
}
exports.SyncService = SyncService;
