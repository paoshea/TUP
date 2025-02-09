"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupNotifications = exports.processPendingNotifications = exports.markNotificationAsRead = exports.getUserNotifications = exports.registerPushToken = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const notificationService = new services_1.NotificationService();
/**
 * Register push token
 */
exports.registerPushToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw (0, apiResponse_1.unauthorized)('User not authenticated');
    }
    const { token, platform } = req.body;
    if (!token || !platform) {
        throw (0, apiResponse_1.badRequest)('Token and platform are required');
    }
    const pushToken = await notificationService.registerToken(userId, token, platform);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Push token registered successfully',
        data: pushToken,
    });
});
/**
 * Get user's notifications
 */
exports.getUserNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw (0, apiResponse_1.unauthorized)('User not authenticated');
    }
    const notifications = await notificationService.getUserNotifications(userId);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Notifications retrieved successfully',
        data: notifications,
    });
});
/**
 * Mark notification as read
 */
exports.markNotificationAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw (0, apiResponse_1.unauthorized)('User not authenticated');
    }
    const { notificationId } = req.params;
    if (!notificationId) {
        throw (0, apiResponse_1.badRequest)('Notification ID is required');
    }
    const notification = await notificationService.markAsRead(notificationId);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Notification marked as read',
        data: notification,
    });
});
/**
 * Process pending notifications
 * This endpoint is typically called by a scheduled job
 */
exports.processPendingNotifications = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await notificationService.sendPendingNotifications();
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Pending notifications processed',
    });
});
/**
 * Clean up old notifications and unused tokens
 * This endpoint is typically called by a scheduled job
 */
exports.cleanupNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { daysToKeep = '30', daysUnused = '30' } = req.query;
    await Promise.all([
        notificationService.deleteOldNotifications(Number(daysToKeep)),
        notificationService.cleanupUnusedTokens(Number(daysUnused)),
    ]);
    return (0, apiResponse_1.sendSuccess)(res, {
        message: 'Cleanup completed successfully',
    });
});
