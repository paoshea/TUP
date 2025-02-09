import { Router } from 'express';
import { addToSyncQueue, getSyncConflicts, resolveSyncConflict, processSyncQueue } from '../controllers/SyncController';
import { authenticate } from '../middleware';

const router = Router();

// Add item to sync queue
router.post(
  '/queue',
  authenticate,
  addToSyncQueue
);

// Get sync conflicts
router.get(
  '/conflicts',
  authenticate,
  getSyncConflicts
);

// Resolve sync conflict
router.post(
  '/conflicts/:id/resolve',
  authenticate,
  resolveSyncConflict
);

// Process sync queue (protected endpoint, typically called by a scheduled job)
router.post(
  '/process',
  authenticate,
  processSyncQueue
);

export default router;