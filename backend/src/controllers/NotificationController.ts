import { Request, Response } from 'express';
import { NotificationService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, unauthorized, badRequest } from '../utils/apiResponse';

const notificationService = new NotificationService();

/**
 * Register push token
 */
export const registerPushToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw unauthorized('User not authenticated');
  }

  const { token, platform } = req.body;
  if (!token || !platform) {
    throw badRequest('Token and platform are required');
  }

  const pushToken = await notificationService.registerToken(userId, token, platform);

  return sendSuccess(res, {
    message: 'Push token registered successfully',
    data: pushToken,
  });
});

/**
 * Get user's notifications
 */
export const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw unauthorized('User not authenticated');
  }

  const notifications = await notificationService.getUserNotifications(userId);

  return sendSuccess(res, {
    message: 'Notifications retrieved successfully',
    data: notifications,
  });
});

/**
 * Mark notification as read
 */
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw unauthorized('User not authenticated');
  }

  const { notificationId } = req.params;
  if (!notificationId) {
    throw badRequest('Notification ID is required');
  }

  const notification = await notificationService.markAsRead(notificationId);

  return sendSuccess(res, {
    message: 'Notification marked as read',
    data: notification,
  });
});

/**
 * Process pending notifications
 * This endpoint is typically called by a scheduled job
 */
export const processPendingNotifications = asyncHandler(async (_req: Request, res: Response) => {
  await notificationService.sendPendingNotifications();

  return sendSuccess(res, {
    message: 'Pending notifications processed',
  });
});

/**
 * Clean up old notifications and unused tokens
 * This endpoint is typically called by a scheduled job
 */
export const cleanupNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { daysToKeep = '30', daysUnused = '30' } = req.query;

  await Promise.all([
    notificationService.deleteOldNotifications(Number(daysToKeep)),
    notificationService.cleanupUnusedTokens(Number(daysUnused)),
  ]);

  return sendSuccess(res, {
    message: 'Cleanup completed successfully',
  });
});