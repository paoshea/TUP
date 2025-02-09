"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncConflict = void 0;
const mongoose_1 = require("mongoose");
const syncConflictSchema = new mongoose_1.Schema({
    queue_item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SyncQueue',
        required: true,
    },
    table_name: {
        type: String,
        required: true,
    },
    record_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    client_data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    server_data: {
        type: mongoose_1.Schema.Types.Mixed,
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
syncConflictSchema.methods.resolve = async function (resolution) {
    this.resolution = resolution;
    this.resolved_at = new Date();
    await this.save();
    // Update the related sync queue item
    const SyncQueue = (0, mongoose_1.model)('SyncQueue');
    const queueItem = await SyncQueue.findById(this.queue_item);
    if (queueItem) {
        if (resolution === 'client_wins') {
            queueItem.status = 'pending';
        }
        else {
            queueItem.status = 'completed';
            queueItem.processed_at = new Date();
        }
        await queueItem.save();
    }
};
syncConflictSchema.methods.getDiff = function () {
    const diff = {};
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
exports.SyncConflict = (0, mongoose_1.model)('SyncConflict', syncConflictSchema);
