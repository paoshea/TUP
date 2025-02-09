"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const models_1 = require("../models");
const database_1 = require("../utils/database");
const mongoose_1 = require("mongoose");
class NotificationService {
    /**
     * Register a push token for a user
     */
    async registerToken(userId, token, platform) {
        const existingToken = await models_1.PushToken.findOne({ token });
        if (existingToken) {
            existingToken.user = new mongoose_1.Types.ObjectId(userId);
            existingToken.platform = platform;
            existingToken.last_used = new Date();
            return await existingToken.save();
        }
        return await models_1.PushToken.create({
            user: new mongoose_1.Types.ObjectId(userId),
            token,
            platform,
        });
    }
    /**
     * Create a notification
     */
    async createNotification(userId, type, title, body, data = {}) {
        return await models_1.Notification.create({
            user: new mongoose_1.Types.ObjectId(userId),
            type,
            title,
            body,
            data,
            status: 'pending',
        });
    }
    /**
     * Get user's notifications
     */
    async getUserNotifications(userId) {
        return await models_1.Notification.find({ user: new mongoose_1.Types.ObjectId(userId) })
            .sort({ created_at: -1 })
            .limit(100);
    }
    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        return await models_1.Notification.findByIdAndUpdate(notificationId, {
            $set: {
                read: true,
                read_at: new Date(),
            },
        }, { new: true });
    }
    /**
     * Send pending notifications
     * This is typically called by a scheduled job
     */
    async sendPendingNotifications() {
        const session = await (0, database_1.getConnection)().startSession();
        try {
            await session.withTransaction(async () => {
                const pendingNotifications = await models_1.Notification.find({ status: 'pending' })
                    .limit(100)
                    .session(session);
                for (const notification of pendingNotifications) {
                    const tokens = await models_1.PushToken.find({
                        user: notification.user,
                    }).session(session);
                    if (tokens.length === 0) {
                        await notification.markAsFailed();
                        continue;
                    }
                    try {
                        // Here you would integrate with FCM, APNS, or web push
                        // For now, we'll just mark it as sent
                        await notification.markAsSent();
                        // Update token last_used
                        for (const token of tokens) {
                            await token.updateLastUsed();
                        }
                    }
                    catch (error) {
                        await notification.markAsFailed();
                    }
                }
            });
        }
        finally {
            await session.endSession();
        }
    }
    /**
     * Delete old notifications
     * This is typically called by a scheduled job
     */
    async deleteOldNotifications(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        await models_1.Notification.deleteMany({
            created_at: { $lt: cutoffDate },
        });
    }
    /**
     * Clean up unused tokens
     * This is typically called by a scheduled job
     */
    async cleanupUnusedTokens(daysUnused = 30) {
        await models_1.PushToken.cleanupExpiredTokens(daysUnused);
    }
}
exports.NotificationService = NotificationService;
