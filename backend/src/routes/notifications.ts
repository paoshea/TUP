import { Router } from 'express';
import {
  registerPushToken,
  getUserNotifications,
  markNotificationAsRead,
  processPendingNotifications,
  cleanupNotifications,
} from '../controllers/NotificationController';
import { authenticate } from '../middleware';

const router = Router();

// Register push token
router.post(
  '/tokens',
  authenticate,
  registerPushToken
);

// Get user's notifications
router.get(
  '/',
  authenticate,
  getUserNotifications
);

// Mark notification as read
router.post(
  '/:notificationId/read',
  authenticate,
  markNotificationAsRead
);

// Process pending notifications (protected endpoint, typically called by a scheduled job)
router.post(
  '/process',
  authenticate,
  processPendingNotifications
);

// Clean up old notifications and unused tokens (protected endpoint, typically called by a scheduled job)
router.post(
  '/cleanup',
  authenticate,
  cleanupNotifications
);

export default router;