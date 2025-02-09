"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSyncQueue = exports.resolveSyncConflict = exports.getSyncConflicts = exports.addToSyncQueue = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const syncService = new services_1.SyncService();
/**
 * Add item to sync queue
 */
exports.addToSyncQueue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { table_name, operation, record_id, data } = req.body;
    const syncItem = await syncService.addToSyncQueue(table_name, operation, record_id, data);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Item added to sync queue',
        data: syncItem,
    });
});
/**
 * Get sync conflicts
 */
exports.getSyncConflicts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw (0, apiResponse_1.unauthorized)('User not authenticated');
    }
    const conflicts = await syncService.getSyncConflicts(userId);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Sync conflicts retrieved',
        data: conflicts,
    });
});
/**
 * Resolve sync conflict
 */
exports.resolveSyncConflict = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { conflictId, resolution } = req.body;
    await syncService.resolveSyncConflict(conflictId, resolution);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Sync conflict resolved',
    });
});
/**
 * Process sync queue
 * This endpoint is typically called by a scheduled job
 */
exports.processSyncQueue = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await syncService.processSyncQueue();
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Sync queue processed',
    });
});
