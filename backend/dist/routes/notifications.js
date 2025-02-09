"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Register push token
router.post('/tokens', middleware_1.authenticate, NotificationController_1.registerPushToken);
// Get user's notifications
router.get('/', middleware_1.authenticate, NotificationController_1.getUserNotifications);
// Mark notification as read
router.post('/:notificationId/read', middleware_1.authenticate, NotificationController_1.markNotificationAsRead);
// Process pending notifications (protected endpoint, typically called by a scheduled job)
router.post('/process', middleware_1.authenticate, NotificationController_1.processPendingNotifications);
// Clean up old notifications and unused tokens (protected endpoint, typically called by a scheduled job)
router.post('/cleanup', middleware_1.authenticate, NotificationController_1.cleanupNotifications);
exports.default = router;
