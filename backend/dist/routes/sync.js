"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SyncController_1 = require("../controllers/SyncController");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Add item to sync queue
router.post('/queue', middleware_1.authenticate, SyncController_1.addToSyncQueue);
// Get sync conflicts
router.get('/conflicts', middleware_1.authenticate, SyncController_1.getSyncConflicts);
// Resolve sync conflict
router.post('/conflicts/:id/resolve', middleware_1.authenticate, SyncController_1.resolveSyncConflict);
// Process sync queue (protected endpoint, typically called by a scheduled job)
router.post('/process', middleware_1.authenticate, SyncController_1.processSyncQueue);
exports.default = router;
