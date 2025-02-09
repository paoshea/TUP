import { Request, Response } from 'express';
import { SyncService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, unauthorized } from '../utils/apiResponse';

const syncService = new SyncService();

/**
 * Add item to sync queue
 */
export const addToSyncQueue = asyncHandler(async (req: Request, res: Response) => {
  const { table_name, operation, record_id, data } = req.body;

  const syncItem = await syncService.addToSyncQueue(
    table_name,
    operation,
    record_id,
    data
  );

  return sendSuccess(res, {
    message: 'Item added to sync queue',
    data: syncItem,
  });
});

/**
 * Get sync conflicts
 */
export const getSyncConflicts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw unauthorized('User not authenticated');
  }

  const conflicts = await syncService.getSyncConflicts(userId);

  return sendSuccess(res, {
    message: 'Sync conflicts retrieved',
    data: conflicts,
  });
});

/**
 * Resolve sync conflict
 */
export const resolveSyncConflict = asyncHandler(async (req: Request, res: Response) => {
  const { conflictId, resolution } = req.body;

  await syncService.resolveSyncConflict(conflictId, resolution);

  return sendSuccess(res, {
    message: 'Sync conflict resolved',
  });
});

/**
 * Process sync queue
 * This endpoint is typically called by a scheduled job
 */
export const processSyncQueue = asyncHandler(async (_req: Request, res: Response) => {
  await syncService.processSyncQueue();

  return sendSuccess(res, {
    message: 'Sync queue processed',
  });
});